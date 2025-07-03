import { HttpException, HttpStatus, Injectable, ParseBoolPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as genuuid } from 'uuid';
import { UpdateProductDto } from './dto/update-product.dto';

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

        throw new HttpException("Products not found", HttpStatus.NOT_FOUND);

      }else{

        return res;

      }

    }catch(error){

      throw error;

    }
  }

  async listSellerProducts(token: string){

    try{

      //Verificamos el token y extraemos la información.
      const tokenInfo = await this.jwtService.verifyAsync(token,{secret: process.env.JWT_SECRET});

      //Obtenemos el id del vendedor.
      const {seller_id} = tokenInfo;

      const query = "SELECT * FROM products WHERE seller_id = $1"; 

      //Ejecutamos la llamada a la base de datos y almacenamos los datos devueltos.
      const res = await this.databaseService.query(query,[seller_id]);

      //Verificamos que si haya información, en caso de no haber entonces se arrojara un error.
      if(res === undefined){

        throw new HttpException("An error has occurred during the data extraction.",HttpStatus.INTERNAL_SERVER_ERROR);

      }else if(res.length === 0){

        return "No products avaibles.";

      }else{

        //Retornamos un objeto con los datos obtenidos.
        return res

      }

    }catch(error){

      throw error;

    }

  }

  async updateProduct(updateProductDto:UpdateProductDto){

    try{

      const {
        product_id,
        category_id,
        brand_id,
        product_name,
        price,
        quantity,
        description,
        product_image,
        product_status
      } = updateProductDto

      const params = [
        brand_id,
        category_id,
        product_name,
        price,
        quantity,
        description,
        product_image,
        product_status,
        product_id
      ]

      const query = "UPDATE products SET brand_id = $1, category_id = $2, product_name = $3, price = $4, quantity = $5, description = $6, product_image = $7, product_status = $8 WHERE product_id = $9 RETURNING *"

      //Acualizamos el producto y recibimos un objeto con todos los datos actualizados.
      const res = await this.databaseService.query(query,params);

      if(res == undefined){

        throw new HttpException("An error has occurred during the product update",HttpStatus.INTERNAL_SERVER_ERROR);

      }else{

        return res;

      }

    }catch(error){

      throw error;

    }

  }


}
