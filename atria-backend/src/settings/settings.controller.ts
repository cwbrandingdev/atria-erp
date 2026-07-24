import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateAppearanceDto } from './dto/appearance.dto';
import { UpdateBrandingDto } from './dto/branding.dto';
import { UpdateIntegrationsDto } from './dto/integrations.dto';
import { SettingsService } from './settings.service';

const BRANDING_UPLOAD_DIR = join(process.cwd(), 'uploads', 'branding');
const ALLOWED_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon',
]);

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('branding')
  getBranding() {
    return this.settingsService.getBranding();
  }

  @Patch('branding')
  @UseGuards(JwtAuthGuard)
  updateBranding(@Body() dto: UpdateBrandingDto) {
    return this.settingsService.updateBranding(dto);
  }

  @Get('integrations')
  @UseGuards(JwtAuthGuard)
  getIntegrations() {
    return this.settingsService.getIntegrations();
  }

  @Patch('integrations')
  @UseGuards(JwtAuthGuard)
  updateIntegrations(@Body() dto: UpdateIntegrationsDto) {
    return this.settingsService.updateIntegrations(dto);
  }

  @Post('branding/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          if (!existsSync(BRANDING_UPLOAD_DIR)) {
            mkdirSync(BRANDING_UPLOAD_DIR, { recursive: true });
          }
          cb(null, BRANDING_UPLOAD_DIR);
        },
        filename: (_req, file, cb) => {
          const unique = `${randomUUID()}${extname(file.originalname)}`;
          cb(null, unique);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
          cb(new BadRequestException('Invalid image type'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  uploadBrandingAsset(
    @Query('type') type: 'logo' | 'favicon',
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!type || !['logo', 'favicon'].includes(type)) {
      throw new BadRequestException('Query param type must be logo or favicon');
    }

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const fileUrl = `/uploads/branding/${file.filename}`;
    return this.settingsService.updateBrandingAsset(type, fileUrl);
  }

  @Get('appearance')
  @UseGuards(JwtAuthGuard)
  getAppearance(@CurrentUser() user: AuthenticatedUser) {
    return this.settingsService.getAppearance(user.userId);
  }

  @Patch('appearance')
  @UseGuards(JwtAuthGuard)
  updateAppearance(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateAppearanceDto,
  ) {
    return this.settingsService.updateAppearance(user.userId, dto);
  }
}
