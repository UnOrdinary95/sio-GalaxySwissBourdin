export const isProd = process.env.NODE_ENV === 'production';
export const DB_USER = process.env.POSTGRES_USER || 'admin';
export const DB_PASSWORD = process.env.POSTGRES_PASSWORD || 'changeme';
export const DB_HOST = process.env.POSTGRES_HOST || 'localhost';
export const DB_PORT =
    parseInt(process.env.POSTGRES_PORT || '5432', 10) || 5432;
export const DB_NAME = process.env.POSTGRES_DB || 'gsb_db';

export const BACKEND_PORT = process.env.BACKEND_PORT || '3100';
export const FRONTEND_PORT = process.env.FRONTEND_PORT || '5173';
