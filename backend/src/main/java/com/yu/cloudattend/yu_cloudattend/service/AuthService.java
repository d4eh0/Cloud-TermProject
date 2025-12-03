package com.yu.cloudattend.yu_cloudattend.service;

import com.yu.cloudattend.yu_cloudattend.dto.LoginResponse;
import com.yu.cloudattend.yu_cloudattend.dto.UserDto;
import com.yu.cloudattend.yu_cloudattend.entity.Student;
import com.yu.cloudattend.yu_cloudattend.repository.StudentRepository;
import com.yu.cloudattend.yu_cloudattend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final StudentRepository studentRepository;
    private final JwtUtil jwtUtil;
    
    /**
     * 로그인 처리
     * @param studentId 학번
     * @param password 비밀번호
     * @return LoginResponse
     */
    public LoginResponse login(String studentId, String password) {
        // 학생 조회
        Optional<Student> studentOpt = studentRepository.findByStudentId(studentId);
        
        if (studentOpt.isEmpty()) {
            return LoginResponse.failure("학번 또는 비밀번호가 올바르지 않습니다.");
        }
        
        Student student = studentOpt.get();
        
        // 비밀번호 검증 (일단 평문 비교, 나중에 BCrypt로 변경 가능)
        if (!student.getPassword().equals(password)) {
            return LoginResponse.failure("학번 또는 비밀번호가 올바르지 않습니다.");
        }
        
        // JWT 토큰 생성
        String token = jwtUtil.generateToken(student.getId(), student.getStudentId());
        
        // UserDto 생성
        UserDto userDto = new UserDto(
                student.getId(),
                student.getStudentId(),
                student.getName(),
                student.getDepartment()
        );
        
        // 성공 응답 반환 (토큰은 컨트롤러에서 쿠키에 저장)
        LoginResponse response = LoginResponse.success(userDto);
        // 토큰은 별도로 저장 (컨트롤러에서 쿠키에 설정)
        return response;
    }
    
    /**
     * 사용자 ID로 학생 정보 조회
     * @param userId 사용자 ID
     * @return UserDto
     */
    public UserDto getUserById(Long userId) {
        Optional<Student> studentOpt = studentRepository.findById(userId);
        
        if (studentOpt.isEmpty()) {
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

