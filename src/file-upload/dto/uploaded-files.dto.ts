import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UploadedFilesDto {
  @Expose()
  @ApiProperty()
  fileName: string;

  @Expose()
  @ApiProperty()
  fileURL: string;
}
