import { Global, Module } from '@nestjs/common';
import { JMDictService } from './jmdict.service.js';

@Global()
@Module({
  providers: [JMDictService],
  exports: [JMDictService],
})
export class JMDictModule {}
