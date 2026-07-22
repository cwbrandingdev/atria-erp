import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(): CreateProjectDto[];
    create(createProjectDto: CreateProjectDto): CreateProjectDto;
}
