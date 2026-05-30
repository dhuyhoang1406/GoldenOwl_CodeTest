import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './score.entity';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Score])],
  controllers: [ScoreController],
  providers: [ScoreService],
  exports: [ScoreService],
})
export class ScoreModule {}
