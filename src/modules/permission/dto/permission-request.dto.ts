import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class PermissionRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;
}
