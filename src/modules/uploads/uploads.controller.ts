import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UseGuards,
  OnModuleInit,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'check-images');

@Controller('uploads')
export class UploadsController implements OnModuleInit {
  onModuleInit() {
    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  }

  @Post('check-images')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('images', 2, {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadCheckImages(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ urls: string[] }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    for (const file of files) {
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('Only image files allowed');
      }
    }

    const urls: string[] = [];

    for (const file of files) {
      const filename = `${randomUUID()}.jpg`;
      const outputPath = join(UPLOAD_DIR, filename);

      await sharp(file.buffer)
        .resize({ width: 1600, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(outputPath);

      urls.push(`/uploads/check-images/${filename}`);
    }

    return { urls };
  }
}
