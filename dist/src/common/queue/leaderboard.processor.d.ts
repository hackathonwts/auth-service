import { WorkerHost } from '@nestjs/bullmq';
export declare class LeaderboardProcessor extends WorkerHost {
    constructor();
    process(job: any): Promise<any>;
    onCompleted(job: any): void;
    onFailed(job: any, err: any): void;
}
