import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsUUID } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

export class DestroyEggsRequestDto {
  @ApiProperty({
    description: 'One or two egg IDs to destroy',
    example: ['e9437hi4-h9d9-777i-d298-gg2ei74ie37e'],
    minItems: 1,
    maxItems: 2,
  })
  @Expose()
  @IsArray()
  @ArrayMinSize(1, {
    message: i18n('validation.ArrayMinSize', { path: 'app', property: 'formula.eggIds' }),
  })
  @ArrayMaxSize(2, {
    message: i18n('validation.ArrayMaxSize', { path: 'app', property: 'formula.eggIds' }),
  })
  @IsUUID('4', { each: true, message: i18n('validation.IsUUID', { path: 'app', property: 'formula.eggId' }) })
  eggIds!: string[];
}
