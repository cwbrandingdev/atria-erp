import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { AssetsService } from './assets.service';
import { CreateAssetDto, QueryAssetsDto } from './dto/asset.dto';
export declare class AssetsController {
    private readonly assetsService;
    constructor(assetsService: AssetsService);
    findAll(query: QueryAssetsDto): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            companyName: string;
            avatarUrl: string | null;
        };
        fileName: string;
        fileType: "image" | "logo" | "brand_guide" | "document";
        fileUrl: string;
        fileSize: number;
        uploadedBy: {
            id: string;
            avatarUrl: string | null;
            name: string;
        } | null;
        uploadedAt: string;
    }[]>;
    findGrouped(): Promise<{
        client: {
            id: string;
            companyName: string;
            avatarUrl: string | null;
        };
        assets: ReturnType<any>[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            companyName: string;
            avatarUrl: string | null;
        };
        fileName: string;
        fileType: "image" | "logo" | "brand_guide" | "document";
        fileUrl: string;
        fileSize: number;
        uploadedBy: {
            id: string;
            avatarUrl: string | null;
            name: string;
        } | null;
        uploadedAt: string;
    }>;
    upload(user: AuthenticatedUser, dto: CreateAssetDto, file: Express.Multer.File): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            companyName: string;
            avatarUrl: string | null;
        };
        fileName: string;
        fileType: "image" | "logo" | "brand_guide" | "document";
        fileUrl: string;
        fileSize: number;
        uploadedBy: {
            id: string;
            avatarUrl: string | null;
            name: string;
        } | null;
        uploadedAt: string;
    }>;
    remove(id: string): Promise<void>;
}
