import { ApiProperty } from '@nestjs/swagger';

export class FindUserByEmailDTO {
  @ApiProperty()
  email: string;
}
