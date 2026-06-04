import { Module } from '@nestjs/common';
import { CredoAgentModule } from '../credo-agent/credo-agent.module';
import { IssuanceModule } from '../issuance/issuance.module';
import { OpenScienceController } from './openscience.controller';
import { OpenScienceService } from './openscience.service';

@Module({
  imports: [CredoAgentModule, IssuanceModule],
  providers: [OpenScienceService],
  controllers: [OpenScienceController],
  exports: [OpenScienceService],
})
export class OpenScienceModule {}
