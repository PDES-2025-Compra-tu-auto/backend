import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelCarModule } from './infraestructure/model-car/model-car.module';
import { FavoriteCarModule } from './infraestructure/favourite-car/favorite-car.module';
import { PurchaseModule } from './infraestructure/purchase/purchase.module';
import { ReviewModule } from './infraestructure/review/review.module';
import { AuthModule } from './infraestructure/auth/auth.module';
import { SaleCarModule } from './infraestructure/sale-car/sale-car.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // para prod usar migraciones.
      }),
    }),
    SaleCarModule,
    ModelCarModule,
    FavoriteCarModule,
    PurchaseModule,
    ReviewModule,
    PurchaseModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
