# 클라우드 출석 관리 시스템 (Cloud Attendance System)

학생 출석 관리를 위한 웹 기반 시스템입니다. 토큰 기반 출석 체크, 실시간 출결 현황 조회, 과목별 출석 이력 관리 등의 기능을 제공합니다.

## 📋 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행](#설치-및-실행)
- [화면 캡쳐](#화면-캡쳐)
- [API 문서](#api-문서)
- [개발 환경 설정](#개발-환경-설정)

## ✨ 주요 기능

### 1. 로그인 및 인증
- 학생 학번 및 비밀번호 기반 로그인
- JWT 토큰 기반 인증
- 세션 관리 및 자동 로그아웃

### 2. 오늘의 출결현황
- 오늘 예정된 수업 목록 조회
- 실시간 출석 상태 확인 (출석/지각/결석/미확인)
- 출석 체크 페이지로 이동
- 재조회 기능

### 3. 출석 체크
- 토큰 기반 출석 체크
- GPS 위치 정보 수집
- 출석 정책 모달 표시
- 출석 완료 후 자동 상태 업데이트

### 4. 과목별 출결현황
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

## 🚀 설치 및 실행

### 사전 요구사항
- Java 17 이상
- Node.js 18 이상
- MySQL 8.0 이상
- Gradle 7.0 이상

### Backend 실행

1. **환경 변수 설정**
   ```bash
   cd backend
   ```
   
   `.env` 파일을 생성하고 다음 내용을 추가하세요:
   ```properties
   SPRING_PROFILES_ACTIVE=local
   SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/your_database
   SPRING_DATASOURCE_USERNAME=your_username
   SPRING_DATASOURCE_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key
   ```

2. **데이터베이스 생성**
   ```sql
   CREATE DATABASE your_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **애플리케이션 실행**
   ```bash
   ./gradlew bootRun
   ```
   
   또는 빌드 후 실행:
   ```bash
   ./gradlew build
   java -jar build/libs/yu-cloudattend-0.0.1-SNAPSHOT.jar
   ```

   백엔드는 기본적으로 `http://localhost:8080`에서 실행됩니다.

### Frontend 실행

1. **의존성 설치**
   ```bash
   cd frontend
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   
   프론트엔드는 기본적으로 `http://localhost:5173`에서 실행됩니다.

3. **프로덕션 빌드**
   ```bash
   npm run build
   npm run preview
   ```

## 📸 화면 캡쳐

### 1. 로그인 화면
![로그인 화면](./docs/screenshots/login.png)
- 학번과 비밀번호를 입력하여 로그인
- 로그인 실패 시 에러 메시지 표시

### 2. 오늘의 출결현황
![오늘의 출결현황](./docs/screenshots/today-attendance.png)
- 오늘 예정된 수업 목록 표시
- 각 수업의 출석 상태 확인
- 재조회 버튼으로 최신 정보 갱신
- 출석 체크 또는 상세 조회로 이동

### 3. 출석 체크 화면
![출석 체크 화면](./docs/screenshots/attendance-check.png)
- 토큰 기반 출석 체크
- 수업 정보 및 남은 시간 표시
- GPS 위치 정보 수집
- 출석 정책 확인 후 출석 체크

### 4. 과목별 출결현황
![과목별 출결현황](./docs/screenshots/attendance-history.png)
- 수강 중인 과목 목록
- 과목 클릭 시 상세 출석 이력 조회

### 5. 출석 상세 조회
![출석 상세 조회](./docs/screenshots/attendance-detail.png)
- 15주차 고정 표시
- 주차별/차시별 출석 상태 (예: 1-1차시, 1-2차시)
- 5개씩 그리드 레이아웃
- 출석/지각/결석 상태 색상 구분

> **참고**: 위 이미지 경로는 예시입니다. 실제 캡쳐 이미지를 `docs/screenshots/` 디렉토리에 추가하세요.

## 📡 API 문서

### 인증 API

#### 로그인
```http
POST /api/auth/login
Content-Type: application/json

{
  "studentId": "2021001",
  "password": "password123"
}
```

**응답:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "studentId": "2021001",
    "name": "홍길동",
    "department": "컴퓨터공학과"
  }
}
```

#### 현재 사용자 정보 조회
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### 출석 API

#### 오늘의 수업 목록 조회
```http
GET /api/attendance/today
Authorization: Bearer {token}
```

#### 출석 상세 조회
```http
GET /api/attendance/detail/{courseId}
Authorization: Bearer {token}
```

#### 토큰 기반 세션 조회
```http
GET /api/attendance/session?token={token}
Authorization: Bearer {token}
```

#### 출석 체크
```http
POST /api/attendance/check
Authorization: Bearer {token}
Content-Type: application/json

{
  "lectureId": 1,
  "latitude": 37.5665,
  "longitude": 126.9780,
  "deviceId": "device-123",
  "captchaToken": "captcha-token"
}
```

#### 수강 과목 목록 조회
```http
GET /api/attendance/history
Authorization: Bearer {token}
```

## ⚙️ 개발 환경 설정

### 데이터베이스 초기화

애플리케이션 실행 시 `DataInitializer`가 자동으로 테스트 데이터를 생성합니다:
- 학생 계정 (학번: 2021001, 비밀번호: password123)
- 과목 정보 (운영체제, 컴퓨터구조, 클라우드컴퓨팅)
- 15주차 분량의 수업 세션 데이터
- 출석 로그 데이터

### 환경 변수

백엔드 `.env` 파일에 필요한 환경 변수:
- `SPRING_PROFILES_ACTIVE`: 프로파일 설정 (local/prod)
- `SPRING_DATASOURCE_URL`: 데이터베이스 URL
- `SPRING_DATASOURCE_USERNAME`: 데이터베이스 사용자명
- `SPRING_DATASOURCE_PASSWORD`: 데이터베이스 비밀번호
- `JWT_SECRET`: JWT 서명 키

### CORS 설정

프론트엔드와 백엔드가 다른 포트에서 실행되는 경우, `SecurityConfig`에서 CORS 설정을 확인하세요.

## 📝 주요 기능 상세

### 출석 상태
- **출석 (PRESENT)**: 정상 출석
- **지각 (LATE)**: 지각 처리
- **결석 (ABSENT)**: 결석 처리
- **미확인**: 아직 출석 체크하지 않음

### 주차/차시 계산
- 기준 날짜: 2025년 9월 1일 (월요일)
- 운영체제, 컴퓨터구조: 주 2회 (월/수, 화/목)
- 클라우드컴퓨팅: 주 1회 (금)
- 각 과목별 15주차 고정 표시

### 보안 기능
- JWT 토큰 기반 인증
- 비밀번호 암호화 저장
- CORS 설정
- Protected Route를 통한 페이지 접근 제어

## 🤝 기여

이 프로젝트는 클라우드 컴퓨팅 수업의 터미널 프로젝트입니다.

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

---

**개발자**: YU Cloud Attend Team  
**버전**: 0.0.1-SNAPSHOT
