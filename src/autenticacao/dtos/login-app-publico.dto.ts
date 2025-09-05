import { IsString, IsNotEmpty } from 'class-validator';

export class LoginAppPublicoDto {
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  senha: string;
}
