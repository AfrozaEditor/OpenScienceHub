import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { handleController } from '../common/utils/handle.controller';
import {
  BootstrapOpenScienceDto,
  IssueOpenScienceCredentialDto,
} from './dto/openscience.dto';
import { OpenScienceService } from './openscience.service';

@ApiTags('openscience')
@Controller('openscience')
export class OpenScienceController {
  constructor(private readonly openScienceService: OpenScienceService) {}

  @Post('bootstrap')
  @ApiOperation({
    summary: 'Bootstrap OpenScience Hub DID, schema, and credential definition',
  })
  @ApiResponse({ status: 201, description: 'OpenScience bootstrap completed' })
  async bootstrap(@Body() body: BootstrapOpenScienceDto) {
    return handleController(async () => ({
      success: true,
      data: await this.openScienceService.bootstrap(body),
    }));
  }

  @Post('credentials')
  @ApiOperation({ summary: 'Issue/store a custodian OpenScience credential' })
  @ApiResponse({ status: 201, description: 'Custodian credential stored' })
  async issueCredential(@Body() body: IssueOpenScienceCredentialDto) {
    return handleController(async () => ({
      success: true,
      data: await this.openScienceService.issueCredential(body),
    }));
  }

  @Get('credentials/:credentialId/status')
  @ApiOperation({ summary: 'Get OpenScience custodian credential status' })
  @ApiParam({ name: 'credentialId' })
  async getCredentialStatus(@Param('credentialId') credentialId: string) {
    return handleController(async () => ({
      success: true,
      data: await this.openScienceService.getCredentialStatus(credentialId),
    }));
  }
}
