import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { ContentService } from './content.service';
import { CreateContentPostDto, QueryContentPostsDto, UpdateContentPostDto } from './dto/content-post.dto';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    getOverview(clientId?: string): Promise<{
        drafts: number;
        pendingApproval: number;
        scheduled: number;
        published: number;
        total: number;
    }>;
    getCalendar(from?: string, to?: string, clientId?: string): Promise<{
        id: string;
        title: string;
        platform: string;
        scheduledDate: string;
        status: string;
        clientName: string;
        color: string;
    }[]>;
    getPosts(query: QueryContentPostsDto): Promise<{
        id: string;
        title: string;
        clientId: string;
        client: {
            id: string;
            companyName: string;
            instagram: string | null;
            avatarUrl: string | null;
        };
        platform: "instagram" | "tiktok" | "youtube" | "linkedin";
        format: "carousel" | "reels" | "static" | "story";
        scheduledDate: string | null;
        status: "draft" | "pending_approval" | "scheduled" | "published";
        copy: string;
        attachments: {
            id: string;
            createdAt: Date;
            name: string;
            url: string;
            mimeType: string | null;
            postId: string;
        }[];
        author: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
        assignee: {
            id: string;
            avatarUrl: string | null;
            name: string;
        } | null;
        platformColor: string;
        createdAt: string;
        updatedAt: string;
    }[]>;
    createPost(user: AuthenticatedUser, dto: CreateContentPostDto): Promise<{
        id: string;
        title: string;
        clientId: string;
        client: {
            id: string;
            companyName: string;
            instagram: string | null;
            avatarUrl: string | null;
        };
        platform: "instagram" | "tiktok" | "youtube" | "linkedin";
        format: "carousel" | "reels" | "static" | "story";
        scheduledDate: string | null;
        status: "draft" | "pending_approval" | "scheduled" | "published";
        copy: string;
        attachments: {
            id: string;
            createdAt: Date;
            name: string;
            url: string;
            mimeType: string | null;
            postId: string;
        }[];
        author: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
        assignee: {
            id: string;
            avatarUrl: string | null;
            name: string;
        } | null;
        platformColor: string;
        createdAt: string;
        updatedAt: string;
    }>;
    updatePost(id: string, dto: UpdateContentPostDto): Promise<{
        id: string;
        title: string;
        clientId: string;
        client: {
            id: string;
            companyName: string;
            instagram: string | null;
            avatarUrl: string | null;
        };
        platform: "instagram" | "tiktok" | "youtube" | "linkedin";
        format: "carousel" | "reels" | "static" | "story";
        scheduledDate: string | null;
        status: "draft" | "pending_approval" | "scheduled" | "published";
        copy: string;
        attachments: {
            id: string;
            createdAt: Date;
            name: string;
            url: string;
            mimeType: string | null;
            postId: string;
        }[];
        author: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
        assignee: {
            id: string;
            avatarUrl: string | null;
            name: string;
        } | null;
        platformColor: string;
        createdAt: string;
        updatedAt: string;
    }>;
    deletePost(id: string): Promise<void>;
}
