import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from './message/message.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MessageModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AppModule {}
