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

@UseGuards(AuthGuard)
@Controller('transfers')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async initiateTransfer(
    @Body() transferDto: TransferDto,
    @Res() response: Response,
    @Req() req: Request,
  ) {
    const user = req.user;
    const result = await this.transferService.transfer(user, transferDto);
    return convertResponse(response, result);
  }

  @Get('')
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
