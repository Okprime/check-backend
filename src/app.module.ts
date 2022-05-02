import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
// import { ImageUploadModule } from './file-upload/file-upload.module';
import { CommonModule } from './common/common.module';
import { AccountModule } from './account/account.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
      synchronize: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    UsersModule,
    AuthModule,
    CommonModule,
    AccountModule,
    RestaurantModule,
    MenuModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
