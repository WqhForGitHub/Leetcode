// ============================================================
// 119. K 次取反后最大化的数组和
// ============================================================
// LeetCode 1005. Maximize Sum Of Array After K Negations
// 给定数组和整数 k，每次操作可将任一元素取反，共操作 k 次，求最终数组和最大值。

// 方法1：按绝对值降序贪心（推荐，O(n log n) 时间，O(log n) 排序空间）
// 优先翻转绝对值大的负数（收益最高）；若翻转完负数后 k 还有剩余且为奇数，
// 则把绝对值最小者（排序后末尾）翻转一次。
function largestSumAfterKNegations(nums: number[], k: number): number {
  // 按绝对值降序排序
  nums.sort((a, b) => Math.abs(b) - Math.abs(a));
  for (let i = 0; i < nums.length && k > 0; i++) {
    if (nums[i] < 0) {
      nums[i] = -nums[i];
      k--;
    }
  }
  // 若 k 仍为奇数，翻转绝对值最小者（此时它在数组末尾）
  if (k % 2 === 1) {
    nums[nums.length - 1] = -nums[nums.length - 1];
  }
  return nums.reduce((sum, x) => sum + x, 0);
}

// 方法2：计数排序（O(n + 201) 时间，O(201) 空间）
// 元素范围 [-100,100]，用长度 201 的频次数组，避免比较排序。
// 值 v 映射到下标 v + 100；翻转 v 即把频次从下标 v+100 转移到 (100-v)+100 = 200-(v+100)。
function largestSumAfterKNegationsCount(nums: number[], k: number): number {
  const OFFSET = 100;
  const freq = new Array<number>(201).fill(0);
  for (const x of nums) freq[x + OFFSET]++;

  // 从最负（下标 0）开始翻转，把负数变正
  for (let i = 0; i < OFFSET && k > 0; i++) {
    while (freq[i] > 0 && k > 0) {
      freq[i]--;
      freq[200 - i]++;
      k--;
    }
  }

  // 求和并记录最小绝对值
  let sum = 0;
  let minAbs = Infinity;
  for (let i = 0; i <= 200; i++) {
    if (freq[i] > 0) {
      const val = i - OFFSET;
      sum += val * freq[i];
      const absVal = val < 0 ? -val : val;
      if (absVal < minAbs) minAbs = absVal;
    }
  }

  // 若 k 仍为奇数，需把绝对值最小者翻转一次（和减少 2 * minAbs）
  if (k % 2 === 1) {
    sum -= 2 * minAbs;
  }
  return sum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 119. K 次取反后最大化的数组和 =====");
console.log("方法1 [4,2,3], k=1:", largestSumAfterKNegations([4, 2, 3], 1)); // 期望 5
console.log("方法1 [3,-1,0,2], k=3:", largestSumAfterKNegations([3, -1, 0, 2], 3)); // 期望 6
console.log("方法1 [2,-3,-1,5,-4], k=2:", largestSumAfterKNegations([2, -3, -1, 5, -4], 2)); // 期望 13
console.log("方法1 [-2, -1], k=3:", largestSumAfterKNegations([-2, -1], 3)); // 期望 1
console.log("方法2 [4,2,3], k=1:", largestSumAfterKNegationsCount([4, 2, 3], 1)); // 期望 5
console.log("方法2 [3,-1,0,2], k=3:", largestSumAfterKNegationsCount([3, -1, 0, 2], 3)); // 期望 6
console.log("方法2 [2,-3,-1,5,-4], k=2:", largestSumAfterKNegationsCount([2, -3, -1, 5, -4], 2)); // 期望 13
console.log("方法2 [-2, -1], k=3:", largestSumAfterKNegationsCount([-2, -1], 3)); // 期望 1

export {};
