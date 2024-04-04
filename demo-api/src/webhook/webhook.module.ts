import { WebHookService } from './webhook.service';
import { WebHookController } from './webhook.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [WebHookController],
  providers: [WebHookService],
})
export class WebHookModule {}
