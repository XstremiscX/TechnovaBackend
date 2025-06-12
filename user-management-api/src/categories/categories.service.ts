// Imports de los modulos necesarios.
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from '../database/database.service';
import { v4 as uuidv4 } from 'uuid'; // Importa la función uuidv4 para generar IDs únicos

// Este servicio se encarga de manjear las categorias de la base de datos
@Injectable()
export class CategoriesService {

  constructor(private databaseService: DatabaseService) {}

  create(createCategoryDto: CreateCategoryDto) {
    const {category_name, category_description } = createCategoryDto;
    const query = "INSERT INTO categories (category_id, category_name, category_description) VALUES ($1, $2, $3)";
    const params = [uuidv4(), category_name, category_description];

    try{
      const res = this.databaseService.query(query, params);
      return res;
    }catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  }

  findAll() {
    const query = "SELECT * FROM categories";

    try{
      const res = this.databaseService.query(query);
      return res;
    }catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
