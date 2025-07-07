import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateSalesDetailDto } from './dto/create-sales_detail.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SalesService {

  constructor(private databaseService: DatabaseService) {}
  
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

}
