import { PrismaService } from '../prisma/prisma.service';
import { UpdateAppearanceDto } from './dto/appearance.dto';
export declare const DEFAULT_APPEARANCE: {
    readonly primaryColor: "#004949";
    readonly accentColor: "#E8C39E";
    readonly backgroundColor: "#FFFFFF";
    readonly textColor: "#0F172A";
};
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAppearance(userId: string): Promise<{
        primaryColor: string;
        accentColor: string;
        backgroundColor: string;
        textColor: string;
        updatedAt: string;
    }>;
    updateAppearance(userId: string, dto: UpdateAppearanceDto): Promise<{
        primaryColor: string;
        accentColor: string;
        backgroundColor: string;
        textColor: string;
        updatedAt: string;
    }>;
    private toResponse;
}
