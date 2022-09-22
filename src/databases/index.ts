import { DB_DATABASE, DB_USERNAME, DB_PASSWORD } from '@config';

export const dbConnection = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}/${DB_DATABASE}`;
