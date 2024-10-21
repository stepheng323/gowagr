import { ApiProperty } from '@nestjs/swagger';

class TransferData {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  senderAccountId: string;

  @ApiProperty()
  receiverAccountId: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  reference: string;

  @ApiProperty()
  metadata: string;

  @ApiProperty()
  amount: string;

  @ApiProperty()
  balanceBefore: string;

  @ApiProperty()
  balanceAfter: string;

  @ApiProperty()
  note: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class TransferResponseDto {
  @ApiProperty()
  status: boolean;
  @ApiProperty()
  message: string;
  @ApiProperty()
  data: TransferData;
}

export class TransferDetailsDto {
  @ApiProperty({
    example: 'ab2549e0-0a41-4543-8a91-c40c713abd59',
    description: 'Unique identifier for the transfer',
  })
  id: string;

  @ApiProperty({
    example: '31cdd8a0-488b-4aa3-b8c5-2de280f0d25f',
    description: 'Account ID of the sender',
  })
  senderAccountId: string;

  @ApiProperty({
    example: '0c2fad7b-714b-47f1-a050-975b72a3d256',
    description: 'Account ID of the receiver',
  })
  receiverAccountId: string;

  @ApiProperty({
    example: 'credit',
    description: 'Type of transfer',
  })
  type: string;

  @ApiProperty({
    example: 'pending',
    description: 'Current status of the transfer',
  })
  status: string;

  @ApiProperty({
    example: '1562e633-984a-4613-8536-abdf50ec8e58',
    description: 'Reference number for the transfer',
  })
  reference: string;

  @ApiProperty({
    example: null,
    description: 'Metadata for the transfer',
  })
  metadata: string;

  @ApiProperty({
    example: '1000.00',
    description: 'Amount transferred',
  })
  amount: string;

  @ApiProperty({
    example: '0.00',
    description: 'Balance before the transfer',
  })
  balanceBefore: string;

  @ApiProperty({
    example: '1000.00',
    description: 'Balance after the transfer',
  })
  balanceAfter: string;

  @ApiProperty({
    example: 'flex with this money',
    description: 'Note for the transfer',
  })
  note: string;

  @ApiProperty({
    example: '2024-10-21T13:49:24.903Z',
    description: 'Timestamp of transfer creation',
  })
  createdAt: string;

  @ApiProperty({
    example: null,
    description: 'Timestamp of transfer update',
  })
  updatedAt: string;

  @ApiProperty({
    example: '905a3df1-c1a0-4a7f-ae9c-b1c588a34144',
    description: 'User ID associated with the transfer',
  })
  userId: string;
}

export class TransferHistoryResponseDto {
  @ApiProperty({
    example: true,
    description: 'Response status',
  })
  status: boolean;

  @ApiProperty({
    example: 'Transaction history fetched successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    description: 'Transfer data object',
    type: TransferData,
  })
  data: TransferData;
  @ApiProperty({
    example: 1,
    description: 'Current page number',
  })
  page: number;

  @ApiProperty({
    example: 10,
    description: 'Limit of items per page',
  })
  limit: number;

  @ApiProperty({
    example: 1,
    description: 'Total number of items',
  })
  totalItems: number;

  @ApiProperty({
    example: 1,
    description: 'Total number of pages',
  })
  totalPages: number;
}
