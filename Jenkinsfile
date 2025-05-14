pipeline {
    agent any
    
    environment {
        AWS_REGION = 'eu-central-1'
        AMPLIFY_APP_ID = 'dbkvrj2plpji0' 
        BRANCH_NAME = 'staging'
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
        
        stage('Install Amplify CLI') {
            steps {
                sh 'npm install -g @aws-amplify/cli'
            }
        }
        
        stage('Deploy to Amplify') {
            steps {
                withAWS(region: env.AWS_REGION, credentials: 'jenkins-deployment-user') {
                    sh '''
                    # Create amplify config file
                    mkdir -p ~/.aws
                    cat > ~/.aws/config << EOL
[profile jenkins-deployment-user]
region = ${AWS_REGION}
EOL
                    
                    # Deploy using Amplify CLI
                    amplify push \
                      --appId ${AMPLIFY_APP_ID} \
                      --envName ${BRANCH_NAME} \
                      --yes
                      
                    # Publish the frontend
                    amplify publish \
                      --appId ${AMPLIFY_APP_ID} \
                      --envName ${BRANCH_NAME} \
                      --yes \
                      --distributionDir dist/exam-ready
                    '''
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
