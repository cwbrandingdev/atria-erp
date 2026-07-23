import { RoleName } from '@prisma/client';
export declare class CreateUserGroupDto {
    name: string;
    description?: string;
    color?: string;
}
export declare class UpdateUserGroupDto {
    name?: string;
    description?: string;
    color?: string;
}
export declare class ProvisionUserDto {
    name: string;
    role: RoleName;
    userGroupId?: string;
    hourlyRate?: number;
    emailDomain?: string;
}
