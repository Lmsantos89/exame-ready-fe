pipeline {
    agent any
    
    environment {
        // Change these variables according to your setup
        S3_BUCKET = 'exam-ready-frontend-staging'
        AWS_REGION = 'eu-central-1'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Build') {
            steps {
                // Build for staging environment
                sh 'npm run build -- --configuration=staging --verbose'
            }
        }
        
        stage('Deploy to S3') {
            steps {
                // Configure AWS credentials
                withAWS(region: env.AWS_REGION, credentials: 'jenkins-deployment-user') {
                    // Sync the build directory with the S3 bucket
                    s3Upload(
                        bucket: env.S3_BUCKET,
                        path: '/',
                        includePathPattern: '**/*',
                        workingDir: 'dist/exam-ready/browser',
                        acl: 'PublicRead'
                    )
                }
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}