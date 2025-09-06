import { IsString, IsNotEmpty } from 'class-validator';

export class SendEmailChangePasswordAppPublicoDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;
}
