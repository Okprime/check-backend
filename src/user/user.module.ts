import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin])],
  controllers: [UsersController],
  providers: [UsersService, AdminService],
  exports: [UsersService, AdminService],
})
export class UsersModule {}
