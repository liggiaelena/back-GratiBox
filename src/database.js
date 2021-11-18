import pg from 'pg';

const { Pool } = pg;

let connectionData = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT, 10),
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
  };

if(process.env.NODE_ENV === 'prod'){
    connectionData = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      };
}

const connection = new Pool(connectionData);

export default connection;