// ============================================================
// 053. 黑名单中的随机数
// ============================================================
// LeetCode 710. Random Pick with Blacklist
// 在 [0, n) 中等概率随机选取一个不在黑名单中的整数。

// 方法1：映射法
class Solution710 {
  private size: number; // 白名单数量
  private map: Map<number, number>;

  constructor(n: number, blacklist: number[]) {
    this.map = new Map();
    blacklist.forEach((b) => this.map.set(b, -1));
    this.size = n - blacklist.length;
    let last = n - 1;
    for (const b of blacklist) {
      if (b < this.size) {
        // 找一个末尾的白名单数与之映射
        while (this.map.has(last)) last--;
        this.map.set(b, last);
        last--;
      }
    }
  }

  pick(): number {
    const r = Math.floor(Math.random() * this.size);
    if (this.map.has(r)) {
      return this.map.get(r)!;
    }
    return r;
  }
}

// 方法2：二分查找法
class Solution710Binary {
  private blacklist: number[];
  private size: number;

  constructor(n: number, blacklist: number[]) {
    this.blacklist = [...blacklist].sort((a, b) => a - b);
    this.size = n - blacklist.length;
  }

  pick(): number {
    const r = Math.floor(Math.random() * this.size);
    // 二分找 r 之前有多少黑名单数
    let lo = 0;
    let hi = this.blacklist.length - 1;
    let count = 0;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (this.blacklist[mid] <= r + count) {
        count = mid + 1;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return r + count;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 053. 黑名单中的随机数 =====");
const sol710 = new Solution710(7, [2, 3, 5]);
for (let i = 0; i < 5; i++) {
  console.log("pick:", sol710.pick()); // 0,1,4,6 之一
}

export {};
