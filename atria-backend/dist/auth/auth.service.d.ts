export declare class AuthService {
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        email: string;
        password: string;
    }>;
}
