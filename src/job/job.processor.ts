import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type JobExecutionData = {
  id: string;
  name: string;
  url: string;
  method: string;
  headers?: string;
  body?: string;
  userId: string;
};

@Injectable()
@Processor('jobs')
export class JobProcessor {
  constructor(private readonly prisma: PrismaService) {}

  @Process('execute')
  async handleJobExecution(job: Job<JobExecutionData>) {
    const { id, url, method, headers, body } = job.data;
    const startTime = Date.now();

    try {
      let parsedHeaders: Record<string, string> = {
        'User-Agent': 'CronJobs-Service/1.0',
      };

      if (headers) {
        try {
          const customHeaders = JSON.parse(headers) as Record<string, string>;
          parsedHeaders = { ...parsedHeaders, ...customHeaders };
        } catch {
          // Invalid JSON, ignore custom headers
        }
      }

      const fetchOptions: RequestInit = {
        method: method || 'GET',
        headers: parsedHeaders,
      };

      if (body && method !== 'GET' && method !== 'HEAD') {
        fetchOptions.body = body;
        if (!parsedHeaders['Content-Type'] && !parsedHeaders['content-type']) {
          parsedHeaders['Content-Type'] = 'application/json';
        }
      }

      const response = await fetch(url, fetchOptions);

      const duration = Date.now() - startTime;
      const responseText = await response.text();

      await this.prisma.jobLog.create({
        data: {
          jobId: id,
          status: response.ok ? 'success' : 'error',
          statusCode: response.status,
          response: responseText.substring(0, 10000),
          duration,
        },
      });

      return {
        success: response.ok,
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      await this.prisma.jobLog.create({
        data: {
          jobId: id,
          status: 'error',
          response: errorMessage,
          duration,
        },
      });

      throw error;
    }
  }
}
