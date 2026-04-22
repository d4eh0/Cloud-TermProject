package com.yu.cloudattend.yu_cloudattend.config;

import com.yu.cloudattend.yu_cloudattend.entity.AttendanceLog;
import com.yu.cloudattend.yu_cloudattend.entity.ClassSession;
import com.yu.cloudattend.yu_cloudattend.entity.Course;
import com.yu.cloudattend.yu_cloudattend.entity.Student;
import com.yu.cloudattend.yu_cloudattend.entity.Takes;
import com.yu.cloudattend.yu_cloudattend.repository.AttendanceLogRepository;
import com.yu.cloudattend.yu_cloudattend.repository.ClassSessionRepository;
import com.yu.cloudattend.yu_cloudattend.repository.CourseRepository;
import com.yu.cloudattend.yu_cloudattend.repository.StudentRepository;
import com.yu.cloudattend.yu_cloudattend.repository.TakesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final TakesRepository takesRepository;
    private final ClassSessionRepository classSessionRepository;
    private final AttendanceLogRepository attendanceLogRepository;

    @Bean
    public ApplicationRunner initData() {
        return args -> {

            // ── 1. 학생 ──────────────────────────────────────────────
            Student student = studentRepository.findByStudentId("22211111")
                    .orElseGet(() -> {
                        Student s = new Student();
                        s.setStudentId("22211111");
                        s.setPassword("1q2w3e4r!");
                        s.setName("김똘똘");
                        s.setDepartment("컴퓨터공학과");
                        return studentRepository.save(s);
                    });

            // ── 2. 과목 ──────────────────────────────────────────────
            Course os = courseRepository.findByCourseCode("1102")
                    .orElseGet(() -> courseRepository.save(
                            new Course(null, "운영체제", "1102", "IT관(E21-114)")));

            Course arch = courseRepository.findByCourseCode("1103")
                    .orElseGet(() -> courseRepository.save(
                            new Course(null, "컴퓨터구조", "1103", "IT관(E21-114)")));

            Course cloud = courseRepository.findByCourseCode("1104")
                    .orElseGet(() -> courseRepository.save(
                            new Course(null, "클라우드컴퓨팅", "1104", "IT관(E21-114)")));

            List<Course> courses = List.of(os, arch, cloud);

            // ── 3. 수강 관계 ─────────────────────────────────────────
            List<Takes> existingTakes = takesRepository.findByStudent(student);
            Set<Long> enrolledIds = existingTakes.stream()
                    .map(t -> t.getCourse().getId())
                    .collect(Collectors.toSet());

            for (Course course : courses) {
                if (!enrolledIds.contains(course.getId())) {
                    takesRepository.save(new Takes(null, student, course));
                }
            }

            // ── 4. 학기 시작일 자동 계산 ─────────────────────────────
            LocalDate today = LocalDate.now();
            int month = today.getMonthValue();
            int year  = today.getYear();

            // 1~8월 → 1학기(3/1), 9~12월 → 2학기(9/1)
            LocalDate semesterStart = (month <= 8)
                    ? LocalDate.of(year, 3, 1)
                    : LocalDate.of(year, 9, 1);

            System.out.printf("[DataInitializer] 학기 시작일: %s%n", semesterStart);

            // ── 5. 15주차 정규 세션 생성 ──────────────────────────────
            // 운영체제: 월/수 10:30-11:45
            LocalDate firstMonday    = nextOrSame(semesterStart, DayOfWeek.MONDAY);
            LocalDate firstWednesday = nextOrSame(semesterStart, DayOfWeek.WEDNESDAY);

            for (int week = 0; week < 15; week++) {
                createSessionIfAbsent(os,   firstMonday.plusWeeks(week),    LocalTime.of(10, 30), LocalTime.of(11, 45));
                createSessionIfAbsent(os,   firstWednesday.plusWeeks(week), LocalTime.of(10, 30), LocalTime.of(11, 45));
            }

            // 컴퓨터구조: 화/목 13:30-14:45
            LocalDate firstTuesday  = nextOrSame(semesterStart, DayOfWeek.TUESDAY);
            LocalDate firstThursday = nextOrSame(semesterStart, DayOfWeek.THURSDAY);

            for (int week = 0; week < 15; week++) {
                createSessionIfAbsent(arch, firstTuesday.plusWeeks(week),  LocalTime.of(13, 30), LocalTime.of(14, 45));
                createSessionIfAbsent(arch, firstThursday.plusWeeks(week), LocalTime.of(13, 30), LocalTime.of(14, 45));
            }

            // 클라우드컴퓨팅: 금 10:00-11:45
            LocalDate firstFriday = nextOrSame(semesterStart, DayOfWeek.FRIDAY);

            for (int week = 0; week < 15; week++) {
                createSessionIfAbsent(cloud, firstFriday.plusWeeks(week), LocalTime.of(10, 0), LocalTime.of(11, 45));
            }

            // ── 6. 출석 로그 생성 (오늘 이전 세션만 PRESENT) ──────────
            for (Course course : courses) {
                List<ClassSession> sessions = classSessionRepository
                        .findByCourseInAndSessionDateBetweenOrderBySessionDateAsc(
                                List.of(course), semesterStart, semesterStart.plusWeeks(20));

                for (ClassSession session : sessions) {
                    // 오늘 날짜 세션은 스킵 (데모 세션에서 별도 처리)
                    if (!session.getSessionDate().isBefore(today)) continue;

                    List<AttendanceLog> existing =
                            attendanceLogRepository.findByStudentAndClassSession(student, session);
                    if (existing.isEmpty()) {
                        attendanceLogRepository.save(new AttendanceLog(
                                null, student, session,
                                AttendanceLog.AttendanceStatus.PRESENT,
                                LocalDateTime.of(session.getSessionDate(), session.getStartTime().plusMinutes(5)),
                                null, null
                        ));
                    }
                }
            }

            // ── 7. 오늘 날짜 데모 세션 생성/갱신 ────────────────────────
            // 정규 세션이 오늘과 겹칠 수 있으므로 기존 세션을 찾아 시간을 덮어씀
            LocalTime now  = LocalTime.now();
            LocalTime base = now.withMinute((now.getMinute() / 10) * 10).withSecond(0).withNano(0);

            // 운영체제: 이미 끝난 수업 (base -2h ~ -1h) + 출석 처리
            ClassSession osSession = upsertTodaySession(os, today,
                    base.minusHours(2), base.minusHours(1));
            if (attendanceLogRepository.findByStudentAndClassSession(student, osSession).isEmpty()) {
                attendanceLogRepository.save(new AttendanceLog(
                        null, student, osSession,
                        AttendanceLog.AttendanceStatus.PRESENT,
                        LocalDateTime.of(today, osSession.getStartTime().plusMinutes(5)),
                        null, null
                ));
            }
            System.out.printf("[DataInitializer] 오늘 운영체제 세션: %s ~ %s (출석 완료)%n",
                    osSession.getStartTime(), osSession.getEndTime());

            // 컴퓨터구조: 수업 5분 전 (base +10분 시작, 10분 단위 유지)
            LocalTime archStart = base.plusMinutes(10);
            ClassSession archSession = upsertTodaySession(arch, today, archStart, archStart.plusMinutes(80));
            System.out.printf("[DataInitializer] 오늘 컴퓨터구조 세션: %s ~ %s (수업 중)%n",
                    archSession.getStartTime(), archSession.getEndTime());

            // 클라우드컴퓨팅: 이따 수업 (base +2h ~ +3h20m)
            LocalTime cloudStart = base.plusHours(2);
            ClassSession cloudSession = upsertTodaySession(cloud, today, cloudStart, cloudStart.plusMinutes(80));
            System.out.printf("[DataInitializer] 오늘 클라우드컴퓨팅 세션: %s ~ %s (수업 전)%n",
                    cloudSession.getStartTime(), cloudSession.getEndTime());

            System.out.println("[DataInitializer] 초기화 완료.");
        };
    }

    private void createSessionIfAbsent(Course course, LocalDate date, LocalTime start, LocalTime end) {
        if (classSessionRepository.findByCourseInAndSessionDate(List.of(course), date).isEmpty()) {
            classSessionRepository.save(new ClassSession(null, course, date, start, end));
        }
    }

    /** 오늘 세션이 있으면 시간을 덮어쓰고, 없으면 새로 생성해서 반환 */
    private ClassSession upsertTodaySession(Course course, LocalDate date, LocalTime start, LocalTime end) {
        List<ClassSession> existing = classSessionRepository.findByCourseInAndSessionDate(List.of(course), date);
        if (!existing.isEmpty()) {
            ClassSession session = existing.get(0);
            session.setStartTime(start);
            session.setEndTime(end);
            return classSessionRepository.save(session);
        }
        return classSessionRepository.save(new ClassSession(null, course, date, start, end));
    }

    /** semesterStart 당일 포함, 해당 요일이거나 그 이후 첫 번째 날짜 반환 */
    private LocalDate nextOrSame(LocalDate from, DayOfWeek dow) {
        int diff = (dow.getValue() - from.getDayOfWeek().getValue() + 7) % 7;
        return from.plusDays(diff);
    }
}
