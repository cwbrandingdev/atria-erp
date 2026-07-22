import { CreateProjectDto } from './dto/create-project.dto';
export declare class ProjectsService {
    private readonly projects;
    findAll(): CreateProjectDto[];
    create(createProjectDto: CreateProjectDto): CreateProjectDto;
}
