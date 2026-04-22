package com.yu.cloudattend.yu_cloudattend.service;

import com.yu.cloudattend.yu_cloudattend.dto.LoginResponse;
import com.yu.cloudattend.yu_cloudattend.dto.UserDto;
import com.yu.cloudattend.yu_cloudattend.entity.Student;
import com.yu.cloudattend.yu_cloudattend.repository.StudentRepository;
import com.yu.cloudattend.yu_cloudattend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final StudentRepository studentRepository;
    private final JwtUtil jwtUtil;

    public LoginResponse login(String studentId, String password) {
        log.info("[AuthService] 로그인 시도 - studentId={}", studentId);

        Optional<Student> studentOpt = studentRepository.findByStudentId(studentId);

        if (studentOpt.isEmpty()) {
            log.warn("[AuthService] 존재하지 않는 학번 - studentId={}", studentId);
            return LoginResponse.failure("학번 또는 비밀번호가 올바르지 않습니다.");
        }

        Student student = studentOpt.get();

        if (!student.getPassword().equals(password)) {
            log.warn("[AuthService] 비밀번호 불일치 - studentId={}", studentId);
            return LoginResponse.failure("학번 또는 비밀번호가 올바르지 않습니다.");
        }

        String token = jwtUtil.generateToken(student.getId(), student.getStudentId());
        log.info("[AuthService] 토큰 발급 완료 - studentId={}", studentId);

        UserDto userDto = new UserDto(
                student.getId(),
                student.getStudentId(),
                student.getName(),
                student.getDepartment()
        );

        return LoginResponse.success(userDto, token);
    }

    public UserDto getUserById(Long userId) {
        log.debug("[AuthService] 사용자 조회 - userId={}", userId);

        Optional<Student> studentOpt = studentRepository.findById(userId);

        if (studentOpt.isEmpty()) {
            log.warn("[AuthService] 사용자 없음 - userId={}", userId);
            return null;
        }

        Student student = studentOpt.get();
        return new UserDto(
                student.getId(),
                student.getStudentId(),
                student.getName(),
                student.getDepartment()
        );
    }
}
