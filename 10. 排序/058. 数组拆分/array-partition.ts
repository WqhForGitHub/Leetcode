// ============================================================
// 058. 数组拆分
// ============================================================
// LeetCode 561. Array Partition
// 给定 2n 个整数，将它们分成 n 对 (a1, b1), (a2, b2), ..., (an, bn)，
// 使得 sum(min(ai, bi)) 最大，返回该最大值。

// 方法1：排序 + 隔位求和（推荐，O(n log n) 时间，O(1) 额外空间）
// 排序后每对取较小值，最优策略是让相邻元素配对，避免浪费。
// 排序后取所有偶数下标元素求和即可。
function arrayPairSum(nums: number[]): number {
  nums.sort((a, b) => a - b);
  let sum = 0;
  for (let i = 0; i < nums.length; i += 2) {
    sum += nums[i];
  }
  return sum;
}

// 方法2：计数排序（O(n + 20001) 时间，O(20001) 空间）
// 题目中数值范围 [-10000, 10000]，可用计数排序线性求解。
// 维护是否"取走当前数对的最小值"标志，按值从小到大扫描。
function arrayPairSumCounting(nums: number[]): number {
  const OFFSET = 10000;
  const count = new Array<number>(20001).fill(0);
  for (const num of nums) {
    count[num + OFFSET]++;
  }

  let sum = 0;
  let takeAsMin = true; // true 表示当前数作为某对的较小值
  for (let v = 0; v <= 20000; v++) {
    while (count[v] > 0) {
      if (takeAsMin) {
        sum += v - OFFSET;
      }
      takeAsMin = !takeAsMin;
      count[v]--;
    }
  }
  return sum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 058. 数组拆分 =====");
console.log("排序法 [1,4,3,2]:", arrayPairSum([1, 4, 3, 2])); // 期望 4
console.log("排序法 [6,2,6,5,1,2]:", arrayPairSum([6, 2, 6, 5, 1, 2])); // 期望 9
console.log("计数法 [1,4,3,2]:", arrayPairSumCounting([1, 4, 3, 2])); // 期望 4
console.log("计数法 [6,2,6,5,1,2]:", arrayPairSumCounting([6, 2, 6, 5, 1, 2])); // 期望 9

export {};
