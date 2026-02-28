import { ApiProperty } from '@nestjs/swagger';
import { Pigeon } from '../../entities/pigeon.entity';

export class PigeonChildResponseDto {
  @ApiProperty({ example: 'e26d790b-4e79-4a08-8564-590bf5e7f52e' })
  id: string;

  @ApiProperty({ example: 'Blue Thunder Jr.' })
  name: string;

  @ApiProperty({ example: 'Thunder Sr.', description: 'Father name of this child' })
  fatherName: string;

  @ApiProperty({
    example: '486ce47e-831f-4f4e-b310-34ab3104c7ac',
    nullable: true,
    description: 'Father pigeon ID if exists',
  })
  fatherId: string | null;

  @ApiProperty({ example: 'Silver Star', description: 'Mother name of this child' })
  motherName: string;

  @ApiProperty({
    example: 'db310d2f-2f9a-43ce-a317-5ce6d681ce6c',
    nullable: true,
    description: 'Mother pigeon ID if exists',
  })
  motherId: string | null;

  constructor(pigeon: Pigeon) {
    this.id = pigeon.id;
    this.name = pigeon.name;
    this.fatherName = pigeon.fatherName ?? '';
    this.fatherId = pigeon.fatherId ?? null;
    this.motherName = pigeon.motherName ?? '';
    this.motherId = pigeon.motherId ?? null;
  }
}
