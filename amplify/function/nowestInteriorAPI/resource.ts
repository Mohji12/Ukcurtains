import { defineFunction } from '@aws-amplify/backend';

export const nowestInteriorAPI = defineFunction({
  name: 'nowestInteriorAPI',
  entry: './src/index.js',
  environment: {
    NODE_ENV: 'production',
    DATABASE_URL: 'mysql+pymysql://admin:AKumawat8437@menteetracker.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com:3306/nowest_interior',
    SESSION_SECRET: 'nowest-interior-session-secret-2024-production',
    AWS_REGION: 'ap-south-1'
  },
  timeoutSeconds: 30,
  memoryMB: 1024
});

