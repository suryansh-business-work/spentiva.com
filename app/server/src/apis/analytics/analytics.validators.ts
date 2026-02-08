import { IsString, IsOptional, IsDateString, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum DateFilter {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last7days',
  THIS_MONTH = 'thisMonth',
  LAST_MONTH = 'lastMonth',
  THIS_YEAR = 'thisYear',
  CUSTOM = 'custom',
  ALL = 'all',
}

export enum TransactionTypeFilter {
  EXPENSE = 'expense',
  INCOME = 'income',
  ALL = 'all',
}

export class AnalyticsQueryDto {
  @IsEnum(DateFilter)
  @IsOptional()
  filter?: DateFilter;

  @IsDateString()
  @IsOptional()
  customStart?: string;

  @IsDateString()
  @IsOptional()
  customEnd?: string;

  @IsString()
  @IsOptional()
  trackerId?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  year?: number;

  @IsEnum(TransactionTypeFilter)
  @IsOptional()
  type?: TransactionTypeFilter;
}

export class SummaryStatsDto {
  totalExpenses!: number;
  totalIncome!: number;
  netBalance!: number;
  transactionCount!: number;
  averageExpense!: number;
  averageIncome!: number;
}

export class CategoryAnalyticsDto {
  category!: string;
  total!: number;
  count!: number;
  type?: string;
}

export class MonthlyAnalyticsDto {
  month!: number;
  total!: number;
  count!: number;
  expenses?: number;
  income?: number;
}

export class SourceAnalyticsDto {
  paymentMethod!: string;
  total!: number;
  count!: number;
}
