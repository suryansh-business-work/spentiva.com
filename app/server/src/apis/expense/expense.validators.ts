import {
  IsNumber,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  Min,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Parse Expense DTO
 */
export class ParseExpenseDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsString()
  @IsNotEmpty()
  trackerId!: string;
}

/**
 * Create Expense DTO
 */
export class CreateExpenseDto {
  @IsEnum(['expense', 'income', 'transfer'])
  @IsOptional()
  type?: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  subcategory!: string;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  creditFrom?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  timestamp?: string;

  @IsString()
  @IsOptional()
  trackerId?: string;
}

/**
 * Create Bulk Expenses DTO
 */
export class CreateBulkExpensesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateExpenseDto)
  expenses!: CreateExpenseDto[];

  @IsString()
  @IsOptional()
  trackerId?: string;
}

/**
 * Update Expense DTO
 */
export class UpdateExpenseDto {
  @IsEnum(['expense', 'income', 'transfer'])
  @IsOptional()
  type?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  subcategory?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  creditFrom?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  timestamp?: string;
}

/**
 * Chat DTO
 */
export class ChatDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsOptional()
  history?: any[];

  @IsString()
  @IsOptional()
  trackerId?: string;
}
