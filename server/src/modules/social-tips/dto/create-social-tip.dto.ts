import { IsString, IsNumber, IsPositive, IsOptional, MaxLength, IsInt, Min, Max, IsArray } from 'class-validator';

export class CreateSocialTipDto {
  @IsString()
  sender_id!: string;

  @IsString()
  receiver_eid!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsOptional()
  @IsString()
  @MaxLength(140)
  message?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2)
  anonymity_level?: number;

  @IsOptional()
  @IsString()
  media_url?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

---