import {  Request  } from 'express';
import { User } from 'src/user/entities/user.entity';
 

export interface ILoginReq extends Request {
user : User
}
export interface IjwtReq extends Request {
email : string;
id : number
}





export interface ILoginDto {
    email: string;
    password: string;
  }


  
  export interface Ipayload {
    id : number;
    email :string;
    type? : string
  }