import { createMock } from '@golevelup/ts-jest';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CustomParseUUIDPipe } from './custom-parse-uuid.pipe';

describe('CustomParseUUIDPipe', () => {
  const mockValidUUID = 'FDB4433E-F36B-1410-8588-00E49DB4DA7C';

  it('should parse valid UUID properly', async () => {
    const result = await CustomParseUUIDPipe.transform(mockValidUUID, createMock<ArgumentMetadata>());

    expect(result).toEqual(mockValidUUID);
  });

  it('should reject invalid UUID properly', async () => {
    const act = () => CustomParseUUIDPipe.transform('qwe', createMock<ArgumentMetadata>());

    await expect(act).rejects.toThrow(new BadRequestException('INVALID_UUID'));
  });
});
