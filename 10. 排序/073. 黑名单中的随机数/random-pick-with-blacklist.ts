// ============================================================
// 073. 黑名单中的随机数
// ============================================================
// LeetCode 710. Random Pick with Blacklist
// 给定整数 n 和黑名单 blacklist，等概率随机返回 [0, n) 中不在黑名单内的整数。

// 方法1：哈希映射重映射黑名单到合法槽位（推荐，O(B) 初始化，O(1) pick）
// 思路：合法数共 M = n - B.length 个。将 [0, M) 内的黑名单数映射到 [M, n) 内的非黑名单数。
// pick 时在 [0, M) 内取随机数 r，若 r 在黑名单中则返回其映射值，否则返回 r。
class Solution73 {
  private readonly M: number;
  private readonly map: Map<number, number>;

  constructor(n: number, blacklist: number[]) {
    this.M = n - blacklist.length;
    this.map = new Map<number, number>();
    const blackSet = new Set<number>(blacklist);
    // w 指向 [M, n) 中可用（非黑名单）的最大下标
    let w = n - 1;
    for (const b of blacklist) {
      // 仅需重映射落在合法区间 [0, M) 内的黑名单数
      if (b < this.M) {
        while (blackSet.has(w)) {
          w--;
        }
        this.map.set(b, w);
        w--;
      }
    }
  }

  pick(): number {
    const r = Math.floor(Math.random() * this.M);
    const mapped = this.map.get(r);
    return mapped !== undefined ? mapped : r;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 073. 黑名单中的随机数 =====");
const sol73 = new Solution73(4, [2]);
const counts73 = new Map<number, number>();
for (let i = 0; i < 30000; i++) {
  const v = sol73.pick();
  counts73.set(v, (counts73.get(v) ?? 0) + 1);
}
const dist73 = Array.from(counts73.entries()).sort((a, b) => a[0] - b[0]);
console.log("分布(期望 0,1,3 各约 1/3):", dist73);
console.log("样本合法(无2):", !counts73.has(2));

const sol73b = new Solution73(5, [0, 3]);
const ok73 = new Set<number>();
for (let i = 0; i < 1000; i++) ok73.add(sol73b.pick());
console.log("n=5,blacklist=[0,3] 取值集合(应为 {1,2,4}):", Array.from(ok73).sort((a, b) => a - b));

export {};
