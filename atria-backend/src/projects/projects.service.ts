import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  private readonly projects: CreateProjectDto[] = [];

  findAll(): CreateProjectDto[] {
    return this.projects;
  }

  create(createProjectDto: CreateProjectDto): CreateProjectDto {
    this.projects.push(createProjectDto);
    return createProjectDto;
  }
}
