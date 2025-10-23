import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobLogService {
  constructor(private readonly prisma: PrismaService) {}

  async findByJobId(jobId: string, userId: string, limit = 50) {
    const job = await this.prisma.job.findFirst({
      where: { id: jobId, userId },
    });

    if (!job) {
      return [];
    }

    return this.prisma.jobLog.findMany({
      where: { jobId },
      orderBy: { executedAt: 'desc' },
      take: limit,
    });
  }

  async findByUserId(userId: string, limit = 100) {
    return this.prisma.jobLog.findMany({
      where: {
        job: {
          userId,
        },
      },
      include: {
        job: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
      },
      orderBy: { executedAt: 'desc' },
      take: limit,
    });
  }

  async deleteOldLogs(daysToKeep = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    return this.prisma.jobLog.deleteMany({
      where: {
        executedAt: {
          lt: cutoffDate,
        },
      },
    });
  }
}
