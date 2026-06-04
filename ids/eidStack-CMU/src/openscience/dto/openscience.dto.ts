import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OpenScienceAttributeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  value: string;
}

export class BootstrapOpenScienceDto {
  @ApiProperty()
  @IsString()
  walletId: string;

  @ApiProperty()
  @IsString()
  walletKey: string;

  @ApiProperty()
  @IsString()
  endpoint: string;

  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty()
  @IsString()
  seed: string;

  @ApiPropertyOptional({ default: 'ScientificWorkArchiveCredential' })
  @IsOptional()
  @IsString()
  schemaName?: string;

  @ApiPropertyOptional({ default: '1.0' })
  @IsOptional()
  @IsString()
  schemaVersion?: string;

  @ApiPropertyOptional({ default: 'openscience-hub-archive-v1' })
  @IsOptional()
  @IsString()
  credentialDefinitionTag?: string;
}

export class IssueOpenScienceCredentialDto {
  @ApiProperty()
  @IsString()
  credentialDefinitionId: string;

  @ApiProperty({ type: [OpenScienceAttributeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpenScienceAttributeDto)
  attributes: OpenScienceAttributeDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}
