import { IsString, IsNotEmpty } from 'class-validator';

export class SendEmailNewUserAppPublicoDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nome: string;
}
