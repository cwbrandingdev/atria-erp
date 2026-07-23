import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ProvisionUserDto } from './dto/user.dto';
export declare class UsersService {
    private readonly prisma;
    private readonly configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    findAll(): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        avatarUrl: string | null;
        hourlyRate: number | null;
        mustChangePassword: boolean;
        userGroup: {
            id: string;
            name: string;
            description: string | null;
            color: string;
        } | null;
        createdAt: string;
    }[]>;
    provision(dto: ProvisionUserDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            avatarUrl: string | null;
            hourlyRate: number | null;
            mustChangePassword: boolean;
            userGroup: {
                id: string;
                name: string;
                description: string | null;
                color: string;
            } | null;
            createdAt: string;
        };
        credentials: {
            email: string;
            temporaryPassword: string;
        };
    }>;
    private generateUniqueEmail;
    private toUserResponse;
}
