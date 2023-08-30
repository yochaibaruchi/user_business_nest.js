import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiProduces,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { PutObjectCommandOutput } from '@aws-sdk/client-s3/dist-types/commands/PutObjectCommand';
@ApiTags('s3')
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FilesInterceptor('file', 20))
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of files',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  upload(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)' }),
          new MaxFileSizeValidator({ maxSize: 5000000 }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ): Promise<PromiseSettledResult<PutObjectCommandOutput>[]> {
    return this.s3Service.upload(files);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Retrieve a file by key' })
  @ApiProduces('image/png', 'image/jpeg', 'application/pdf')
  @ApiResponse({ status: 200, description: 'File successfully retrieved' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async Download(@Param('key') key: string, @Res() res: Response) {
    try {
      const fileOutput = await this.s3Service.getFile({ key });
      const fileExtension = extname(key).toLowerCase();
      let contentType = 'application/octet-stream';
      switch (fileExtension) {
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpeg':
        case '.jpg':
          contentType = 'image/jpeg';
          break;
        case '.pdf':
          contentType = 'application/pdf';
          break;
      }
      res.setHeader('Content-Type', contentType);
      const byteArray = await fileOutput.Body.transformToByteArray();
      res.end(new Uint8Array(byteArray));
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).send(error.message);
      }
    }
  }
}
