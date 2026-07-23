import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { ContentService } from './content.service';
import { CreateContentPostDto, QueryContentPostsDto, UpdateContentPostDto } from './dto/content-post.dto';
import { CreatePostVersionDto, RejectContentPostDto } from './dto/content-workflow.dto';
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
        status: "draft" | "pending_approval" | "approved" | "rejected" | "scheduled" | "published";
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
    getPostHistory(id: string): Promise<{
        versions: {
            id: string;
            postId: string;
            versionNumber: number;
            versionLabel: string;
            title: string;
            copyText: string;
            mediaUrls: string[];
            createdBy: {
                id: string;
                avatarUrl: string | null;
                name: string;
            };
            createdAt: string;
        }[];
        feedback: {
            id: string;
            postId: string;
            versionId: string | null;
            versionLabel: string | null;
            comment: string;
            type: "rejection_reason" | "general_note";
            user: {
                id: string;
                avatarUrl: string | null;
                name: string;
            };
            createdAt: string;
        }[];
        timeline: ({
            kind: "version";
            id: string;
            createdAt: string;
            data: {
                id: string;
                postId: string;
                versionNumber: number;
                versionLabel: string;
                title: string;
                copyText: string;
                mediaUrls: string[];
                createdBy: {
                    id: string;
                    avatarUrl: string | null;
                    name: string;
                };
                createdAt: string;
            };
        } | {
            kind: "feedback";
            id: string;
            createdAt: string;
            data: {
                id: string;
                postId: string;
                versionId: string | null;
                versionLabel: string | null;
                comment: string;
                type: "rejection_reason" | "general_note";
                user: {
                    id: string;
                    avatarUrl: string | null;
                    name: string;
                };
                createdAt: string;
            };
        })[];
    }>;
    getPost(id: string): Promise<{
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
        status: "draft" | "pending_approval" | "approved" | "rejected" | "scheduled" | "published";
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
        status: "draft" | "pending_approval" | "approved" | "rejected" | "scheduled" | "published";
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
        status: "draft" | "pending_approval" | "approved" | "rejected" | "scheduled" | "published";
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
    createVersion(id: string, user: AuthenticatedUser, dto: CreatePostVersionDto): Promise<{
        id: string;
        postId: string;
        versionNumber: number;
        versionLabel: string;
        title: string;
        copyText: string;
        mediaUrls: string[];
        createdBy: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
        createdAt: string;
    }>;
    approvePost(id: string): Promise<{
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
        status: "draft" | "pending_approval" | "approved" | "rejected" | "scheduled" | "published";
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
    rejectPost(id: string, user: AuthenticatedUser, dto: RejectContentPostDto): Promise<{
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
        status: "draft" | "pending_approval" | "approved" | "rejected" | "scheduled" | "published";
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
