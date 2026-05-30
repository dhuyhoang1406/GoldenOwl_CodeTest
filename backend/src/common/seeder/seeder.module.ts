import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from '../../module/score/score.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Score])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
