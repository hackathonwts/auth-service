import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';

type Handler = (payload: any) => Promise<void>;

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumers = new Map<string, Consumer>();
  private logger = new Logger(KafkaService.name);

  onModuleInit() {
    this.kafka = new Kafka({
      clientId: 'nest-app',
      brokers: ['localhost:9092'],
    });
    this.producer = this.kafka.producer();
  }

  async connect() {
    await this.producer.connect();
  }

  /* ---------- PRODUCER ---------- */
  async emit(topic: string, payload: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });
  }

  /* ---------- DYNAMIC CONSUMER ---------- */
  async registerConsumer(
    topic: string,
    groupId: string,
    handler: Handler,
  ) {
    const key = `${topic}:${groupId}`;
    if (this.consumers.has(key)) return;

    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic });

    await consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value?.toString() || '{}');
        await handler(data);
      },
    });

    this.consumers.set(key, consumer);
    this.logger.log(`Consumer running → ${key}`);
  }

  async onModuleDestroy() {
    for (const c of this.consumers.values()) {
      await c.disconnect();
    }
    await this.producer.disconnect();
  }
}
