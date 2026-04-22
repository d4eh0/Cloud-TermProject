# Stage 1: 빌드
# Node.js가 포함된 이미지로 React 앱을 정적 파일로 빌드
FROM node:20-alpine AS builder
WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci

# 소스 복사 후 빌드
COPY . .
RUN npm run build

# Stage 2: 서빙
# nginx로 빌드 결과물(dist/)을 정적 파일로 서빙
FROM nginx:alpine

# Stage 1에서 만든 빌드 결과물을 nginx 기본 서빙 경로로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# SPA fallback 설정
COPY nginx.conf /etc/nginx/conf.d/default.conf

# HTTP 기본 포트
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
