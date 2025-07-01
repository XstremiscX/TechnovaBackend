import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class TokenVerificationGuard implements CanActivate {

  constructor(private jwtService:JwtService){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    try{
      if(!token){
        throw new HttpException("Unauthorized", 401)
      }else{
        const tokenVerified = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET}).then(result => {return result});
        
        if(tokenVerified){
          return true;
        }
        return false;
      }

    }catch(error){
      if(error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError'){
        throw new HttpException("Unauthorized", 401);
      }else{
        throw error;
      }
    }
  }
}