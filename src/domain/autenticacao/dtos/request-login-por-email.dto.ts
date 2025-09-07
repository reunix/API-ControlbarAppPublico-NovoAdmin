import { IsString, IsNotEmpty } from 'class-validator';

export class RequestLoginAppPublicoPorEmailDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
