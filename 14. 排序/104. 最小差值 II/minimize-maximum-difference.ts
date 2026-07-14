// ============================================================
// 104. 最小差值 II
// ============================================================
// LeetCode 910. Smallest Range II
// 对数组每个元素选择 +K 或 -K，使修改后数组的最大值与最小值之差最小，返回该最小差值。

// 方法1：排序 + 枚举分界点（推荐，时间 O(n log n)，空间 O(log n) 排序栈）
// 排序后，最优策略形如：前半段 +K、后半段 -K（小的抬高、大的压低以压缩极差）。
// 基线答案：全部同向加减 K，极差 = A[n-1] - A[0]。
// 枚举分界点 i（A[0..i] +K，A[i+1..n-1] -K）：
//   最大值 = max(A[i] + K, A[n-1] - K)
//   最小值 = min(A[0] + K, A[i+1] - K)
//   极差   = 最大值 - 最小值
// 取所有分界点的最小值。
function smallestRangeII(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  // 基线：全部 +K 或全部 -K，极差不变
  let result = nums[n - 1] - nums[0];

  for (let i = 0; i < n - 1; i++) {
    const high = Math.max(nums[i] + k, nums[n - 1] - k);
    const low = Math.min(nums[0] + k, nums[i + 1] - k);
    result = Math.min(result, high - low);
  }

  return result;
}

// 方法2：排序 + 早期剪枝（时间 O(n log n)，空间 O(log n)）
// 在方法1基础上：当 low 已 >= 当前最优时提前跳出，处理常量优化。
function smallestRangeIIPrune(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let result = nums[n - 1] - nums[0];

  for (let i = 0; i < n - 1; i++) {
    const high = Math.max(nums[i] + k, nums[n - 1] - k);
    const low = Math.min(nums[0] + k, nums[i + 1] - k);
    const diff = high - low;
    if (diff < result) {
      result = diff;
    }
    // 若 low 已经非负且持续增大，后续极差难以更优（剪枝启发）
    if (low >= 0 && low >= nums[n - 1] - k) break;
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 104. 最小差值 II =====");
console.log("方法1:", smallestRangeII([1], 0)); // 期望: 0
console.log("方法1:", smallestRangeII([0, 10], 2)); // 期望: 6
console.log("方法1:", smallestRangeII([1, 3, 6], 3)); // 期望: 3
console.log("方法2:", smallestRangeIIPrune([0, 10], 2)); // 期望: 6
console.log("方法2:", smallestRangeIIPrune([1, 3, 6], 3)); // 期望: 3

export {};
