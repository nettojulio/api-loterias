import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ResultadosClient } from './resultados/resultados.client';
import { ResultadosController } from './resultados/resultados.controller';
import { ResultadosModule } from './resultados/resultados.module';
import { ResultadosService } from './resultados/resultados.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot:
        process.env.SWAGGER_DOC_ENV === 'development' ? '/' : '/swagger',
    }),
    ResultadosModule,
    CacheModule.register({
      ttl: 15000, // 900000,
      max: 220,
      isGlobal: true,
    }),
  ],
  controllers: [ResultadosController],
  providers: [ResultadosService, ResultadosClient],
})
export class AppModule {}
