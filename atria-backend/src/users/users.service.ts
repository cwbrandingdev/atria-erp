import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, RoleName } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ProvisionUserDto } from './dto/user.dto';

const SALT_ROUNDS = 12;

function slugifyName(name: string): string {
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

function generateTemporaryPassword(): string {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  const bytes = randomBytes(12);
  return Array.from(bytes, (byte) => chars[byte % chars.length]).join('');
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

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

  async provision(dto: ProvisionUserDto) {
    const role = await this.prisma.role.findUnique({
      where: { name: dto.role },
    });

    if (!role) {
      throw new BadRequestException(`Role ${dto.role} not found`);
    }

    if (dto.userGroupId) {
      const group = await this.prisma.userGroup.findUnique({
        where: { id: dto.userGroupId },
      });
      if (!group) {
        throw new NotFoundException('User group not found');
      }
    }

    const domain =
      dto.emailDomain?.trim().toLowerCase() ||
      this.configService.get<string>('COMPANY_EMAIL_DOMAIN', 'atria.com');

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
        hourlyRate:
          dto.hourlyRate !== undefined
            ? new Prisma.Decimal(dto.hourlyRate)
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

  private async generateUniqueEmail(name: string, domain: string): Promise<string> {
    const base = slugifyName(name);
    if (!base) {
      throw new BadRequestException('Unable to generate email from name');
    }

    let candidate = `${base}@${domain}`;
    let suffix = 1;

    while (await this.prisma.user.findUnique({ where: { email: candidate } })) {
      candidate = `${base}${suffix}@${domain}`;
      suffix += 1;
    }

    return candidate;
  }

  private toUserResponse(user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    hourlyRate: Prisma.Decimal | null;
    mustChangePassword: boolean;
    createdAt: Date;
    role: { name: RoleName };
    userGroup: {
      id: string;
      name: string;
      description: string | null;
      color: string;
    } | null;
  }) {
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
}
