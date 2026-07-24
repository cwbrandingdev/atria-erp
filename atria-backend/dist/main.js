"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = require("path");
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), { prefix: '/uploads/' });
    app.use((0, cookie_parser_1.default)());
    const isProduction = process.env.NODE_ENV === 'production';
    const defaultOrigins = isProduction
        ? 'https://atria-erp.vercel.app'
        : 'http://localhost:3000,http://127.0.0.1:3000';
    const corsOrigin = configService.get('CORS_ORIGIN', defaultOrigins);
    const allowedOrigins = new Set(corsOrigin
        .split(',')
        .map((origin) => origin
        .trim()
        .replace(/^["']|["']$/g, '')
        .replace(/\/$/, ''))
        .filter(Boolean));
    if (!isProduction) {
        allowedOrigins.add('http://localhost:3000');
        allowedOrigins.add('http://127.0.0.1:3000');
    }
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.has(origin)) {
                callback(null, origin ?? true);
                return;
            }
            console.warn(`[CORS] Blocked origin: ${origin}`);
            callback(null, false);
        },
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
            'Origin',
        ],
        credentials: true,
        optionsSuccessStatus: 204,
    });
    if (!isProduction) {
        console.log(`[CORS] Allowed origins: ${[...allowedOrigins].join(', ')}`);
    }
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    const port = configService.get('PORT', 3001);
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map