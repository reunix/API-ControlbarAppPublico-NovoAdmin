import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { Match } from './match.decorator';

export class UsuarioCrudDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres.' })
  nome: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @MaxLength(50, { message: 'Senha deve ter no máximo 50 caracteres.' })
  senha: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória.' })
  @Match('senha', { message: 'As senhas não coincidem.' })
  senha_confirmacao: string;

  @IsString()
  @IsNotEmpty({ message: 'Estado é obrigatório.' })
  @MaxLength(2, { message: 'Estado deve ter exatamente 2 caracteres.' })
  @Matches(/^[A-Z]{2}$/, {
    message: 'Estado deve ser uma sigla válida (ex.: SP).',
  })
  estado: string;

  @IsString()
  @IsNotEmpty({ message: 'CPF é obrigatório.' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos.' })
  cpf: string;

  @IsString()
  @IsNotEmpty({ message: 'CEP é obrigatório.' })
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos.' })
  cep: string;

  @IsString()
  @IsNotEmpty({ message: 'Endereço é obrigatório.' })
  @MaxLength(200, { message: 'Endereço deve ter no máximo 200 caracteres.' })
  endereco: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Complemento deve ter no máximo 100 caracteres.' })
  complemento?: string;

  @IsString()
  @IsNotEmpty({ message: 'Cidade é obrigatória.' })
  @MaxLength(100, { message: 'Cidade deve ter no máximo 100 caracteres.' })
  cidade: string;

  @IsString()
  @IsNotEmpty({ message: 'Bairro é obrigatório.' })
  @MaxLength(100, { message: 'Bairro deve ter no máximo 100 caracteres.' })
  bairro: string;

  @IsString()
  @IsNotEmpty({ message: 'Número é obrigatório.' })
  @MaxLength(10, { message: 'Número deve ter no máximo 10 caracteres.' })
  numero: string;

  @IsString()
  @IsNotEmpty({ message: 'DDD é obrigatório.' })
  @Matches(/^\d{2}$/, { message: 'DDD deve conter 2 dígitos.' })
  ddd: string;

  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório.' })
  @Matches(/^\d{8,9}$/, { message: 'Telefone deve conter 8 ou 9 dígitos.' })
  telefone: string;
}
