import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsEnum } from 'class-validator';
import { PigeonGender, PigeonStatus } from '../enums/pigeon.enum';

export class Pigeon {
  @ApiProperty({ description: 'Unique identifier for the pigeon' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Name of the pigeon' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Gender of the pigeon', enum: PigeonGender })
  @IsEnum(PigeonGender)
  gender: PigeonGender;

  @ApiProperty({ description: 'Status of the pigeon', enum: PigeonStatus })
  @IsEnum(PigeonStatus)
  status: PigeonStatus;

  @ApiProperty({ description: 'Owner ID of the pigeon', required: false })
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiProperty({ description: 'Documentation number of the pigeon' })
  @IsString()
  documentationNo: string;

  @ApiProperty({ description: 'Ring number of the pigeon' })
  @IsString()
  ringNo: string;

  @ApiProperty({ description: 'Ring color of the pigeon' })
  @IsString()
  ringColor: string;

  @ApiProperty({ description: 'Case number of the pigeon', required: false })
  @IsOptional()
  @IsString()
  caseNumber?: string;

  @ApiProperty({ description: 'Father name of the pigeon' })
  @IsString()
  fatherName: string;

  @ApiProperty({ description: 'Father pigeon object', required: false })
  @IsOptional()
  father?: Pigeon;

  @ApiProperty({ description: 'Mother name of the pigeon' })
  @IsString()
  motherName: string;

  @ApiProperty({ description: 'Mother pigeon object', required: false })
  @IsOptional()
  mother?: Pigeon;

  @ApiProperty({ description: 'Year of birth of the pigeon' })
  @IsString()
  yearOfBirth: string;

  @ApiProperty({ description: 'Date when the pigeon died', required: false })
  @IsOptional()
  @IsDate()
  deadAt?: Date;

  @ApiProperty({ description: 'Date when the pigeon was created' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the pigeon was last updated' })
  @IsDate()
  updatedAt: Date;
}
