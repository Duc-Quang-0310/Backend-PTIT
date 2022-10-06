import dotenv from 'dotenv';

dotenv.config({
  path: '.env.development.local',
});

export default {
  port: process.env.PORT,

  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },

  jwtSecret: process.env.SECRET_KEY,
  jwtExpiredAccessTokenTime: process.env.EXPIRED_ACCESS_TOKEN,
  jwtExpiredRefreshTokenTime: process.env.EXPIRED_REFRESH_TOKEN,
};
