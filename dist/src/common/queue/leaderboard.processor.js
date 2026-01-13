"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
let LeaderboardProcessor = class LeaderboardProcessor extends bullmq_1.WorkerHost {
    constructor() {
        super();
    }
    async process(job) {
        console.log("job", job);
        return true;
    }
    onCompleted(job) {
        console.log(`🎉 Leaderboard job completed for user: ${job.data.userId}`);
    }
    onFailed(job, err) {
        console.error(`❌ Leaderboard job FAILED for ${job.data.userId}`, err);
    }
};
exports.LeaderboardProcessor = LeaderboardProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeaderboardProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], LeaderboardProcessor.prototype, "onFailed", null);
exports.LeaderboardProcessor = LeaderboardProcessor = __decorate([
    (0, bullmq_1.Processor)('leaderboard-queue'),
    __metadata("design:paramtypes", [])
], LeaderboardProcessor);
