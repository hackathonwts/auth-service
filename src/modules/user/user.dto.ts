import { StatusEnum } from '@common/enum/status.enum';
import { SortOrderEnum } from '@common/enum/sort-order.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { Types } from 'mongoose';
import { RoleGroup, UserRole } from '@common/enum/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'Full Name', required: true })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim() : String(value)))
  @IsNotEmpty({ message: 'Full Name is required!' })
  fullName: string;

  @ApiProperty({ description: 'Email address', required: true })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim()?.toLowerCase() : String(value)))
  @IsEmail({}, { message: 'Please enter a valid email!' })
  @IsNotEmpty({ message: 'Email address is required!' })
  email: string;

  @ApiPropertyOptional({ description: 'Password must be at least 8 characters long and contain at least one letter and one number.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, { message: 'Password must contain at least one letter and one number!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim() : String(value)))
  @IsOptional()
  password: string;

  @ApiPropertyOptional({ description: 'User Role', required: true, type: 'string' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim() : String(value)))
  @IsEnum([UserRole.ADMIN, UserRole.USER], { message: 'Role must be either admin or user' })
  role: string;

  @ApiPropertyOptional({ description: 'Profile image (jpg, png, jpeg)', type: 'string', format: 'binary' })
  @IsNotEmpty()
  @IsOptional()
  profileImage?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Email address' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim()?.toLowerCase() : String(value)))
  @IsEmail({}, { message: 'Please enter a valid email!' })
  @IsNotEmpty({ message: 'Email address is required!' })
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ description: 'Full Name' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim() : String(value)))
  @IsNotEmpty({ message: 'Full Name is required!' })
  @IsOptional()
  fullName: string;

  @ApiPropertyOptional({ description: 'User Name' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim() : String(value)))
  @IsNotEmpty({ message: 'User Name is required!' })
  @IsOptional()
  userName: string;

  @ApiPropertyOptional({ description: 'User Role', type: 'string' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim() : value instanceof Types.ObjectId ? value.toString() : String(value)))
  @IsNotEmpty({ message: 'User Role is required!' })
  @IsMongoId({ message: 'User Role is not a valid MongoDB ObjectId.!' })
  @IsOptional()
  role: Types.ObjectId | string;

  @ApiPropertyOptional({
    description: 'Profile image (jpg, png, jpeg)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  profileImage?: string;
}
export class ListingUserDto {
  @ApiPropertyOptional({ default: 1 })
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 1))
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 10))
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search...' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Status Filter', enum: StatusEnum })
  @IsEnum(StatusEnum, { message: 'Status must be either Active or Inactive' })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Sort Field' })
  @IsString()
  @IsOptional()
  sortField?: string;

  @ApiPropertyOptional({
    description: 'Sort Order',
    enum: SortOrderEnum,
  })
  @IsEnum(SortOrderEnum, { message: 'Sort order must be either asc or desc' })
  @IsOptional()
  sortOrder?: string;

  @ApiPropertyOptional({ description: 'User Role ID Filter' })
  @IsMongoId({ message: 'Role ID is not a valid MongoDB ObjectId.!' })
  @IsOptional()
  roleId?: string;

  @ApiPropertyOptional({ description: 'User Role', type: 'string' })
  @IsEnum([UserRole.ADMIN, UserRole.USER], { message: 'Role must be either admin or user' })
  @IsOptional()
  role?: string = UserRole.USER;

  @ApiPropertyOptional({ description: 'Role Group Filter', enum: RoleGroup })
  @IsEnum(RoleGroup, { message: 'Role Group must be either backend or frontend' })
  @IsOptional()
  roleGroup?: RoleGroup = RoleGroup.FRONTEND;
}

export class UpdateUserStatusDto {
  @ApiProperty({ description: 'Status', required: true, enum: StatusEnum })
  @IsEnum(StatusEnum, { message: 'Status must be either Active or Inactive' })
  @IsNotEmpty({ message: 'Status is required' })
  status: string;
}

export class UpdateUserPasswordDto {
  @ApiProperty({ description: 'New password must be at least 8 characters long and contain at least one letter and one number.', required: true })
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter and one number!',
  })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim() : String(value)))
  @IsNotEmpty({ message: 'Password is required!' })
  password: string;
}
