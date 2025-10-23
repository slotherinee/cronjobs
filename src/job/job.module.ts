import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { JobProcessor } from './job.processor';
import { JobSchedulerService } from './job-scheduler.service';
import { JobLogModule } from '../job-log/job-log.module';

@Module({
  imports: [
    JobLogModule,
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'jobs',
    }),
  ],
  controllers: [JobController],
  providers: [JobService, JobProcessor, JobSchedulerService],
  exports: [JobService],
})
export class JobModule {}
