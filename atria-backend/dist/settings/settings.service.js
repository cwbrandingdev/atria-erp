"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = exports.DEFAULT_APPEARANCE = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
exports.DEFAULT_APPEARANCE = {
    primaryColor: '#004949',
    accentColor: '#E8C39E',
    backgroundColor: '#FFFFFF',
    textColor: '#0F172A',
};
let SettingsService = class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAppearance(userId) {
        const settings = await this.prisma.userSettings.upsert({
            where: { userId },
            create: { userId, ...exports.DEFAULT_APPEARANCE },
            update: {},
        });
        return this.toResponse(settings);
    }
    async updateAppearance(userId, dto) {
        const settings = await this.prisma.userSettings.upsert({
            where: { userId },
            create: { userId, ...dto },
            update: { ...dto },
        });
        return this.toResponse(settings);
    }
    toResponse(settings) {
        return {
            primaryColor: settings.primaryColor,
            accentColor: settings.accentColor,
            backgroundColor: settings.backgroundColor,
            textColor: settings.textColor,
            updatedAt: settings.updatedAt.toISOString(),
        };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map