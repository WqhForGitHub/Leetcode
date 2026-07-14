// ============================================================
// 24. 区域和检索 - 数组不可变
// ============================================================
// LeetCode 303. Range Sum Query - Immutable
// 给定整数数组 nums，处理多次查询：求 left 到 right（含）的元素和。
// 时间复杂度：O(n) 预处理, O(1) 查询

// 方法1：前缀和（推荐）
class NumArray {
  private prefixSum: number[];

  constructor(nums: number[]) {
    // prefixSum[i] 表示 nums[0..i-1] 的和
    // prefixSum[0] = 0，方便处理 left=0 的情况
    this.prefixSum = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
      this.prefixSum[i + 1] = this.prefixSum[i] + nums[i];
    }
  }

  sumRange(left: number, right: number): number {
    // nums[left..right] = prefixSum[right+1] - prefixSum[left]
    return this.prefixSum[right + 1] - this.prefixSum[left];
  }
}

// 方法2：直接遍历
class NumArrayBruteForce {
  private nums: number[];

  constructor(nums: number[]) {
    this.nums = nums;
  }

  sumRange(left: number, right: number): number {
    let sum = 0;
    for (let i = left; i <= right; i++) {
      sum += this.nums[i];
    }
    return sum;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 24. 区域和检索 - 数组不可变 =====");
const numArray = new NumArray([-2, 0, 3, -5, 2, -1]);
console.log("描述:", numArray.sumRange(0, 2)); // 期望结果: 1
console.log("描述:", numArray.sumRange(2, 5)); // 期望结果: -1
console.log("描述:", numArray.sumRange(0, 5)); // 期望结果: -3

const numArrayBrute = new NumArrayBruteForce([-2, 0, 3, -5, 2, -1]);
console.log("描述:", numArrayBrute.sumRange(0, 2)); // 期望结果: 1

export {};
