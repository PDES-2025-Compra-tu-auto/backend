import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleCarModule } from './infraestructure/modules/saleCar/sale-car.module';
import { ModelCarModule } from './infraestructure/modules/modelCar/model-car.module';
import { ConcessionaryAgencyModule } from './infraestructure/modules/concessionaryAgency/concessionary-agency.module';
import { FavoriteCarModule } from './infraestructure/modules/favoriteCar/favorite-car.module';
import { AdminModule } from './infraestructure/modules/admin/admin.module';
import { BuyerModule } from './infraestructure/modules/buyer/buyer.module';
import { PurchaseModule } from './infraestructure/modules/purchase/purchase.module';
import { ReviewModule } from './infraestructure/modules/review/review.module';
import { DealerModule } from './infraestructure/modules/dealer/concessionary.module';
import { AuthModule } from './infraestructure/modules/auth/auth.module';

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
    DealerModule,
    PurchaseModule,
    AdminModule,
    BuyerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
