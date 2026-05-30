import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { ScoreModule } from './module/score/score.module';
import { SeederModule } from './common/seeder/seeder.module';
import { Score } from './module/score/score.entity';
import { CreateScoresTable1748610000000 } from './database/migrations/1748610000000-CreateScoresTable';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        entities: [Score],
        migrations: [CreateScoresTable1748610000000],
        migrationsRun: true,
        synchronize: false,
      }),
    }),
    ScoreModule,
    SeederModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
