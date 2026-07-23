import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserGroupDto,
  UpdateUserGroupDto,
} from '../users/dto/user.dto';

@Injectable()
export class UserGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const groups = await this.prisma.userGroup.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { users: true } } },
    });

    return groups.map((group) => this.toResponse(group));
  }

  async findOne(id: string) {
    const group = await this.ensureExists(id);
    return this.toResponse(group);
  }

  async create(dto: CreateUserGroupDto) {
    try {
      const group = await this.prisma.userGroup.create({
        data: {
          name: dto.name.trim(),
          description: dto.description?.trim(),
          color: dto.color ?? '#E8C39E',
        },
        include: { _count: { select: { users: true } } },
      });
      return this.toResponse(group);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('User group name already exists');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateUserGroupDto) {
    await this.ensureExists(id);

    try {
      const group = await this.prisma.userGroup.update({
        where: { id },
        data: {
          name: dto.name?.trim(),
          description: dto.description?.trim(),
          color: dto.color,
        },
        include: { _count: { select: { users: true } } },
      });
      return this.toResponse(group);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('User group name already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.userGroup.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const group = await this.prisma.userGroup.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });
    if (!group) throw new NotFoundException('User group not found');
    return group;
  }

  private toResponse(group: {
    id: string;
    name: string;
    description: string | null;
    color: string;
    createdAt: Date;
    updatedAt: Date;
    _count?: { users: number };
  }) {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      color: group.color,
      userCount: group._count?.users ?? 0,
      createdAt: group.createdAt.toISOString(),
      updatedAt: group.updatedAt.toISOString(),
    };
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    );
  }
}
