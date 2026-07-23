import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { UpdateAppearanceDto } from './dto/appearance.dto';
import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getAppearance(user: AuthenticatedUser): Promise<{
        primaryColor: string;
        accentColor: string;
        backgroundColor: string;
        textColor: string;
        updatedAt: string;
    }>;
    updateAppearance(user: AuthenticatedUser, dto: UpdateAppearanceDto): Promise<{
        primaryColor: string;
        accentColor: string;
        backgroundColor: string;
        textColor: string;
        updatedAt: string;
    }>;
}
