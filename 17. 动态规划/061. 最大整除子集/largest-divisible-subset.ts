// ============================================================
// 061. 最大整除子集
// ============================================================
// LeetCode 368. Largest Divisible Subset
// 给定无重复正整数集合，返回最大子集，其中每对元素互为整除。
// 时间复杂度 O(n^2)，空间复杂度 O(n^2)

// 方法1：动态规划（推荐）
// 排序后，dp[i] = 以 nums[i] 结尾的最大整除子集大小
// 状态转移：if nums[i] % nums[j] == 0, dp[i] = max(dp[i], dp[j] + 1)
// 同时用 prev 数组记录前驱节点以 reconstruct 结果
// 时间复杂度 O(n^2)，空间复杂度 O(n^2)
function largestDivisibleSubset(nums: number[]): number[] {
  const n: number = nums.length;
  if (n === 0) return [];

  // 排序，保证后面的元素能被前面的整除时，前面所有能整除的都满足两两整除
  nums.sort((a: number, b: number) => a - b);

  // dp[i] 表示以 nums[i] 结尾的最大整除子集大小
  const dp: number[] = new Array(n).fill(1);
  // prev[i] 记录 dp[i] 的前驱索引，用于回溯构造结果
  const prev: number[] = new Array(n).fill(-1);

  let maxSize: number = 1;
  let maxIndex: number = 0;

  for (let i: number = 1; i < n; i++) {
    for (let j: number = 0; j < i; j++) {
      // 如果 nums[i] 能被 nums[j] 整除，可以接在 j 后面
      if (nums[i] % nums[j] === 0 && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        prev[i] = j;
      }
    }
    // 更新全局最大值
    if (dp[i] > maxSize) {
      maxSize = dp[i];
      maxIndex = i;
    }
  }

  // 回溯构造结果
  const result: number[] = [];
  let idx: number = maxIndex;
  while (idx !== -1) {
    result.push(nums[idx]);
    idx = prev[idx];
  }
  result.reverse();
  return result;
}

// 方法2：动态规划（使用数组存储子集）
// 类似方法1，但直接存储子集而非前驱索引
// 时间复杂度 O(n^2)，空间复杂度 O(n^2)
function largestDivisibleSubset2(nums: number[]): number[] {
  const n: number = nums.length;
  if (n === 0) return [];

  nums.sort((a: number, b: number) => a - b);

  // subsets[i] 存储以 nums[i] 结尾的最大整除子集
  const subsets: number[][] = new Array(n);

  for (let i: number = 0; i < n; i++) {
    subsets[i] = [nums[i]];
    for (let j: number = 0; j < i; j++) {
      if (nums[i] % nums[j] === 0 && subsets[j].length + 1 > subsets[i].length) {
        subsets[i] = [...subsets[j], nums[i]];
      }
    }
  }

  // 找最长的子集
  let result: number[] = [];
  for (let i: number = 0; i < n; i++) {
    if (subsets[i].length > result.length) {
      result = subsets[i];
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 061. 最大整除子集 =====");
console.log(largestDivisibleSubset([1, 2, 3])); // 期望结果: [1, 2] 或 [1, 3]
console.log(largestDivisibleSubset([1, 2, 4, 8])); // 期望结果: [1, 2, 4, 8]
console.log(largestDivisibleSubset([1, 2, 3, 4, 6, 12])); // 期望结果: [1, 2, 4, 12] 或 [1, 2, 6, 12]
console.log(largestDivisibleSubset([5, 9, 18, 54, 108, 540, 90, 180, 360, 720])); // 期望结果: [5, 90, 180, 360, 720]

export {};
