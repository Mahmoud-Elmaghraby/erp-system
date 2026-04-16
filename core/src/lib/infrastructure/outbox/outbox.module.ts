import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OutboxService } from './outbox.service';
import { OutboxProcessor } from './outbox.processor';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [OutboxService, OutboxProcessor, PrismaService],
  exports: [OutboxService],
})
export class OutboxModule {}