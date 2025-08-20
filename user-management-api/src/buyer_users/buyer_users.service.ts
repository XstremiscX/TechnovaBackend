import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBuyerUserDto } from './dto/create-buyer_user.dto';
import { DatabaseService } from 'src/database/database.service';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { LoginDataDto } from './dto/login-data.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateBuyerUserDto } from './dto/update-buyer_user.dto';
import { CreatAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class BuyerUsersService {

  constructor(private databaseService: DatabaseService,
              private jwtService: JwtService
  ) {}

  
  // Metodo que se encarga de verificar si un usuario ya existe en la base de datos.
  async verifyUserExists(email:string){

    try{

      const param = [email];

      const query = `SELECT * FROM buyer_users WHERE email = $1`;

      const result = await this.databaseService.query(query, param);

      if(result.length === 0){

        return false;

      }else{

        return true;

      }

    }catch(error){

      console.error(`Error verifying user existence: ${error.message}`);

    }
  
  }


  // Metodo que se encarga de enviar un correo de verificación al usuario.
  async sendVerificationMail(email: string, newId: string){
    try{
      const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
          user: process.env.GOOGLE_APP_EMAIL,
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
        html: `<a href="http://localhost:3000/buyer-users/verify/${newId}">Verificar correo</a>`
      })

      return true;

    }catch(error){
      throw new Error(error.message);
    }
  }
  
  // Metodo que se encarga de crear un nuevo usuario en la base de datos.
  async create(createBuyerUserDto: CreateBuyerUserDto) {
    
    try{

      // Desestructuración del DTO para obtener los campos necesarios.
      const {
        user_name,
        user_lastname,
        user_password,
        email,
        user_image,
        cellphone_number
      } = createBuyerUserDto;

      // Verificar si el usuario ya existe.
      const userExists = await this.verifyUserExists(email);

      // Si el usuario no existe, proceder a crear uno nuevo.
      if(!userExists){

        // Generar un nuevo ID para el usuario.
        const newId = uuidv4();
        
        // Obtener la fecha actual para el registro.
        const registration_date = new Date();

        // Hashear la contraseña del usuario.
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(user_password, salt);

        // Crear un array de parámetros para la consulta SQL.
        const Params = [
          newId,
          user_name,
          user_lastname,
          hashedPassword,
          email,
          user_image || "basic_user_image.png",
          cellphone_number,
          false,
          registration_date
        ]

        // Consulta SQL para insertar el nuevo usuario en la base de datos.
        const query = "INSERT INTO buyer_users (buyer_id,user_name,user_lastname,user_password,email,user_image,cellphone_number,verified,registration_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)"

        // Ejecutar la consulta SQL.
        await this.databaseService.query(query, Params);

        // Enviar un correo de verificación al usuario.
        await this.sendVerificationMail(email, newId);

        // Retornar un mensaje de éxito.
        return "User created successfully.";

      }else{

        throw new Error(`User with email ${email} already exists.`);

      }

    }catch(error){

      throw new HttpException(`Error creating user: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);

    }

  }

  // Metodo que se encarga de verificar un usuario por su ID.
  verifyUser(id: string){
    try{

      const param = [id];

      const query = `UPDATE buyer_users SET verified = true WHERE buyer_id = $1`;

      this.databaseService.query(query, param);

      return "User verified successfully.";

    }catch(error){

      throw new HttpException(`Error verifying user: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  // Metodo que se encarga de iniciar sesión con un usuario.
  async login(loginData:LoginDataDto){

    try{

      // Desestructuración del DTO para obtener los campos necesarios.
      const { email, password } = loginData;

      const param = [email];

      const query = "SELECT buyer_id, user_password, verified FROM buyer_users WHERE email = $1";

      // Ejecutar la consulta SQL para obtener el usuario por su email.
      const result = await this.databaseService.query(query, param);

      if(result.length > 0){

        if(result[0].verified === false){

          // Si el usuario no está verificado, lanzar una excepción.
          throw new HttpException("User not verified", HttpStatus.UNAUTHORIZED);

        }else{

          const user_password = result[0].user_password;
          
          // Comparar la contraseña proporcionada con la almacenada en la base de datos.
          const passwordMatch = bcrypt.compareSync(password, user_password);

          if(passwordMatch){
            
            const buyer_id = result[0].buyer_id;

            // Si la contraseña es correcta, generar un token JWT con el id del usuario.
            return {accessToken: await this.jwtService.signAsync({buyer_id})};
            

          }else{

            // Si la contraseña no coincide, lanzar una excepción.
            throw new HttpException("User can't login", HttpStatus.UNAUTHORIZED);

          }

        }


      }else{

        // Si no se encuentra el usuario, lanzar una excepción.
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);

      }

    }catch(error){

      if(error.name === 'HttpException'){

        throw error;

      }else{

        throw new HttpException(`Login error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);

      }

    }

  }

  // Metodo que se encarga de actualizar un usuario.
  async updateUser(token: string, updateBuyerUserDto: UpdateBuyerUserDto) {

    try{

      // Verificar si el token es valido.
      const tokenVerified = await this.jwtService.verifyAsync(token);

      if(tokenVerified){

        // Desestructuración del token verificado para obtener el id del usuario.
        const { buyer_id } = tokenVerified;

        // Desestructuración del DTO para obtener los campos necesarios.
        const { 
          user_name, 
          user_lastname, 
          email,
          cellphone_number,
          user_image,
        } = updateBuyerUserDto;

        // Crear un array de parámetros para la consulta SQL.
        const Params = [
          user_name,
          user_lastname,
          email,
          cellphone_number,
          user_image || 'basic_user_image.png',
          buyer_id
        ];

        // Consulta SQL para actualizar el usuario en la base de datos.
        const query = "UPDATE buyer_users SET user_name = $1, user_lastname = $2, email = $3, cellphone_number = $4, user_image = $5 WHERE buyer_id = $6 RETURNING user_name, user_lastname, email, cellphone_number, user_image";

        // Ejecutar la consulta SQL.
        const result = await this.databaseService.query(query, Params);

        if(result.length === 0){

          // Si no se encuentra el usuario, lanzar una excepción.
          throw new HttpException("Error updating user", HttpStatus.INTERNAL_SERVER_ERROR);

        }else{

          // Retornar el resultado de la actualización.
          return result;

        }
      

      }else{

        // Si el token no es válido, lanzar una excepción.
        throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);

      }

    }catch(error){

      if(error.name === 'HttpException'){

        throw error;

      }else{

        throw new HttpException(`Error updating user: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);

      }

    }

  }

  // Metodo que se encarga de obtener los datos del usuario.
  async getUserData(token: string) {

    try{

      // Verificar si el token es valido.
      const tokenVerified = await this.jwtService.verifyAsync(token);

      if(tokenVerified){

        // Desestructuración del token verificado para obtener el id del usuario.
        const { buyer_id } = tokenVerified;

        // Crear un array de parámetros para la consulta SQL.
        const param = [buyer_id];

        // Consulta SQL para obtener los datos del usuario por su id.
        const query = "SELECT user_name, user_lastname, email, cellphone_number, user_image FROM buyer_users WHERE buyer_id = $1";

        // Ejecutar la consulta SQL.
        const result = await this.databaseService.query(query, param);

        if(result.length === 0){

          // Si no se encuentra el usuario, lanzar una excepción.
          throw new HttpException("User not found", HttpStatus.NOT_FOUND);

        }else{

          // Retornar los datos del usuario.
          return result;

        }
      }else{
        // Si el token no es válido, lanzar una excepción.
        throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
      }

    }catch(error){

      if(error.name === 'HttpException'){

        throw error;

      }else{

        throw new HttpException(`Error getting user data: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);

      }

    }

  }

  // Metodo que se encarga de cambiar la contraseña de un usuario.
  async changePassword(token: string, newPassword: JSON){

    try{


      // Verificar que el token sea valido.
      const tokenVerified = await this.jwtService.verify(token);


      if(tokenVerified){

        // Extraer el buyer_id del token.
        const { buyer_id } = tokenVerified;

        // Extraer la nueva contraseña del JSON.
        const new_password = newPassword['new_password'];

        // Hashear la nueva contraseña
        const salt = bcrypt.genSaltSync(10);
        const new_hashed_password = bcrypt.hashSync(new_password,salt);
        
        // Establecer los parametros.
        const params = [
          new_hashed_password,
          buyer_id
        ]

        // Declaramos el query que actualizara la contraseña.
        const query = "UPDATE buyer_users SET user_password = $1 WHERE buyer_id = $2";
        
        //Ejecutamos la llamada a la base de datos.
        await this.databaseService.query(query,params);

        // Retornamos un mensaje de exito.
        return "Password change successfully.";

      }else{

        // Arrojar una excepción si el token no es valido.
        throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);

      }

    }catch(error){

      if(error.name === 'HttpException'){

        throw error;

      }else{

        throw new HttpException(`Error changing password: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);

      }

    }

  }

  async deleteAccount(token: string){

    try{

      // Verificar que el token sea valido.
      const tokenVerified = await this.jwtService.verifyAsync(token);

      if(tokenVerified){

        // Obtenemos el buyer_id.
        const {buyer_id} = tokenVerified;

        // Declaramos el parametro para la consulta.
        const param = [buyer_id];

        // Creamos la consulta que se usara para eliminar al usuario.
        const query = "DELETE FROM buyer_users WHERE buyer_id = $1";

        // Hacemos la llamada a la base de datos.
        await this.databaseService.query(query,param);

        // Retornamos un mensaje de exito.
        return "User deleted successfully.";

      }else{

        // Arrojamos un HttpException en caso de que el token no sea valido.
        throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);

      }

    }catch(error){

      if(error.name === "HttpException"){
        throw error;
      }else{
        throw new HttpException(`Error deleting user: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

    }

  }


  // Metodo que se encarga de agreagar una nueva dirección al usuario.
  async createAddress(token: string, createAddressDto: CreatAddressDto){

    try{

      //Verificar que el token es valido.
      const tokenVerified = await this.jwtService.verifyAsync(token);

      if(tokenVerified){

        // Extraer el buyer_id del token.
        const {buyer_id} = tokenVerified;

        // Creamos el id para la dirección.
        const address_id = uuidv4();

        // Desestructuramos el dto.
        const {address} = createAddressDto;

        // Creamos el arreglo con los parametros.
        const params = [
          address_id,
          buyer_id,
          address
        ]

        //Creamos la consulta.
        const query = "INSERT INTO buyer_address (address_id,buyer_id,address) VALUES($1,$2,$3) RETURNING address_id, address"

        //Hacemos la llamada a la base de datos.
        const result = await this.databaseService.query(query,params);

        if(result.length === 0){

          throw new HttpException("Database execution error", HttpStatus.INTERNAL_SERVER_ERROR);

        }else{

          return result;

        }


      }else{

        throw new HttpException("Invalid token.", HttpStatus.UNAUTHORIZED);

      }

    }catch(error){

      if(error.name === "HttpException"){

        throw error;

      }else{

        throw new HttpException(`Creating addres error ${error.name}`, HttpStatus.INTERNAL_SERVER_ERROR);

      }

    }

  }

  //Metodo que se encarga de obtener la información de las direcciónes relacionadas con el usuario.
  async findAddress(token: string){

    try{

      const tokenVerified = await this.jwtService.verifyAsync(token);

      if(tokenVerified){

        const param = [tokenVerified.buyer_id];

        const query = "SELECT address_id, address FROM buyer_address WHERE buyer_id = $1";

        const result = await this.databaseService.query(query,param);

        if(result.length === 0){

          return "No hay direcciones agregadas."

        }else{

          return result;

        }

      }else{

        throw new HttpException("Invalid token",HttpStatus.UNAUTHORIZED);

      }

    }catch(error){

      if(error.name === "HttpException"){

        throw error;

      }else{

        throw new  HttpException(`Searching address error: ${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR );

      }

    }

  }

  // Metodo encargado de actualizar los datos de la dirección.
  async updateAddress(updateAddressDto: UpdateAddressDto){

    try{

      const {
        address_id, 
        address
      } = updateAddressDto;

      const params = [
        address,
        address_id
      ];

      const query = "UPDATE buyer_address SET address = $1 WHERE address_id = $2 RETURNING address_id, address";

      const result = await this.databaseService.query(query,params);

      if(result.length === 0){

        throw new HttpException("Error updating address.", HttpStatus.INTERNAL_SERVER_ERROR);

      }else{

        return result;

      }

    }catch(error){

      if(error.name === "HttpException"){

        throw error;

      }else{

        throw new  HttpException(`Error updating proccess: ${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR );

      }

    }

  }

  //Metodo encargado de eliminar una dirección.
  async deleteAddress(address_id: string){

    try{

      const param = [address_id];

      const query = "DELETE FROM buyer_address WHERE address_id = $1";

      await this.databaseService.query(query,param);

      return "Address deleted successfully";

    }catch(error){

      throw new  HttpException(`Error deleting proccess: ${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR );

    }

  }

  //Metodo encargado de agregar una nueva tarjeta del usuario.
  async addCard(token: string, createCardDto: CreateCardDto){

    try{
      const tokenVerified = await this.jwtService.verifyAsync(token);

      if(tokenVerified){

        const {buyer_id} = tokenVerified

        const {
          card_number,
          expiration_date,
          card_holder
        } = createCardDto

        const newId = uuidv4();

        const params = [
          newId,
          buyer_id,
          card_number,
          expiration_date,
          card_holder
        ]

        const query = "INSERT INTO buyer_cards(card_id,buyer_id,card_number,expiration_date,card_holder) VALUES($1,$2,$3,$4,$5) RETURNING *"

        const result = await this.databaseService.query(query,params);

        if(result.length === 0){
          
          throw new HttpException("Error creating card.",HttpStatus.INTERNAL_SERVER_ERROR);

        }else{

          return result;

        }

      }else{

        throw new HttpException("Invalid token.",HttpStatus.UNAUTHORIZED);

      }

    }catch(error){

      if(error.name === "HttpException"){

        throw error;

      }else{

        throw new HttpException(`Creating card process error: ${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR);

      }

    }

  }

  //Metodo encargado de encontrar toda la información de las tarjetas asociadas a el usuario.
  async findCards(token: string){

     try{

      const tokenVerified = await this.jwtService.verifyAsync(token);

      if(tokenVerified){

        const param = [tokenVerified.buyer_id];

        const query = "SELECT card_id, card_number, expiration_date, card_holder FROM buyer_cards WHERE buyer_id = $1";

        const result = await this.databaseService.query(query,param);

        if(result.length === 0){

          return "No hay tarjetas agregadas."

        }else{

          return result;

        }

      }else{

        throw new HttpException("Invalid token",HttpStatus.UNAUTHORIZED);

      }

    }catch(error){

      if(error.name === "HttpException"){

        throw error;

      }else{

        throw new  HttpException(`Searching cards error: ${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR );

      }

    }

  }

  // Metodo que se encarga de actualizar los datos de la tarjeta.
  async updateCard(updateCardDto: UpdateCardDto){

    try{

      const {
        card_id,
        card_holder,
        card_number,
        expiration_date,
      } = updateCardDto;

      const params = [
        card_holder,
        card_number,
        expiration_date,
        card_id
      ];

      const query = "UPDATE buyer_cards SET card_holder = $1, card_number = $2, expiration_date = $3 WHERE card_id = $4 RETURNING card_holder,card_number,expiration_date";

      const result = await this.databaseService.query(query,params);

      if(result.length === 0){

        throw new HttpException("Error updating card.", HttpStatus.INTERNAL_SERVER_ERROR);

      }else{

        return result;

      }

    }catch(error){

      if(error.name === "HttpException"){

        throw error;

      }else{

        throw new  HttpException(`Error updating proccess: ${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR );

      }

    }

  }

  //Metodo encargado de eliminar una dirección.
  async deleteCard(card_id: string){ 

    try{

      const param = [card_id];

      const query = "DELETE FROM buyer_cards WHERE card_id = $1";

      await this.databaseService.query(query,param);

      return "Address deleted successfully";

    }catch(error){

      throw new  HttpException(`Error deleting proccess: ${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR );

    }

  }

}
