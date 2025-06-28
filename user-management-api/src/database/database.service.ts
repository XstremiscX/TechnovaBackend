// Este archivo contiene el código para conectar a la base de datos PostgreSQL usando el paquete 'pg'.

//Imports de los modulos necesarios
import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config(); // Carga las variables de entorno desde el archivo .env


// Este seravicio se encarga de manejar las consultas a la base de datos.
@Injectable()
export class DatabaseService {
    private pool: Pool; // Pool de conexiones a la base de datos

    // Este constrcutor genera un pool que permitira la conexión a la base de datos con el string definido en la variable de entorno DATABASE_URL.
    constructor(){
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL
        });
    }

    // Metodo que gestiona la consulta a la base de datos recibiendo un query SQL y parametros opcionales.
    async query(text: string, params?: any[]){
        //Nos conectamos a la base de datos.
        const client = await this.pool.connect()
        
        try{
            // Ejecuta la consulta y almacena el resultado en res.
            const res = await client.query(text, params);

            // Devuelve las filas del resultado de la consulta.
            return res.rows; 

        } finally{
            
            // Cierra la conexión al cliente.
            client.release();

        }
    }

    async justQuery(text:string){
        
        //Nos conectamos a la base de datos.
        const client = await this.pool.connect()

        try{
            // Ejecuta la consulta y almacena el resultado en res.
            const res = await client.query(text);

            // Devuelve las filas del resultado de la consulta.
            return res.rows; 

        } finally{
            
            // Cierra la conexión al cliente.
            client.release();
            
        }
        
    }
}
