import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface UserResponse {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl: string | null;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: UserResponse;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: UserResponse;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: UserResponse;
    }>;
    logout(refreshToken: string): Promise<void>;
    getProfile(userId: string): Promise<UserResponse>;
    private generateTokens;
    private storeRefreshToken;
    private hashToken;
    private getRefreshExpirationDate;
    private toUserResponse;
    generateSecureToken(): string;
}
