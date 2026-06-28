// ============================================================
// 131. 黑名单中的随机数
// ============================================================
// LeetCode 710. Random Pick with Blacklist
// 给定整数 n 和黑名单数组 blacklist，从 [0, n) 中等概率随机返回一个不在黑名单中的数。
// 时间复杂度：预处理 O(B)，pick O(1)；空间复杂度：O(B)，B 为黑名单大小

// 思路：将 [0, n-B) 区间视为合法范围，把黑名单中在该区间的数映射到
// [n-B, n) 中非黑名单的数上
class Solution {
  private map = new Map<number, number>(); // 黑名单数 -> 映射目标
  private bound: number;

  constructor(n: number, blacklist: number[]) {
    this.bound = n - blacklist.length;
    const black = new Set(blacklist);

    // 找出 [bound, n) 中不在黑名单的数，作为映射目标
    let ptr = this.bound;
    for (const b of blacklist) {
      if (b < this.bound) {
        // 找一个未被占用且不在黑名单的目标
        while (black.has(ptr)) ptr++;
        this.map.set(b, ptr);
        ptr++;
      }
    }
  }

  pick(): number {
    // 在 [0, bound) 中随机取
    const r = Math.floor(Math.random() * this.bound);
    // 若在黑名单中，返回映射值
    if (this.map.has(r)) {
      return this.map.get(r)!;
    }
    return r;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 131. 黑名单中的随机数 =====");
const sol = new Solution(7, [2, 3, 5]);
// 合法数字应为 [0, 1, 4, 6]，bound = 7 - 3 = 4
const picks: Record<number, number> = {};
for (let i = 0; i < 1000; i++) {
  const p = sol.pick();
  picks[p] = (picks[p] || 0) + 1;
}
console.log("采样分布:", picks); // 期望: 只含 0,1,4,6

export {};
