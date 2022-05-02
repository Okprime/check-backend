import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.save(createCategoryDto);
  }

  findAll() {
    return this.categoryRepository.find({
      where: {
        isDeleted: false,
      },
      order: {
        id: -1,
      },
    });
  }

  findOne(id: number) {
    return this.categoryRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.update(id, updateCategoryDto);
    return 'Success';
  }

  async remove(id: number) {
    await this.categoryRepository.update(id, { isDeleted: true });
    return 'Success';
  }
}
