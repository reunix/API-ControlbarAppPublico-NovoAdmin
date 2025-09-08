import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatService } from '../services/chat.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsuarioAppPublico } from '@/domain/autenticacao/modelos/usuarios-app-publico.modelo';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // caminho físico
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExt = extname(file.originalname);
          cb(null, `${name}-${Date.now()}${fileExt}`);
        },
      }),
    })
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    // aqui retornamos a URL pública configurada no ServeStaticModule
    return { url: `/chat/uploads/${file.filename}` };
  }

  @Post('participants')
  async getParticipants(
    @Body('eventId') eventId: number
  ): Promise<UsuarioAppPublico[]> {
    return this.chatService.getEventParticipants(eventId);
  }
}
