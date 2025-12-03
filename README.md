# Cloud-TermProject

# 클라우드 출석 관리 시스템 (Cloud Attendance System)

학생 출석 관리를 위한 웹 기반 시스템입니다. 
- 토큰 기반 출석 체크, 
- 실시간 출결 현황 조회, 
- 과목별 출석 이력 관리 등의 기능을 제공합니다.

## ✨ 주요 기능

### 1. 로그인 및 인증
<img width="271" height="427" alt="스크린샷 2025-12-03 16 50 46" src="https://github.com/user-attachments/assets/da9e8776-90f0-40f2-96e2-610fbdf69aa0" />

- 학생 학번 및 비밀번호 기반 로그인
- JWT 토큰 기반 인증
- 세션 관리 및 자동 로그아웃

### 2. 출석 체크
<img width="261" height="432" alt="스크린샷 2025-12-03 16 50 28" src="https://github.com/user-attachments/assets/84d41530-bed1-4db3-a1bf-fbc8d0021ac9" />

- 토큰 기반 출석 체크
- GPS 위치 정보 수집
- 출석 정책 모달 표시
- 출석 완료 후 자동 상태 업데이트

### 3. 오늘의 출결현황
<img width="254" height="431" alt="스크린샷 2025-12-03 16 51 07" src="https://github.com/user-attachments/assets/f86c5872-5730-4cb5-a544-3a352f09980b" />

- 오늘 예정된 수업 목록 조회
- 실시간 출석 상태 확인 (출석/지각/결석/미확인)
- 출석 체크 페이지로 이동
- 재조회 기능

### 4. 과목별 출결현황
<p align="center">
  <img src="https://github.com/user-attachments/assets/b49d5c7b-6c51-4517-80d9-063ca0ed51df" alt="과목별 출결현황1" width="45%" />
  <img src="https://github.com/user-attachments/assets/fdd505aa-a9ec-4453-8f3c-2a759207c151" alt="과목별 출결현황2" width="45%" />
</p>

- 수강 중인 과목 목록 조회
- 과목별 상세 출석 이력 확인
- 주차별/차시별 출석 상태 표시 (15주차 고정)
- 5개씩 그리드 레이아웃

## 🛠 기술 스택

### Backend
- **Java 17**
- **Spring Boot 4.0.0**
- **Spring Security** - 인증 및 보안
- **Spring Data JPA** - 데이터베이스 ORM
- **MySQL** - 데이터베이스
- **JWT** - 토큰 기반 인증
- **Gradle** - 빌드 도구

### Frontend
- **React 19.2.0**
- **React Router DOM 7.9.6** - 라우팅
- **Vite 7.2.4** - 빌드 도구
- **Tailwind CSS 4.1.17** - 스타일링
- **ESLint** - 코드 품질 관리

## 📁 프로젝트 구조

```
Cloud-TermProject/
├── backend/                    # Spring Boot 백엔드
│   ├── src/main/java/
│   │   └── com/yu/cloudattend/yu_cloudattend/
│   │       ├── config/         # 설정 클래스
│   │       ├── controller/     # REST API 컨트롤러
│   │       ├── dto/            # 데이터 전송 객체
│   │       ├── entity/         # JPA 엔티티
│   │       ├── repository/    # 데이터 접근 계층
│   │       ├── security/      # 보안 설정
│   │       ├── service/       # 비즈니스 로직
│   │       └── util/          # 유틸리티 클래스
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/                   # React 프론트엔드
│   ├── src/
│   │   ├── api/               # API 호출 함수
│   │   ├── components/        # 재사용 컴포넌트
│   │   ├── pages/             # 페이지 컴포넌트
│   │   ├── routes/            # 라우팅 설정
│   │   └── utils/             # 유틸리티 함수
│   └── public/                # 정적 파일
│
└── README.md
```
