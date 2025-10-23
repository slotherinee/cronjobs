import { Module } from '@nestjs/common';
import { JobLogService } from './job-log.service';
import { JobLogController } from './job-log.controller';

@Module({
  controllers: [JobLogController],
  providers: [JobLogService],
  exports: [JobLogService],
})
export class JobLogModule {}
