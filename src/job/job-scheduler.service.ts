import {
  Injectable,
  Logger,
  OnModuleInit,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JobService } from './job.service';
import type { JobExecutionData } from './job.processor';

@Injectable()
export class JobSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(JobSchedulerService.name);

  constructor(
    @InjectQueue('jobs') private jobQueue: Queue,
    @Inject(forwardRef(() => JobService))
    private jobService: JobService,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing job scheduler...');
    await this.syncJobs();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async syncJobs() {
    const activeJobs = await this.jobService.findAllActive();

    for (const job of activeJobs) {
      await this.scheduleJob(
        job.id,
        job.name,
        job.url,
        job.method,
        job.headers,
        job.body,
        job.schedule,
        job.userId,
      );
    }
  }

  async scheduleJob(
    id: string,
    name: string,
    url: string,
    method: string,
    headers: string | null,
    body: string | null,
    cronExpression: string,
    userId: string,
  ) {
    try {
      const repeatableJobs = await this.jobQueue.getRepeatableJobs();
      const existingJob = repeatableJobs.find((j) => j.id === id);

      if (existingJob) {
        if (existingJob.cron !== cronExpression) {
          await this.jobQueue.removeRepeatableByKey(existingJob.key);
          this.logger.log(`Updated schedule for job: ${name}`);
        } else {
          return;
        }
      }

      await this.jobQueue.add(
        'execute',
        {
          id,
          name,
          url,
          method,
          headers: headers || undefined,
          body: body || undefined,
          userId,
        } as JobExecutionData,
        {
          repeat: {
            cron: cronExpression,
          },
          jobId: id,
          removeOnComplete: true,
          removeOnFail: false,
        },
      );

      this.logger.log(`Scheduled job: ${name} with cron: ${cronExpression}`);
    } catch (error) {
      this.logger.error(`Failed to schedule job ${name}:`, error);
    }
  }

  async unscheduleJob(id: string) {
    try {
      const repeatableJobs = await this.jobQueue.getRepeatableJobs();
      const job = repeatableJobs.find((j) => j.id === id);

      if (job) {
        await this.jobQueue.removeRepeatableByKey(job.key);
        this.logger.log(`Unscheduled job: ${id}`);
      }
    } catch (error) {
      this.logger.error(`Failed to unschedule job ${id}:`, error);
    }
  }
}
