import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobSchedulerService } from './job-scheduler.service';

@Injectable()
export class JobService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => JobSchedulerService))
    private readonly jobSchedulerService: JobSchedulerService,
  ) {}

  async create(userId: string, createJobDto: CreateJobDto) {
    const job = await this.prisma.job.create({
      data: {
        ...createJobDto,
        userId,
      },
    });

    if (job.isActive) {
      await this.jobSchedulerService.scheduleJob(
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

    return job;
  }

  async findAll(userId: string) {
    return await this.prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return await this.prisma.job.findFirst({
      where: { id, userId },
    });
  }

  async update(id: string, userId: string, updateJobDto: UpdateJobDto) {
    const updatedJob = await this.prisma.job.update({
      where: { id, userId },
      data: updateJobDto,
    });

    if (updateJobDto.isActive === false) {
      await this.jobSchedulerService.unscheduleJob(id);
    } else if (updatedJob.isActive) {
      await this.jobSchedulerService.scheduleJob(
        updatedJob.id,
        updatedJob.name,
        updatedJob.url,
        updatedJob.method,
        updatedJob.headers,
        updatedJob.body,
        updatedJob.schedule,
        updatedJob.userId,
      );
    }

    return updatedJob;
  }

  async remove(id: string, userId: string) {
    await this.jobSchedulerService.unscheduleJob(id);

    return await this.prisma.job.delete({
      where: { id, userId },
    });
  }

  async findAllActive() {
    return await this.prisma.job.findMany({
      where: { isActive: true },
    });
  }
}
