import { IsString, IsNotEmpty } from 'class-validator';

export class LoginAdminDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  senha: string;
}
