import { PrismaService } from '../prisma/prisma.service';
import { CreateUserGroupDto, UpdateUserGroupDto } from '../users/dto/user.dto';
export declare class UserGroupsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    private ensureExists;
    private toResponse;
    private isUniqueConstraintError;
}
