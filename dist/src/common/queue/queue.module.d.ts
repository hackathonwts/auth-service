import { OnModuleInit, INestApplication } from '@nestjs/common';
import { Queue } from 'bullmq';
export declare class QueueModule implements OnModuleInit {
    private readonly mailQueue;
    private readonly notificationQueue;
    private readonly reportQueue;
    private readonly leaderboardQueue;
    private readonly serverAdapter;
    constructor(mailQueue: Queue, notificationQueue: Queue, reportQueue: Queue, leaderboardQueue: Queue);
    onModuleInit(): void;
    setupBullBoard(app: INestApplication): void;
}
