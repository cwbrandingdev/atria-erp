import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(clientGroupId?: string) {
    const clients = await this.prisma.client.findMany({
      where: clientGroupId ? { clientGroupId } : undefined,
      orderBy: { companyName: 'asc' },
      include: {
        clientGroup: true,
        _count: { select: { posts: true } },
      },
    });

    return clients.map((client) => this.toClientResponse(client));
  }

  async findOne(id: string) {
    const client = await this.ensureClientExists(id);
    return this.toClientResponse(client);
  }

  async create(dto: CreateClientDto) {
    if (dto.clientGroupId) {
      await this.ensureClientGroupExists(dto.clientGroupId);
    }

    const client = await this.prisma.client.create({
      data: dto,
      include: {
        clientGroup: true,
        _count: { select: { posts: true } },
      },
    });
    return this.toClientResponse(client);
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.ensureClientExists(id);

    if (dto.clientGroupId) {
      await this.ensureClientGroupExists(dto.clientGroupId);
    }

    const client = await this.prisma.client.update({
      where: { id },
      data: dto,
      include: {
        clientGroup: true,
        _count: { select: { posts: true } },
      },
    });
    return this.toClientResponse(client);
  }

  async remove(id: string) {
    await this.ensureClientExists(id);
    await this.prisma.client.delete({ where: { id } });
  }

  private async ensureClientExists(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        clientGroup: true,
        _count: { select: { posts: true } },
      },
    });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  private async ensureClientGroupExists(id: string) {
    const group = await this.prisma.clientGroup.findUnique({ where: { id } });
    if (!group) throw new NotFoundException('Client group not found');
  }

  private toClientResponse(client: {
    id: string;
    companyName: string;
    contactName: string | null;
    email: string | null;
    phone: string | null;
    instagram: string | null;
    website: string | null;
    street: string | null;
    number: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    notes: string | null;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    clientGroup?: {
      id: string;
      name: string;
      description: string | null;
      color: string;
    } | null;
    _count?: { posts: number };
  }) {
    const address = [client.street, client.number, client.city, client.state, client.zipCode]
      .filter(Boolean)
      .join(', ');

    return {
      id: client.id,
      companyName: client.companyName,
      contactName: client.contactName,
      email: client.email,
      phone: client.phone,
      instagram: client.instagram,
      website: client.website,
      street: client.street,
      number: client.number,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      address: address || null,
      notes: client.notes,
      avatarUrl: client.avatarUrl,
      clientGroup: client.clientGroup
        ? {
            id: client.clientGroup.id,
            name: client.clientGroup.name,
            description: client.clientGroup.description,
            color: client.clientGroup.color,
          }
        : null,
      postCount: client._count?.posts ?? 0,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    };
  }
}
