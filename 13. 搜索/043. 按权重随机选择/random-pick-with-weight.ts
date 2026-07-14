// ============================================================
// 043. 按权重随机选择
// ============================================================
// LeetCode 528. Random Pick with Weight
// 给定正整数权重数组，按权重比例随机返回下标。

// 方法1：前缀和 + 二分查找
class Solution528 {
  private prefix: number[];
  private total: number;

  constructor(w: number[]) {
    this.prefix = [0];
    for (const weight of w) {
      this.prefix.push(this.prefix[this.prefix.length - 1] + weight);
    }
    this.total = this.prefix[this.prefix.length - 1];
  }

  pickIndex(): number {
    const r = Math.floor(Math.random() * this.total) + 1; // [1, total]
    let left = 0;
    let right = this.prefix.length - 2;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.prefix[mid + 1] >= r) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    return left;
  }
}

// 方法2：前缀和 + 线性查找（O(n)）
class Solution528Linear {
  private prefix: number[];
  private total: number;

  constructor(w: number[]) {
    this.prefix = [0];
    for (const weight of w) {
      this.prefix.push(this.prefix[this.prefix.length - 1] + weight);
    }
    this.total = this.prefix[this.prefix.length - 1];
  }

  pickIndex(): number {
    const r = Math.random() * this.total;
    for (let i = 0; i < this.prefix.length - 1; i++) {
      if (r < this.prefix[i + 1]) return i;
    }
    return this.prefix.length - 2;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 043. 按权重随机选择 =====");
const sol528 = new Solution528([1, 3]);
for (let i = 0; i < 5; i++) {
  console.log("pickIndex:", sol528.pickIndex());
}

export {};
