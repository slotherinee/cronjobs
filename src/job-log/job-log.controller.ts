import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { JobLogService } from './job-log.service';

@Controller('job-logs')
@UseGuards(JwtAuthGuard)
export class JobLogController {
  constructor(private readonly jobLogService: JobLogService) {}

  @Get('job/:jobId')
  async getJobLogs(
    @Param('jobId') jobId: string,
    @Query('limit') limit: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.jobLogService.findByJobId(jobId, userId, limitNum);
  }

  @Get()
  async getAllLogs(@Query('limit') limit: string, @Req() req: any) {
    const userId = req.user.userId;
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.jobLogService.findByUserId(userId, limitNum);
  }
}
