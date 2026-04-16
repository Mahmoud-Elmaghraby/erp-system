import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OutboxService } from './outbox.service';

@Injectable()
export class OutboxProcessor implements OnModuleInit {
  private readonly logger = new Logger(OutboxProcessor.name);

  constructor(
    private outboxService: OutboxService,
    private eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    setInterval(() => this.processEvents(), 5000);
  }

  async processEvents(): Promise<void> {
    const events = await this.outboxService.getPendingEvents();

    for (const event of events) {
      try {
        await this.eventEmitter.emitAsync(event.eventType, event.payload);
        await this.outboxService.markAsProcessed(event.id);
        this.logger.log(`Event processed: ${event.eventType}`);
      } catch (error) {
        await this.outboxService.markAsFailed(event.id);
        this.logger.error(`Event failed: ${event.eventType}`, error);
      }
    }
  }
}