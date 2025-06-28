import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BrandsService {

  constructor(private databaseService:DatabaseService){}

  async findAll() {

    const query = "SELECT * FROM brands";

    try{

      //Llamamos a la base de datos y almacenamos los datos devueltos.
      const res = await this.databaseService.justQuery(query);

      if(res === undefined || res.length === 0){
        throw new HttpException("Brands not found", HttpStatus.NOT_FOUND);
      }else{
        return res;
      }

    }catch(error){

      throw error;

    }

  }
}
