import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

export class RegisterVaccinatedRequestDto {
  @ApiProperty({ example: '2025-01-15T10:00:00.000Z', description: 'Date when the pigeon was vaccinated' })
  @Expose()
  @IsDateString(
    {},
    {
      message: i18n('validation.IsDateString', { path: 'app', property: 'pigeon.vaccinatedAt' }),
    },
  )
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'pigeon.vaccinatedAt' }),
  })
  vaccinatedAt!: string;

  @ApiPropertyOptional({ example: 'Newcastle', description: 'Vaccine name' })
  @Expose()
  @IsOptional()
  @IsString()
  vaccineName?: string;

  @ApiPropertyOptional({ example: 'First dose', description: 'Vaccine note' })
  @Expose()
  @IsOptional()
  @IsString()
  note?: string;
}
