import { ContentPlatform, ContentPostFormat, ContentPostStatus } from '@prisma/client';
export declare class AttachmentDto {
    name: string;
    url: string;
    mimeType?: string;
}
export declare class CreateContentPostDto {
    title: string;
    clientId: string;
    platform: ContentPlatform;
    format?: ContentPostFormat;
    scheduledDate?: string;
    status?: ContentPostStatus;
    copy: string;
    assigneeId?: string;
    attachments?: AttachmentDto[];
}
export declare class UpdateContentPostDto {
    title?: string;
    clientId?: string;
    platform?: ContentPlatform;
    format?: ContentPostFormat;
    scheduledDate?: string | null;
    status?: ContentPostStatus;
    copy?: string;
    assigneeId?: string | null;
    attachments?: AttachmentDto[];
}
export declare class QueryContentPostsDto {
    clientId?: string;
    platform?: ContentPlatform;
    status?: ContentPostStatus;
    from?: string;
    to?: string;
}
