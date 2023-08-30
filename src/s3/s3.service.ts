import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
} from '@aws-sdk/client-s3';
import s3Errors from './s3.errors';
import { GgetFileDto } from './dto/getFile.dto.interface';
@Injectable()
export class S3Service {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
  });
  constructor(private readonly configService: ConfigService) {}

  upload(
    files: Express.Multer.File[],
  ): Promise<PromiseSettledResult<PutObjectCommandOutput>[]> {
    try {
      const bucket = this.configService.get<string>('S3_BUCKET');
      const promises = files.map((file): Promise<PutObjectCommandOutput> => {
        return this.s3Client.send(
          new PutObjectCommand({
            ACL: 'private',
            Bucket: bucket,
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );
      });
      return Promise.allSettled(promises);
    } catch (err) {
      console.log(err);
    }
  }

  async getFile(getFileDto: GgetFileDto): Promise<GetObjectCommandOutput> {
    const params: GetObjectCommandInput = {
      Bucket: this.configService.getOrThrow('S3_BUCKET'),
      Key: getFileDto.key,
    };
    const command = new GetObjectCommand(params);
    try {
      const response: GetObjectCommandOutput = await this.s3Client.send(
        command,
      );
      return response;
    } catch (error) {
      if (error.code === s3Errors.NoSuchKey) {
        throw new NotFoundException(
          `File with key ${getFileDto.key} not found`,
        );
      } else if (error.code === s3Errors.NoSuchBucket) {
        throw new NotFoundException(`No such bucket`);
      } else {
        console.log(error);
      }
    }
  }
}
