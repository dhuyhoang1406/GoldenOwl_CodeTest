import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ScoreService } from './score.service';
import { LookupSbdParamDto } from './dto/lookup-sbd.param.dto';
import { TopGroupAQueryDto } from './dto/top-group-a.query.dto';
import { Subject } from './subject.class';

@Controller('scores')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get('subjects')
  getSubjects(): { key: string; label: string; group: string }[] {
    return Subject.getAll().map((s) => ({
      key: s.key,
      label: s.label,
      group: s.group,
    }));
  }

  @Get('lookup/:sbd')
  async lookup(@Param() params: LookupSbdParamDto) {
    const score = await this.scoreService.findBySbd(params.sbd);
    if (!score) {
      throw new NotFoundException(
        `Không tìm thấy điểm cho số báo danh ${params.sbd}`,
      );
    }
    return score;
  }

  @Get('report/distribution')
  async distribution() {
    const data = await this.scoreService.getScoreDistribution();
    return {
      description:
        'Thống kê số thí sinh theo 4 mức điểm (>=8, [6,8), [4,6), <4) cho từng môn',
      subjects: data,
    };
  }

  @Get('report/top-group-a')
  async topGroupA(@Query() query: TopGroupAQueryDto) {
    const students = await this.scoreService.getTopGroupA(query.limit ?? 10);
    return {
      description: 'Top thí sinh khối A (Toán, Vật lí, Hóa học)',
      group: 'A',
      subjects: ['toan', 'vat_li', 'hoa_hoc'],
      students,
    };
  }
}
