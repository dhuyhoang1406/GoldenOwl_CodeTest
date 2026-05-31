import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Score } from './module/score/score.entity';
import { CreateScoresTable1748610000000 } from './database/migrations/1748610000000-CreateScoresTable';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? 'gscores',
  ssl: { rejectUnauthorized: false },
  entities: [Score],
  migrations: [CreateScoresTable1748610000000],
  synchronize: false,
});
