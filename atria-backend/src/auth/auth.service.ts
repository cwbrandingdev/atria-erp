import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    async login(loginDto: { email: string, password: string }) {
        return {
            email: loginDto.email,
            password: loginDto.password,
        };
    }
}
