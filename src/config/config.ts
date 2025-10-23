export default () => {
  const DB_HOST = process.env.DB_HOST || 'pgsql';
  const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
  const DB_DATABASE = process.env.DB_DATABASE || 'pgsql';
  const DB_USERNAME = process.env.DB_USERNAME || 'pgsql';
  const DB_PASSWORD = process.env.DB_PASSWORD || 'pgsql';

  return {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
      DB_CONNECTION: process.env.DB_CONNECTION || 'pgsql',
      DB_HOST: process.env.DB_HOST || 'pgsql',
      DB_PORT: DB_PORT || 5432,
      DB_DATABASE: process.env.DB_DATABASE || 'pgsql',
      DB_USERNAME: process.env.DB_USERNAME || 'pgsql',
      DB_PASSWORD: process.env.DB_PASSWORD || 'pgsql',
      DATABASE_URL:
        process.env.DATABASE_URL ||
        `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?schema=public`,
    },
  };
};
