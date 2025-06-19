//Importaciones necesarias
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSellerUserDto } from './dto/create-seller_user.dto';
import { UpdateSellerUserDto } from './dto/update-seller_user.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidv4 } from 'uuid'; // Importa la función uuidv4 para generar IDs únicos
import * as bcrypt from 'bcrypt'; // Importa bcrypt para hashear contraseñas
import { JwtService } from '@nestjs/jwt'; // Importa JwtService para manejar tokens JWT
import { LogInSellerDto } from './dto/logIn-seller.dto';
import * as nodemailer from 'nodemailer'; // Importa nodemailer para enviar correos electrónicos

//Servicio que se encargara de manejar el CRUD de los usuarios vendedores
@Injectable()
export class SellerUsersService {
  
  constructor(private databaseService: DatabaseService,
              private jwtService: JwtService
  ) {} // Inyecta el servicio de base de datos

  /*
  -------------------------------------------------------------------------------------------------------------
  ------------------------------------ Creación de usuarios vendedores ----------------------------------------
  -------------------------------------------------------------------------------------------------------------
  */

  // Este metodo se encargara de verificar si un usuario vendedor ya existe en la base de datos.
  async checkIfUserExists(email: string): Promise<boolean>{
    try{
      const queryCheckEmail = "SELECT * FROM seller_users WHERE email = $1 LIMIT 1";
      const paramsCheckEmail = [email];
      const userExists =  await this.databaseService.query(queryCheckEmail, paramsCheckEmail);
      if(userExists.length > 0){ // Lanza un error si el usuario ya existe
        return true; // Retorna true si el usuario ya existe
      }else{
        return false; // Retorna false si el usuario no existe
      }
    }catch (error) {
      throw new Error(`${error.message} - Error checking if user exists`);
    }
  }

  //Método que se encargara de enviar el email de verificación.

