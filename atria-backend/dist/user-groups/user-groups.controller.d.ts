import { CreateUserGroupDto, UpdateUserGroupDto } from '../users/dto/user.dto';
import { UserGroupsService } from './user-groups.service';
export declare class UserGroupsController {
    private readonly userGroupsService;
    constructor(userGroupsService: UserGroupsService);
    findAll(): Promise<{
        id: string;
        name: string;
        description: string | null;
        color: string;
        userCount: number;
        createdAt: string;
        updatedAt: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        color: string;
        userCount: number;
        createdAt: string;
        updatedAt: string;
    }>;
    create(dto: CreateUserGroupDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        color: string;
        userCount: number;
        createdAt: string;
        updatedAt: string;
    }>;
    update(id: string, dto: UpdateUserGroupDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        color: string;
        userCount: number;
        createdAt: string;
        updatedAt: string;
    }>;
    remove(id: string): Promise<void>;
}
