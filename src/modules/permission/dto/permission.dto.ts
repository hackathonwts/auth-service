import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { SortOrderEnum } from '@common/enum/sort-order.enum';

export enum PermissionAction {
  CREATE = 'Create',
  READ = 'Read',
  UPDATE = 'Update',
  DELETE = 'Delete',

  // advanced / product actions
  APPROVE = 'Approve',
  REJECT = 'Reject',
  EXPORT = 'Export',
  IMPORT = 'Import',
  ASSIGN = 'Assign',
  MANAGE = 'Manage',
}

export class PermissionListingDto {
  @ApiPropertyOptional({ default: 1 })
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 1))
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 10))
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search...' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim() : String(value)))
  @IsNotEmpty({ message: 'Search is required!' })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Sort Field' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim() : String(value)))
  @IsNotEmpty({ message: 'Sort Field is required!' })
  @IsOptional()
  sortField?: string;

  @ApiPropertyOptional({
    description: 'Sort Order',
    enum: SortOrderEnum,
  })
  @IsEnum(SortOrderEnum, { message: 'Sort order must be either asc or desc' })
  @IsOptional()
  sortOrder?: string;
}

export class SavePermissionDto {
  @ApiProperty({ example: 'Orders' })
  @IsString()
  @IsNotEmpty()
  module: string;

  @ApiProperty({ enum: PermissionAction, example: PermissionAction.CREATE })
  @IsEnum(PermissionAction)
  action: PermissionAction;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
