import { BadRequestException, ParseUUIDPipe } from '@nestjs/common';

export const CustomParseUUIDPipe = new ParseUUIDPipe({
  exceptionFactory: () => new BadRequestException('INVALID_UUID'),
});
