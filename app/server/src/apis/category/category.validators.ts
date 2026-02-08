import { IsString, IsArray, IsOptional, IsNotEmpty, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryType } from './category.models';

/**
 * SubCategory DTO
 */
export class SubCategoryDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}

/**
 * Create Category DTO
 */
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  trackerId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(['expense', 'income', 'debit_mode', 'credit_mode'])
  @IsOptional()
  type?: CategoryType;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SubCategoryDto)
  subcategories?: SubCategoryDto[];
}

/**
 * Update Category DTO
 */
export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(['expense', 'income', 'debit_mode', 'credit_mode'])
  @IsOptional()
  type?: CategoryType;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SubCategoryDto)
  subcategories?: SubCategoryDto[];
}

/**
 * Get All Categories Query DTO
 */
export class GetAllCategoriesQueryDto {
  @IsString()
  @IsOptional()
  trackerId?: string;

  @IsEnum(['expense', 'income', 'debit_mode', 'credit_mode'])
  @IsOptional()
  type?: CategoryType;
}

/**
 * Category Response DTO
 */
export class CategoryResponseDto {
  id: string;
  name: string;
  type: CategoryType;
  subcategories: SubCategoryDto[];
  trackerId: string;

  constructor(data: any) {
    this.id = data._id || data.id;
    this.name = data.name;
    this.type = data.type || 'expense';
    this.subcategories = data.subcategories || [];
    this.trackerId = data.trackerId;
  }
}
