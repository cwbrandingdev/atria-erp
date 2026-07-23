"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const SALT_ROUNDS = 12;
function slugifyName(name) {
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part.replace(/[^a-z0-9]/g, ''))
        .filter(Boolean)
        .join('.');
}
function generateTemporaryPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    const bytes = (0, crypto_1.randomBytes)(12);
    return Array.from(bytes, (byte) => chars[byte % chars.length]).join('');
}
let UsersService = class UsersService {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            orderBy: { name: 'asc' },
            include: {
                role: true,
                userGroup: true,
            },
        });
        return users.map((user) => this.toUserResponse(user));
    }
    async provision(dto) {
        const role = await this.prisma.role.findUnique({
            where: { name: dto.role },
        });
        if (!role) {
            throw new common_1.BadRequestException(`Role ${dto.role} not found`);
        }
        if (dto.userGroupId) {
            const group = await this.prisma.userGroup.findUnique({
                where: { id: dto.userGroupId },
            });
            if (!group) {
                throw new common_1.NotFoundException('User group not found');
            }
        }
        const domain = dto.emailDomain?.trim().toLowerCase() ||
            this.configService.get('COMPANY_EMAIL_DOMAIN', 'atria.com');
        const email = await this.generateUniqueEmail(dto.name, domain);
        const temporaryPassword = generateTemporaryPassword();
        const passwordHash = await bcrypt.hash(temporaryPassword, SALT_ROUNDS);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name.trim(),
                email,
                passwordHash,
                roleId: role.id,
                userGroupId: dto.userGroupId,
                hourlyRate: dto.hourlyRate !== undefined
                    ? new client_1.Prisma.Decimal(dto.hourlyRate)
                    : undefined,
                mustChangePassword: true,
            },
            include: {
                role: true,
                userGroup: true,
            },
        });
        return {
            user: this.toUserResponse(user),
            credentials: {
                email,
                temporaryPassword,
            },
        };
    }
    async generateUniqueEmail(name, domain) {
        const base = slugifyName(name);
        if (!base) {
            throw new common_1.BadRequestException('Unable to generate email from name');
        }
        let candidate = `${base}@${domain}`;
        let suffix = 1;
        while (await this.prisma.user.findUnique({ where: { email: candidate } })) {
            candidate = `${base}${suffix}@${domain}`;
            suffix += 1;
        }
        return candidate;
    }
    toUserResponse(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.name.toLowerCase(),
            avatarUrl: user.avatarUrl,
            hourlyRate: user.hourlyRate ? Number(user.hourlyRate) : null,
            mustChangePassword: user.mustChangePassword,
            userGroup: user.userGroup
                ? {
                    id: user.userGroup.id,
                    name: user.userGroup.name,
                    description: user.userGroup.description,
                    color: user.userGroup.color,
                }
                : null,
            createdAt: user.createdAt.toISOString(),
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], UsersService);
//# sourceMappingURL=users.service.js.map