import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Put,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Business } from './entities/business.entity';
import { CognitoAuthGuard } from 'src/cognito/guards/cognito.jwt.guard';
import { CognitoJwt } from 'src/cognito/cognito.interfaces';
import { RolesGuard } from 'src/cognito/guards/roleGuard.guard';
@ApiTags('Business')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new business' })
  @ApiResponse({
    status: 201,
    description: 'The business has been successfully created.',
    type: Business,
  })
  @ApiResponse({
    status: 409,
    description: 'Business with this bank account already exists.',
  })
  async create(
    @Req() req: CognitoJwt,
    @Body() createBusinessDto: CreateBusinessDto,
  ): Promise<Business> {
    return this.businessService.create(createBusinessDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all businesses' })
  @ApiResponse({
    status: 200,
    description: 'A list of all businesses',
    type: [Business],
  })
  @ApiResponse({ status: 404, description: 'No businesses found' })
  @ApiResponse({ status: 400, description: 'bad request' })
  findAll() {
    return this.businessService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a business by ID' })
  @ApiParam({ name: 'id', description: 'Business ID', type: 'integer' })
  @ApiResponse({
    status: 200,
    description: 'The business with the given ID',
    type: Business,
  })
  @ApiResponse({ status: 404, description: 'Business not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.businessService.findById(id);
  }
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a business' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Business updated successfully',
    type: Business,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Business not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Business with this bank account already exists',
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusinessDto: UpdateBusinessDto,
    // @Req() req: CognitoJwt,
  ): Promise<Business> {
    return this.businessService.update(id, updateBusinessDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.businessService.remove(+id);
  // }
}
