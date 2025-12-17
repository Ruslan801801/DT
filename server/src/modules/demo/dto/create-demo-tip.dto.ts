import { IsInt, Min } from 'class-validator';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDemoTipDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  fromToken?: string;

  @IsString()
  @MaxLength(32)
  toName!: string;

  @IsInt()
  @Min(1)
  amount!: number;

  @IsOptional()
  @IsString()
  @MaxLength(280)
  message?: string;
}