  async sendVerificationMail(email: string, newId: string){
    try{
      const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
          user: "safirjoseproyecto@gmail.com",
          pass: process.env.GOOGLE_APP_PASSWORD
        },
        tls:{
          rejectUnauthorized: false
        }
      })

      const info = await transporter.sendMail({
        from: '"proyecto Safir Jose"<safirjoseproyecto@gmail.com>',
        to: email,
        subject: "Verificación de cuenta",
        text: "Porfavor verifica tu correo electronico haciendo click en el botón de abajo",
        html: `<a href="http://localhost:3000/seller-users/verify/${newId}">Verificar correo</a>`
      })

      return true;

    }catch(error){
      throw error;
    }
  }

  // Método que se encargara de la creación de un nuevo usuario vendedor
  async create(createSellerUserDto: CreateSellerUserDto) {
    try{
      const { seller_name, // Si el usuario es de tipo empresa, seller_name sera null
      company_name, 
      address, 
      user_password, 
      email, 
      user_image, 
      cellphone_number, 
      registration_date, 
      user_type } = createSellerUserDto;
    
      const userExists = await this.checkIfUserExists(email).then(result => {return result}); // Verifica si el usuario ya existe
      
      if(userExists) {
        throw new Error(`User email ${email} already exists`); // Lanza un error si el usuario ya existe
      }else{
        const newId = uuidv4();
      
        const salt = bcrypt.genSaltSync(10); // Genera un salt para hashear la contraseña
        const hashedPassword = bcrypt.hashSync(user_password, salt); // Hashea la contraseña del usuario

        const params = [
          newId, 
          seller_name || null, // En caso de que el usuario sea de tipo empresa, name sera null
          company_name || null, // En caso de que el usuario sea de tipo persona, company_name sera null
          address, 
          hashedPassword, // Guarda la contraseña hasheada en lugar de la contraseña en texto plano
          email, 
          user_image || "/basic_user_image.png", // Si no se proporciona user_image, se usa una imagen por defecto
          cellphone_number, 
          false, // Por defecto, el usuario no está verificado
          registration_date || new Date(), // Si no se proporciona registration_date, se usa la fecha actual
          user_type
        ];

        const query = "INSERT INTO seller_users (seller_id, seller_name, company_name, address, user_password, email, user_image, cellphone_number, verified, registration_date, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";

        this.databaseService.query(query, params);

        const mailSended =  await this.sendVerificationMail(email,newId);

        return "User created successfully"; // Retorna un mensaje de éxito
      }

    }catch (error) {

      console.log(error);
      throw new HttpException(`Error creating seller user: ${error.message}`, HttpStatus.CONFLICT);

    }
    
    
  }

  /*
  -------------------------------------------------------------------------------------------------------------
  ---------------------------- Verificación de usuarios y cambio de contraseña --------------------------------
  -------------------------------------------------------------------------------------------------------------
  */

  // Método que se encarga de cambiar la contraseña de un usuario vendedor.
  changePassword(id:string, newPassword: JSON) {
    const query = "UPDATE seller_users SET user_password = $1 WHERE seller_id = $2";
    const new_password = newPassword['new_password']; // Extrae la nueva contraseña del objeto JSON
    const params = [new_password, id];

    try{
      this.databaseService.query(query, params);
      return "User password changed successfully"; // Retorna un mensaje de éxito
    }catch (error) {
      throw new Error(`Error changing password for seller user: ${error.message}`);
    }
  }

  // Método que se encarga de verificar un usuario vendedor.
  verifyUser(id: string) {
    const query = "UPDATE seller_users SET verified = true WHERE seller_id = $1";
    const params = [id];

    try{
      this.databaseService.query(query, params);
      return "User verified successfully"; // Retorna un mensaje de éxito
    }catch (error) {
      throw new Error(`Error verifying seller user: ${error.message}`);
    }
  }

  /*
  -------------------------------------------------------------------------------------------------------------
  ----------------------------- Busqueda y actualización de datos del usuario ---------------------------------
  -------------------------------------------------------------------------------------------------------------
  */


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
      this.databaseService.query(query, params);
      return "User updated successfully"; // Retorna un mensaje de éxito
    }catch (error) {
      throw new Error(`Error updating seller user: ${error.message}`);
    }
  }

  /*
  -------------------------------------------------------------------------------------------------------------
  ---------------------------------------- Eliminación de usuarios --------------------------------------------
  -------------------------------------------------------------------------------------------------------------
  */

  // Método que se encarga de la eliminación de un usuario vendedor.
  remove(id: string) {
    const query = "DELETE FROM seller_users WHERE seller_id = $1";
    const params = [id];
    try{
      this.databaseService.query(query,params);
      return "User removed successfully"; // Retorna un mensaje de éxito
    }catch (error) {
      throw new Error(`Error removing seller user: ${error.message}`);
    }
  }

  /*
  ------------------------------------------------------------------------------------------------------------
  ------------------------------------- Login de usuarios vendedores -----------------------------------------
  ------------------------------------------------------------------------------------------------------------
  */

  // Método que se encarga de el login del usuario vendedor.
  async login(loginData: LogInSellerDto) {
    try{
      
      const {email, password} = loginData; // Extrae el email y la contraseña del objeto JSON

      const query = "SELECT seller_id, verified, user_password FROM seller_users WHERE email = $1"
      const params = [email];

      const userData = await this.databaseService.query(query, params); // Se espera a obtener los datos del usuario con ese email y se almacena en userData

      if(userData.length === 0){
        throw new HttpException('User not found', HttpStatus.NOT_FOUND); // EN caso de que no se encuentre un usuario se laza una excepción de tipo NotFound
      }else{
        const hashedPasword = userData[0].user_password; // Obtiene la contraseña hasheada del usuario
        const isPasswordValid = bcrypt.compareSync(password, hashedPasword); // Compara la contraseña proporcionada con la contraseña hasheada
        if(userData[0].verified === false){
          throw new HttpException('User not verified', HttpStatus.UNAUTHORIZED); // Si el usuario no está verificado, se lanza una 
        }else{
          if(isPasswordValid){
          const {seller_id} = userData[0];

          return {accessToken: await this.jwtService.signAsync({seller_id})};

          }else{
            throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED); // Si la contraseña no es válida, se lanza una excepción de tipo Unauthorized
          }
        }
      }

    }catch (error) {
      throw error;
    }
  } 

}
