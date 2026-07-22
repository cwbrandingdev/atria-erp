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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClientsService = class ClientsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const clients = await this.prisma.client.findMany({
            orderBy: { companyName: 'asc' },
            include: {
                _count: { select: { posts: true } },
            },
        });
        return clients.map((client) => this.toClientResponse(client));
    }
    async findOne(id) {
        const client = await this.ensureClientExists(id);
        return this.toClientResponse(client);
    }
    async create(dto) {
        const client = await this.prisma.client.create({ data: dto });
        return this.toClientResponse(client);
    }
    async update(id, dto) {
        await this.ensureClientExists(id);
        const client = await this.prisma.client.update({
            where: { id },
            data: dto,
        });
        return this.toClientResponse(client);
    }
    async remove(id) {
        await this.ensureClientExists(id);
        await this.prisma.client.delete({ where: { id } });
    }
    async ensureClientExists(id) {
        const client = await this.prisma.client.findUnique({
            where: { id },
            include: { _count: { select: { posts: true } } },
        });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        return client;
    }
    toClientResponse(client) {
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
            postCount: client._count?.posts ?? 0,
            createdAt: client.createdAt.toISOString(),
            updatedAt: client.updatedAt.toISOString(),
        };
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientsService);
//# sourceMappingURL=clients.service.js.map