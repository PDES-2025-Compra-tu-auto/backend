import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelCarModule } from './infraestructure/modules/modelCar/model-car.module';
import { ConcessionaryAgencyModule } from './infraestructure/concessionary-agency/concessionary-agency.module';
import { FavoriteCarModule } from './infraestructure/modules/favoriteCar/favorite-car.module';
import { PurchaseModule } from './infraestructure/modules/purchase/purchase.module';
import { ReviewModule } from './infraestructure/modules/review/review.module';
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
    ConcessionaryAgencyModule,
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
