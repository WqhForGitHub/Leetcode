// ============================================================
// 076. 在线选举
// ============================================================
// LeetCode 911. Online Election
// 给定投票时间序列，查询某时刻的领先候选人。

// 方法1：预处理 + 二分查找
class TopVotedCandidate {
  private times: number[];
  private leaders: number[]; // times[i] 时刻的领先者

  constructor(persons: number[], times: number[]) {
    this.times = times;
    this.leaders = new Array(times.length);
    const voteCount = new Map<number, number>();
    let currentLeader = -1;
    let maxVotes = 0;
    for (let i = 0; i < times.length; i++) {
      const p = persons[i];
      voteCount.set(p, (voteCount.get(p) || 0) + 1);
      const votes = voteCount.get(p)!;
      if (votes >= maxVotes) {
        maxVotes = votes;
        currentLeader = p;
      }
      this.leaders[i] = currentLeader;
    }
  }

  q(t: number): number {
    // 二分找 <= t 的最大时刻
    let left = 0;
    let right = this.times.length - 1;
    let idx = 0;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (this.times[mid] <= t) {
        idx = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return this.leaders[idx];
  }
}

// 方法2：二分（左边界变体）
class TopVotedCandidateAlt {
  private times: number[];
  private leaders: number[];

  constructor(persons: number[], times: number[]) {
    this.times = times;
    this.leaders = [];
    const count = new Map<number, number>();
    let leader = -1;
    count.set(-1, 0);
    for (const p of persons) {
      count.set(p, (count.get(p) || 0) + 1);
      if (count.get(p)! >= count.get(leader)!) {
        leader = p;
      }
      this.leaders.push(leader);
    }
  }

  q(t: number): number {
    let lo = 0;
    let hi = this.times.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (this.times[mid] <= t) lo = mid + 1;
      else hi = mid;
    }
    return this.leaders[lo - 1];
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 076. 在线选举 =====");
const tvc = new TopVotedCandidate([0, 1, 1, 0, 0, 1, 0], [0, 5, 10, 15, 20, 25, 30]);
console.log("q(3):", tvc.q(3)); // 0
console.log("q(12):", tvc.q(12)); // 1
console.log("q(25):", tvc.q(25)); // 1
console.log("q(15):", tvc.q(15)); // 0

export {};
