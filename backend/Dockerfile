# Stage 1: 빌드
# JDK + Gradle이 포함된 이미지로 .jar 파일 생성
FROM gradle:8-jdk17 AS builder
WORKDIR /app

COPY . .
# 테스트는 건너뛰고 빌드
RUN ./gradlew bootJar -x test --no-daemon

# Stage 2: 실행
# JDK는 컴파일러까지 포함해서 무거움
# 실행할 때는 JRE(실행 환경)만 있으면 충분
FROM eclipse-temurin:17-jre
WORKDIR /app

# Stage 1에서 만든 .jar 파일 가져오기
COPY --from=builder /app/build/libs/*.jar app.jar
# Spring Boot 기본 포트
EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
