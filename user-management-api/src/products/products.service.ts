import { ExecutionContext, HttpException, HttpStatus, Injectable, ParseBoolPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as genuuid } from 'uuid';

@Injectable()
export class ProductsService {

  constructor(private databaseService:DatabaseService,
    private jwtService:JwtService
  ){}

  async create(createProductDto: CreateProductDto, token: string) {
    
    try{

      const tokenInfo = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET}).then(result => {return result});

      //Separamos los valores obtenidos del Dto.
      const {
        brand_id,
        category_id,
        product_name,
        price,
        quantity,
        description,
        product_image,
        product_status
      } = createProductDto; 

      const {seller_id} = tokenInfo;

      //Creamos un uuid
      const newId = genuuid();

      //Creamos el arreglo de parametros con los datos.
      const params = [
        newId,
        brand_id,
        category_id,
        seller_id,
        product_name,
        price,
        quantity,
        description,
        product_image, //En este variable se guarda la dirección de la ruta en donde esta guardada la imagen.
        product_status
      ]

      const query = "INSERT INTO products(product_id,brand_id,category_id,seller_id,product_name,price,quantity,description,product_image,product_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *";

      //Hacemos la inserción a la base de datos y alamcenamos el registro creado en una variable.
      const res = await this.databaseService.query(query,params);

      //Si res es indefinido o no su tamaño es igual a cero, lanza un error.
      if( typeof res === undefined || res.length === 0){

        throw new HttpException("An error has occurred during the product creation.",HttpStatus.INTERNAL_SERVER_ERROR);

      }else{

        //Si todo sale bien entonces se devuelve  un objeto con el mensaje de exito y el objeto del producto.
        return (
          {
            message: "Product creation successfully.",
            product_object:res[0]
          }
        )
      }


    }catch(error){

      throw error;

    }

  }

  async listAll() {

    try{

      const query = "SELECT * FROM products";

      //Guardamos los resultados de la busqueda en la variable.
      const res = await this.databaseService.justQuery(query);

      //En caso de ser indefinido o con un tamaño igual a 0 entonces arroja un error.
      if(typeof res === undefined || res.length === 0){

        throw new HttpException("Products not founds", HttpStatus.NOT_FOUND);

      }else{

        return res;

      }

    }catch(error){

      throw error;

    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
