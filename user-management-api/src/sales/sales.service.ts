import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateSalesDetailDto } from './dto/create-sales_detail.dto';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SalesService {

  constructor(private databaseService: DatabaseService,
              private jwtService: JwtService
  ) {}
  
  createSale(createSaleDto: CreateSaleDto) {
    
    try{
      
      const { 
        buyer_id, 
        amount
      } = createSaleDto;
      
      const newId = uuidv4();
      const saleDate = new Date();

      const params = [
        newId,
        buyer_id,
        amount,
        saleDate
      ]
        
      const query = "INSERT INTO sales (sale_id, buyer_id, amount, sale_date) VALUES ($1, $2, $3, $4)";

      this.databaseService.query(query, params);

      return newId;

    }catch(error){

      throw new Error(`Error creating sale: ${error.message}`);

    }

  }

  createSaleDetail(arrayCreateSaleDetailDto: CreateSalesDetailDto[], sale_id: string) {

    try{

      for(const createSaleDetailDto of arrayCreateSaleDetailDto){

        const {
          product_id,
          unite_price,
          quantity
        } = createSaleDetailDto;

        const newId = uuidv4();

        const params = [
          newId,
          sale_id,
          product_id,
          unite_price,
          quantity
        ]
        
        const query = "INSERT INTO sale_details (detail_id, sale_id, product_id, unite_price, quantity) VALUES ($1, $2, $3, $4, $5)";

        this.databaseService.query(query, params);

      }

      return "Sale created successfully";

    }catch(error){

      throw new Error(`Error creating sale detail: ${error.message}`);
      
    }

  }

  async findAllSales(token:string){

    try{

      // Verificamos que el token sea valido y extraemos la información del usuario.
      const tokenInfo = await this.jwtService.verifyAsync(token,{secret: process.env.JWT_SECRET});

      //Extraemos el id del usuario del token.
      const userId = tokenInfo.user_id;

      const query = "SELECT * FROM sales where buyer_id = $1";
      
      const params = [userId];

      const result = await this.databaseService.query(query, params);

      return result;

    }catch(error){

      throw new Error(`Error fetching sales: ${error.message}`);

    }

  }

  async findSaleDetails(sale_id:string){

    try{

      //Esta consulta obtiene toda la información necesatia para mostrar la venta y sus detalles en una factura.
      const query = "SELECT s.sale_id, s.amount,s.sale_date, sd.detail_id, sd.unite_price, sd.quantity, p.product_name, p.price,p.seller_id, su.seller_name,su.company_name FROM sale_details as sd INNER JOIN products as p ON sd.product_id = p.product_id INNER JOIN sales as s ON sd.sale_id = s.sale_id INNER JOIN seller_users as su ON p.seller_id = su.seller_id WHERE s.sale_id = $1";

      const params = [sale_id];

      const result = await this.databaseService.query(query, params);

      return result;

    }catch(error){

      throw new Error(`Error fetching sale details: ${error.message}`);

    }

  }

}
