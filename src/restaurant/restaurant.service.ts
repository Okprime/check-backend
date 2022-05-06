import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantPayload } from './types/restaurant.types';
import { UsersService } from '../user/user.service';
import { S3Service } from '../common/services/s3/s3.service';
import { TableService } from '../table/table.service';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private usersService: UsersService,
    private tableService: TableService,
    private s3Service: S3Service,
  ) {}
  async create(file: any): Promise<Restaurant> {
    const {
      managerEmail,
      noOfTables,
      buffer,
      originalname,
      name,
      address,
      city,
    } = file;

    const [imageUrl, managerDetails] = await Promise.all([
      await this.s3Service.uploadFile(buffer, originalname),
      await this.usersService.findByEmail(managerEmail),
    ]);

    const payload: RestaurantPayload = {
      noOfTables,
      name,
      address,
      city,
      manager: managerDetails,
      image: `${imageUrl}`,
    };

    const restautantDetails = await this.restaurantRepository.save(payload);

    await this.tableService.handleCreatingTablesBasedOnNumber(
      noOfTables,
      restautantDetails,
    );

    return restautantDetails;
  }

  findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.find({
      where: {
        isDeleted: false,
      },
      order: {
        id: -1,
      },
    });
  }

  async findOne(id: number): Promise<Restaurant> {
    const result = await this.restaurantRepository.findOne({
      relations: ['menu'],
      where: {
        id,
        isDeleted: false,
      },
    });

    if (result === undefined)
      throw new NotFoundException('Restaurant not found');

    return result;
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    await this.restaurantRepository.update(id, updateRestaurantDto);
    return 'Success';
  }

  async remove(id: number) {
    await this.restaurantRepository.update(id, { isDeleted: true });
    return 'Success';
  }
}
