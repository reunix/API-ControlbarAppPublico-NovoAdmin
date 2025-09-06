import * as bcrypt from 'bcrypt';
// Função para hash de senha
export async function hashPassword(
  password: string,
  saltRounds: number = 10
): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Erro ao gerar hash da senha:', error);
    throw new Error('Falha ao criptografar a senha');
  }
}

// // Exemplo de uso em um contexto (ajuste conforme sua aplicação)
// export async function processUserPassword(paramsRequest: {
//   usersweb_senha: string;
// }) {
//   const { usersweb_senha } = paramsRequest;
//   const hashedPassword = await hashPassword(usersweb_senha);
//   return hashedPassword;
// }
