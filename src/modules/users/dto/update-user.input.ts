import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, MinLength } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  addressStreet?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  addressCity?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  addressState?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  addressZip?: string;
}
