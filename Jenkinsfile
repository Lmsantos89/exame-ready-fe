pipeline {
    agent any
    
    environment {
        AWS_REGION = 'eu-central-1'
        AMPLIFY_APP_ID = 'dbkvrj2plpji0' 
        BRANCH_NAME = 'staging'
        S3_BUCKET = 'exam-ready-frontend-staging-builds'
        BUILD_ZIP = "exam-ready-${BUILD_NUMBER}.zip"
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
                sh 'npm run build -- --configuration=staging'
            }
        }
        
        stage('Package') {
            steps {
                // Create amplify.yml file
                sh '''
                cat > amplify.yml << 'EOL'
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "No build needed - using pre-built artifacts"
    build:
      commands:
        - echo "Skip build"
  artifacts:
    baseDirectory: .
    files:
      - '**/*'
  cache:
    paths: []
EOL
                '''
                
                // Debug the build output structure
                sh 'find dist -type f | sort'
                
                // Add amplify.yml to the build directory
                sh 'cp amplify.yml dist/exam-ready/'
                
                // Create zip with all files
                sh 'cd dist/exam-ready && zip -r ../../${BUILD_ZIP} .'
            }
        }
        
        stage('Upload to S3') {
            steps {
                withAWS(region: env.AWS_REGION, credentials: 'jenkins-deployment-user') {
                    s3Upload(
                        bucket: env.S3_BUCKET,
                        path: "${BUILD_ZIP}",
                        file: "${BUILD_ZIP}"
                    )
                }
            }
        }
        
        stage('Deploy to Amplify') {
            steps {
                withAWS(region: env.AWS_REGION, credentials: 'jenkins-deployment-user') {
                    sh '''
                    S3_URL="s3://${S3_BUCKET}/${BUILD_ZIP}"
                    echo "Deploying from $S3_URL"
                    
                    aws amplify start-deployment \
                      --app-id ${AMPLIFY_APP_ID} \
                      --branch-name ${BRANCH_NAME} \
                      --source-url $S3_URL
                    '''
                }
            }
        }
    }
}
