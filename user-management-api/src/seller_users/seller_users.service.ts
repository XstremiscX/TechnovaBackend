//Importaciones necesarias
import { Injectable } from '@nestjs/common';
import { CreateSellerUserDto } from './dto/create-seller_user.dto';
import { UpdateSellerUserDto } from './dto/update-seller_user.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidv4 } from 'uuid'; // Importa la función uuidv4 para generar IDs únicos

//Servicio que se encargara de manejar el CRUD de los usuarios vendedores
@Injectable()
export class SellerUsersService {
  
  constructor(private databaseService: DatabaseService) {} // Inyecta el servicio de base de datos
  
  // Método que se encargara de la creación de un nuevo usuario vendedor
  create(createSellerUserDto: CreateSellerUserDto) {
    const { seller_name, 
      company_name, 
      address, 
      user_password, 
      email, 
      user_image, 
      cellphone_number, 
      registration_date, 
      user_type } = createSellerUserDto;
    
    const newId = uuidv4();
    
    const params = [
      newId, 
      seller_name || null, // En caso de que el usuario sea de tipo empresa, name sera null
      company_name || null, // En caso de que el usuario sea de tipo persona, company_name sera null
      address, 
      user_password, 
      email, 
      user_image || "/basic_user_image.png", // Si no se proporciona user_image, se usa una imagen por defecto
      cellphone_number, 
      false, // Por defecto, el usuario no está verificado
      registration_date || new Date(), // Si no se proporciona registration_date, se usa la fecha actual
      user_type
    ];

    const query = "INSERT INTO seller_users (seller_id, seller_name, company_name, address, user_password, email, user_image, cellphone_number, verified, registration_date, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";

    try{
      const res = this.databaseService.query(query, params);
      return res;
    }catch (error) {
      throw new Error(`Error creating seller user: ${error.message}`);
    }
  }

  // Método que se encarga de buscar la información publica de un usuario vendedor por su ID.
  // Este método no devuelve la contraseña del usuario, ya que esta no debe ser expuesta.
  // Tampoco devuelve el estado de verificación ya que este estado no debe ser posible de modificar por el propio usuario.
  findInfo(id: string){
    const query = "SELECT seller_name, company_name, address, email, user_image, cellphone_number, user_type FROM seller_users WHERE seller_id = $1";
    const params = [id];

    try{
      const res = this.databaseService.query(query, params);
      if(!res){
        throw new Error(`Seller user with id ${id} not found`);
      }else{
        return res; // Retorna el primer resultado de la consulta
      }
    }catch (error) {
      throw new Error(`Error finding seller user: ${error.message}`);
    }
  }

  // Método que se encarga de actualizar los datos publicos de un usuario vendedor.
  // Este método no actualiza la contraseña del usuario, ya que esta debe ser actualizada por el usuario a través de un endpoint diferente.
  // Este metodo no actualiza el estado de verificación del usuario, ya que la verificación debe realizarse a través de un correo electrónico enviado al usuario.
  update(id: string, updateSellerUserDto: UpdateSellerUserDto) {
    const { seller_name, company_name, address, email, user_image, cellphone_number, user_type } = updateSellerUserDto;

    const params = [
      seller_name || null, 
      company_name || null, 
      address,
      email, 
      user_image || "/basic_user_image.png", 
      cellphone_number,
      user_type,
      id
    ];

    const query = "UPDATE seller_users SET seller_name = $1, company_name = $2, address = $3, email = $4, user_image = $5, cellphone_number = $6, user_type = $7 WHERE seller_id = $8";

    try{
      const res = this.databaseService.query(query, params);
      return res;
    }catch (error) {
      throw new Error(`Error updating seller user: ${error.message}`);
    }
  }

  // Método que se encarga de la eliminación de un usuario vendedor.
  remove(id: string) {
    const query = "DELETE FROM seller_users WHERE seller_id = $1";
    const params = [id];
    try{
      const res  = this.databaseService.query(query,params);
      return res;
    }catch (error) {
      throw new Error(`Error removing seller user: ${error.message}`);
    }
  }
}
