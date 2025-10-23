import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async create(@Request() req: any, @Body() createJobDto: CreateJobDto) {
    return await this.jobService.create(req.user.id, createJobDto);
  }

  @Get()
  async findAll(@Request() req: any) {
    return await this.jobService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return await this.jobService.findOne(id, req.user.id);
  }

  @Patch(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return await this.jobService.update(id, req.user.id, updateJobDto);
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    return await this.jobService.remove(id, req.user.id);
  }
}
