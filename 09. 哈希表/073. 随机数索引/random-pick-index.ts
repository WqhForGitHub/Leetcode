// ============================================================
// 073. 随机数索引
// ============================================================
// LeetCode 398. Random Pick Index
// 给定可能含重复元素的数组，随机返回目标值的某个索引
// 思路：哈希表存储每个值对应的所有索引列表，pick 时等概率随机取一个
// 时间复杂度：构造 O(n)，pick O(1)，空间复杂度：O(n)

class Solution {
  // 值 -> 索引列表
  private map: Map<number, number[]>;

  constructor(nums: number[]) {
    this.map = new Map();
    for (let i = 0; i < nums.length; i++) {
      if (!this.map.has(nums[i])) {
        this.map.set(nums[i], []);
      }
      this.map.get(nums[i])!.push(i);
    }
  }

  pick(target: number): number {
    const indices = this.map.get(target);
    if (!indices || indices.length === 0) return -1;
    const idx = Math.floor(Math.random() * indices.length);
    return indices[idx];
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 073. 随机数索引 =====");
const sol = new Solution([1, 2, 3, 3, 3]);
// pick(3) 应随机返回 2、3 或 4
console.log(sol.pick(3)); // 期望输出: 2 或 3 或 4
console.log(sol.pick(3)); // 期望输出: 2 或 3 或 4
// pick(1) 只有一个索引 0
console.log(sol.pick(1)); // 期望输出: 0
// pick(2) 只有一个索引 1
console.log(sol.pick(2)); // 期望输出: 1

export {};
