import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        email: string;
        password: string;
    }>;
}
