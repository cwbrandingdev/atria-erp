import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAppearanceDto } from './dto/appearance.dto';

export const DEFAULT_APPEARANCE = {
  primaryColor: '#004949',
  accentColor: '#E8C39E',
  backgroundColor: '#FFFFFF',
  textColor: '#0F172A',
} as const;

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAppearance(userId: string) {
    const settings = await this.prisma.userSettings.upsert({
      where: { userId },
      create: { userId, ...DEFAULT_APPEARANCE },
      update: {},
    });

    return this.toResponse(settings);
  }

  async updateAppearance(userId: string, dto: UpdateAppearanceDto) {
    const settings = await this.prisma.userSettings.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: { ...dto },
    });

    return this.toResponse(settings);
  }

  private toResponse(settings: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    updatedAt: Date;
  }) {
    return {
      primaryColor: settings.primaryColor,
      accentColor: settings.accentColor,
      backgroundColor: settings.backgroundColor,
      textColor: settings.textColor,
      updatedAt: settings.updatedAt.toISOString(),
    };
  }
}
