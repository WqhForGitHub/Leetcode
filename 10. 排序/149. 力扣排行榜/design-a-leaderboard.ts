// ============================================================
// 149. 力扣排行榜
// ============================================================
// LeetCode 1244. Design A Leaderboard
// 设计排行榜：addScore 累加分数、reset 重置、top(K) 返回前 K 名分数之和。

// 方法1：HashMap + 排序取前 K（推荐，addScore O(1)，top O(n log n)，reset O(1)）
class Leaderboard {
  private scores: Map<number, number>;

  constructor() {
    this.scores = new Map<number, number>();
  }

  addScore(playerId: number, score: number): void {
    const prev: number = this.scores.get(playerId) ?? 0;
    this.scores.set(playerId, prev + score);
  }

  top(K: number): number {
    const sorted: number[] = [...this.scores.values()].sort((a, b) => b - a);
    let sum: number = 0;
    const limit: number = Math.min(K, sorted.length);
    for (let i = 0; i < limit; i++) {
      sum += sorted[i];
    }
    return sum;
  }

  reset(playerId: number): void {
    this.scores.delete(playerId);
  }
}

// 方法2：HashMap + 维护有序分数数组（multiset 思想，top O(K)，addScore/reset O(n)）
// 用一个升序数组维护所有当前分数，每次更新用二分定位插入/删除。
class Leaderboard2 {
  private scores: Map<number, number>; // playerId -> score
  private sorted: number[]; // 升序的分数列表

  constructor() {
    this.scores = new Map<number, number>();
    this.sorted = [];
  }

  // 第一个 >= target 的下标（lower_bound）
  private lowerBound(target: number): number {
    let lo: number = 0;
    let hi: number = this.sorted.length;
    while (lo < hi) {
      const mid: number = (lo + hi) >> 1;
      if (this.sorted[mid] < target) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    return lo;
  }

  private insertScore(score: number): void {
    const idx: number = this.lowerBound(score);
    this.sorted.splice(idx, 0, score);
  }

  private removeScore(score: number): void {
    const idx: number = this.lowerBound(score);
    if (idx < this.sorted.length && this.sorted[idx] === score) {
      this.sorted.splice(idx, 1);
    }
  }

  addScore(playerId: number, score: number): void {
    const old: number = this.scores.get(playerId) ?? 0;
    if (old > 0) {
      this.removeScore(old);
    }
    const newScore: number = old + score;
    this.scores.set(playerId, newScore);
    this.insertScore(newScore);
  }

  top(K: number): number {
    let sum: number = 0;
    const limit: number = Math.min(K, this.sorted.length);
    for (let i = 0; i < limit; i++) {
      sum += this.sorted[this.sorted.length - 1 - i];
    }
    return sum;
  }

  reset(playerId: number): void {
    const old: number = this.scores.get(playerId) ?? 0;
    if (old > 0) {
      this.removeScore(old);
    }
    this.scores.delete(playerId);
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 149. 力扣排行榜 =====");
const lb: Leaderboard = new Leaderboard();
lb.addScore(1, 73);
lb.addScore(2, 56);
lb.addScore(3, 39);
lb.addScore(4, 51);
lb.addScore(5, 4);
console.log("top(1):", lb.top(1)); // 期望: 73
lb.reset(1);
lb.reset(2);
lb.addScore(2, 51);
console.log("top(3):", lb.top(3)); // 期望: 141 = 51 + 51 + 39

const lb2: Leaderboard2 = new Leaderboard2();
lb2.addScore(1, 73);
lb2.addScore(2, 56);
lb2.addScore(3, 39);
lb2.addScore(4, 51);
lb2.addScore(5, 4);
console.log("方法2 top(1):", lb2.top(1)); // 期望: 73
lb2.reset(1);
lb2.reset(2);
lb2.addScore(2, 51);
console.log("方法2 top(3):", lb2.top(3)); // 期望: 141

export {};
