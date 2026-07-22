import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { type AuthenticatedUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    register(dto: RegisterDto, res: Response): Promise<{
        user: import("./auth.service").UserResponse;
        accessToken: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        user: import("./auth.service").UserResponse;
        accessToken: string;
    }>;
    refresh(req: Request, dto: RefreshTokenDto, res: Response): Promise<{
        user: import("./auth.service").UserResponse;
        accessToken: string;
    }>;
    logout(req: Request, dto: RefreshTokenDto, res: Response): Promise<void>;
    getProfile(user: AuthenticatedUser): Promise<import("./auth.service").UserResponse>;
    private setRefreshTokenCookie;
    private clearRefreshTokenCookie;
}
