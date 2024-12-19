import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsBoolean()
  isSuperAdmin: boolean = false;
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isSuperAdmin?: boolean;
}

export class RoleDto {
  @IsInt()
  id: number;

  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isSuperAdmin: boolean;

  createdAt: Date;
  updatedAt: Date;
}
