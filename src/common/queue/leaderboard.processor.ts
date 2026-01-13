import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';

@Processor('leaderboard-queue')
export class LeaderboardProcessor extends WorkerHost {
  constructor(
    // private readonly leaderboardRepo: LeaderboardRepository,
    // private readonly attemptRepo: QuizAttemptRepository,
  ) {
    super();
  }

  // -------------------------------------------
  // PROCESS JOB
  // -------------------------------------------
  async process(job: any): Promise<any> {
    console.log("job",job);
    
    // const { userId } = job.data;

    // 1. Fetch all attempts of this user
    // const attempts = await this.attemptRepo.getAttemptsOfUser(userId);

    // if (!attempts.length) return;

    // 2. Compute stats
    // const totalScore = attempts.reduce((s, a) => s + (a.totalScore || 0), 0);
    // const totalTime = attempts.reduce((s, a) => s + (a.timeTaken || 0), 0);
    // const correct = attempts.reduce((s, a) => s + (a.correctCount || 0), 0);
    // const incorrect = attempts.reduce((s, a) => s + (a.incorrectCount || 0), 0);

    // const accuracy = correct + incorrect === 0 ? 0 : Number(((correct / (correct + incorrect)) * 100).toFixed(2));

    // const lastAttemptAt = attempts.at(-1).submittedAt;

    // 3. Update user row in Leaderboard
    // await this.leaderboardRepo.updateUserStats(userId, {
    //   totalScore,
    //   totalTime,
    //   accuracy,
    //   lastAttemptAt,
    // });

    // 4. Recalculate global ranks
    // await this.leaderboardRepo.recalculateRanks();

    return true;
  }

  // -------------------------------------------
  // OPTIONAL LOGGING
  // -------------------------------------------
  @OnWorkerEvent('completed')
  onCompleted(job: any) {
    console.log(`🎉 Leaderboard job completed for user: ${job.data.userId}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: any, err: any) {
    console.error(`❌ Leaderboard job FAILED for ${job.data.userId}`, err);
  }
}
