import { Response, Request } from 'express';
import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { convertResponse } from 'src/utils/response';
import { TransferService } from './transfer.service';
import { TransferDto } from './dto/transfer.dto';
import { AuthGuard } from 'src/lib/guard/authGuard';
import { TransactionQuery } from 'src/types';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BadRequestResponse, NotFoundResponse } from '../dto/baseReponse';
import {
  TransferHistoryResponseDto,
  TransferResponseDto,
} from './dto/transfer-response.dto';

@ApiTags('transfer')
@ApiBearerAuth()
@Controller('transfers')
@UseGuards(AuthGuard)
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  @ApiNotFoundResponse({
    description: 'Please enter a valid receiver username',
    type: NotFoundResponse,
  })
  @ApiBadRequestResponse({
    description: 'Insufficient funds to complete the transfer',
    type: BadRequestResponse,
  })
  @ApiOkResponse({
    description: 'Transfer initiated successfully',
    type: TransferResponseDto,
  })
  async initiateTransfer(
@Body()
transferDto: TransferDto, @Res()
response: Response, p0: globalThis.Request, @Req()
req: Request,
  ) {
    const user = req.user;
    const result = await this.transferService.transfer(user, transferDto);
    return convertResponse(response, result);
  }

  @Get('')
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'transactionType',
    required: false,
    description: 'Filter by transaction type',
    enum: ['credit', 'debit'],
  })
  @ApiQuery({
    name: 'sortByDate',
    required: false,
    description: 'Sort by date',
    enum: ['asc', 'desc'],
  })
  @ApiOkResponse({
    description: 'Transaction history fetched successfully',
    type: TransferHistoryResponseDto,
  })
  async transfers(
    @Res() response: Response,
    @Req() req: Request,
    @Query() filter: TransactionQuery,
  ) {
    const user = req.user;
    const result = await this.transferService.getTransfers(user, filter);
    return convertResponse(response, result);
  }
}
