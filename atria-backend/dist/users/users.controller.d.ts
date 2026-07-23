import { ProvisionUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
}
