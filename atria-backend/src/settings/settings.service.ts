import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAppearanceDto } from './dto/appearance.dto';
import { UpdateBrandingDto } from './dto/branding.dto';
import { UpdateIntegrationsDto } from './dto/integrations.dto';

export const DEFAULT_APPEARANCE = {
  primaryColor: '#004949',
  accentColor: '#E8C39E',
  backgroundColor: '#FFFFFF',
  textColor: '#0F172A',
} as const;

export const DEFAULT_BRANDING = {
  agencyName: 'ATRIA ERP',
  logoUrl: null as string | null,
  faviconUrl: null as string | null,
  primaryColor: '#004949',
  accentColor: '#E8C39E',
} as const;

const AGENCY_SETTINGS_ID = 'default';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAppearance(userId: string) {
    const settings = await this.prisma.userSettings.upsert({
      where: { userId },
      create: { userId, ...DEFAULT_APPEARANCE },
      update: {},
    });

    return this.toAppearanceResponse(settings);
  }

  async updateAppearance(userId: string, dto: UpdateAppearanceDto) {
    const settings = await this.prisma.userSettings.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: { ...dto },
    });

    return this.toAppearanceResponse(settings);
  }

  async getBranding() {
    const settings = await this.prisma.agencySettings.upsert({
      where: { id: AGENCY_SETTINGS_ID },
      create: { id: AGENCY_SETTINGS_ID, ...DEFAULT_BRANDING },
      update: {},
    });

    return this.toBrandingResponse(settings);
  }

  async updateBranding(dto: UpdateBrandingDto) {
    const settings = await this.prisma.agencySettings.upsert({
      where: { id: AGENCY_SETTINGS_ID },
      create: {
        id: AGENCY_SETTINGS_ID,
        ...DEFAULT_BRANDING,
        ...dto,
        logoUrl: dto.logoUrl ?? null,
        faviconUrl: dto.faviconUrl ?? null,
      },
      update: {
        ...dto,
        logoUrl:
          dto.logoUrl === null || dto.logoUrl === ''
            ? null
            : dto.logoUrl,
        faviconUrl:
          dto.faviconUrl === null || dto.faviconUrl === ''
            ? null
            : dto.faviconUrl,
      },
    });

    return this.toBrandingResponse(settings);
  }

  async getIntegrations() {
    const settings = await this.prisma.agencySettings.upsert({
      where: { id: AGENCY_SETTINGS_ID },
      create: { id: AGENCY_SETTINGS_ID, ...DEFAULT_BRANDING },
      update: {},
    });

    return this.toIntegrationsResponse(settings);
  }

  async updateIntegrations(dto: UpdateIntegrationsDto) {
    const settings = await this.prisma.agencySettings.upsert({
      where: { id: AGENCY_SETTINGS_ID },
      create: {
        id: AGENCY_SETTINGS_ID,
        ...DEFAULT_BRANDING,
        ...dto,
        slackWebhookUrl: dto.slackWebhookUrl ?? null,
        discordWebhookUrl: dto.discordWebhookUrl ?? null,
      },
      update: {
        ...dto,
        slackWebhookUrl:
          dto.slackWebhookUrl === null || dto.slackWebhookUrl === ''
            ? null
            : dto.slackWebhookUrl,
        discordWebhookUrl:
          dto.discordWebhookUrl === null || dto.discordWebhookUrl === ''
            ? null
            : dto.discordWebhookUrl,
      },
    });

    return this.toIntegrationsResponse(settings);
  }

  async updateBrandingAsset(
    type: 'logo' | 'favicon',
    fileUrl: string,
  ) {
    const data =
      type === 'logo'
        ? { logoUrl: fileUrl }
        : { faviconUrl: fileUrl };

    const settings = await this.prisma.agencySettings.upsert({
      where: { id: AGENCY_SETTINGS_ID },
      create: { id: AGENCY_SETTINGS_ID, ...DEFAULT_BRANDING, ...data },
      update: data,
    });

    return this.toBrandingResponse(settings);
  }

  private toAppearanceResponse(settings: {
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

  private toBrandingResponse(settings: {
    agencyName: string;
    logoUrl: string | null;
    faviconUrl: string | null;
    primaryColor: string;
    accentColor: string;
    updatedAt: Date;
  }) {
    return {
      agencyName: settings.agencyName,
      logoUrl: settings.logoUrl,
      faviconUrl: settings.faviconUrl,
      primaryColor: settings.primaryColor,
      accentColor: settings.accentColor,
      updatedAt: settings.updatedAt.toISOString(),
    };
  }

  private toIntegrationsResponse(settings: {
    slackWebhookUrl: string | null;
    discordWebhookUrl: string | null;
    notifyOnPostRejected: boolean;
    notifyOnContractSigned: boolean;
    updatedAt: Date;
  }) {
    return {
      slackWebhookUrl: settings.slackWebhookUrl,
      discordWebhookUrl: settings.discordWebhookUrl,
      notifyOnPostRejected: settings.notifyOnPostRejected,
      notifyOnContractSigned: settings.notifyOnContractSigned,
      updatedAt: settings.updatedAt.toISOString(),
    };
  }
}
