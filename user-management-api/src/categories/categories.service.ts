import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CategoriesService {

  constructor( private databaseService:DatabaseService ){};

  //Metodo que obtiene toda la información de las categorías de la base de datos.
  async findAll() {
    
    const query = "SELECT * FROM categories"

    try{

      //Llamamos a la abse de datos y guardamos los datos en una variable.
      const res = await this.databaseService.justQuery(query);

      if(res === undefined || res.length === 0){
        throw new HttpException("Categories not found", HttpStatus.NOT_FOUND);
      }else{
        return res
      }

    }catch(error){

      throw error;

    };

  }

}
