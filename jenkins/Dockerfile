FROM jenkins/jenkins:lts-jdk17

USER root

# Docker CLI 설치 (docker.sock으로 호스트 데몬에 명령 보내는 도구)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

RUN curl -fsSL https://download.docker.com/linux/debian/gpg \
    | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

RUN echo "deb [arch=$(dpkg --print-architecture) \
    signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
    https://download.docker.com/linux/debian \
    $(lsb_release -cs) stable" \
    > /etc/apt/sources.list.d/docker.list

# Docker Demon은 설치ㅏ안해도 됨. 실제 실행은 socket을 통해 호스트 dockerd가 수행.
RUN apt-get update && apt-get install -y docker-ce-cli docker-compose-plugin

# jenkins 유저를 docker 그룹에 추가
# (소켓 파일 접근 권한)
RUN groupadd -f docker && usermod -aG docker jenkins

USER jenkins
