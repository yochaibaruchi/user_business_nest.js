import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DefaultBusinessService } from './default-business.service';
import { CreateDefaultBusinessDto } from './dto/create-default-business.dto';
import { UpdateDefaultBusinessDto } from './dto/update-default-business.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CognitoAuthGuard } from 'src/cognito/guards/cognito.jwt.guard';
import { CognitoJwt } from 'src/cognito/cognito.interfaces';
import { DefaultBusiness } from './entities/default-business.entity';
@ApiTags('default-business')
@Controller('default-business')
export class DefaultBusinessController {
  constructor(
    private readonly defaultBusinessService: DefaultBusinessService,
  ) {}

  @Post()
  create(@Body() createDefaultBusinessDto: CreateDefaultBusinessDto) {
    return this.defaultBusinessService.create(createDefaultBusinessDto);
  }
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Update Default Business' }) // This decorator provides description for this route in Swagger UI.
  @ApiBody({
    type: UpdateDefaultBusinessDto,
    description: 'Business to set as default',
  })
  update(
    @Req() req: CognitoJwt,
    @Body() updateDefaultBusinessDto: UpdateDefaultBusinessDto,
  ): Promise<number> {
    return this.defaultBusinessService.update(
      req.user.sub,
      updateDefaultBusinessDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.defaultBusinessService.remove(+id);
  }
}
