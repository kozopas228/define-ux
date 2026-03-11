import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@codegenie/serverless-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { json, urlencoded } from 'express';

let server: Handler;

async function bootstrap(): Promise<Handler> {
    const isProduction = process.env.NODE_ENV === 'production';

    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    app.enableCors({
        origin: [configService.get('FRONTEND_URL') ?? ''],
        credentials: true,
    });
    app.use(cookieParser(configService.get('REFRESH_COOKIE_SECRET')));
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
                    styleSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
                    imgSrc: ["'self'", 'data:', 'https://cdnjs.cloudflare.com'],
                    fontSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
                },
            },
        }),
    );
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));

    addSwagger(app, isProduction);

    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};

function addSwagger(app: INestApplication<any>, isProduction: boolean) {
    const config = new DocumentBuilder()
        .setTitle('Define UX')
        .setDescription('Api for Define UX')
        .setVersion('0.0.1')
        .addBearerAuth()
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);

    // for the unknown reason Swagger doesn't load static files while being deployed in AWS,
    // so this is a workaround on how to load them in production
    if (isProduction) {
        const swaggerCDN =
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2';
        SwaggerModule.setup('docs', app, documentFactory, {
            customCssUrl: [`${swaggerCDN}/swagger-ui.css`],
            customJs: [
                `${swaggerCDN}/swagger-ui-bundle.js`,
                `${swaggerCDN}/swagger-ui-standalone-preset.js`,
            ],
        });
    } else {
        SwaggerModule.setup('docs', app, documentFactory);
    }
}
