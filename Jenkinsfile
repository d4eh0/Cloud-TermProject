pipeline {
    agent any

    environment {
        IMAGE_NAME = "cloudattend-backend"
        IMAGE_TAG  = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build JAR') {
            steps {
                sh '''
                    cd backend
                    chmod +x gradlew
                    ./gradlew clean bootJar -x test
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ./backend
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                '''
            }
        }

    }

    post {
        success {
            echo "========== ✅ BUILD SUCCESS =========="
            echo "Image: ${IMAGE_NAME}:${IMAGE_TAG}"
        }
        failure {
            echo "========== ❌ BUILD FAILED =========="
        }
    }
}
