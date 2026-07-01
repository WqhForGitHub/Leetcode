// ============================================================
// 022. 较小的三数之和
// ============================================================
// LeetCode 259. 3Sum Smaller
// 给定长度为 n 的整数数组 nums 和一个目标值 target，
// 统计满足 i < j < k 且 nums[i] + nums[j] + nums[k] < target 的三元组个数。

// 方法1：排序 + 双指针（推荐，O(n^2)，O(1)）
// 排序后固定第一个数 i，用双指针在 [i+1, n-1] 区间内统计满足和 < target 的对数。
function threeSumSmaller(nums: number[], target: number): number {
  const arr: number[] = [...nums].sort((a, b) => a - b);
  let count: number = 0;
  const n: number = arr.length;
  for (let i = 0; i < n - 2; i++) {
    let lo: number = i + 1;
    let hi: number = n - 1;
    while (lo < hi) {
      const sum: number = arr[i] + arr[lo] + arr[hi];
      if (sum < target) {
        // lo 与 [lo+1, hi] 中任意一个数组合都满足 < target
        count += hi - lo;
        lo++;
      } else {
        hi--;
      }
    }
  }
  return count;
}

// 方法2：暴力三重循环（O(n^3)，O(1)）
function threeSumSmaller2(nums: number[], target: number): number {
  const n: number = nums.length;
  let count: number = 0;
  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      for (let k = j + 1; k < n; k++) {
        if (nums[i] + nums[j] + nums[k] < target) count++;
      }
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 022. 较小的三数之和 =====");
console.log("方法1:", threeSumSmaller([-2, 0, 1, 3], 2)); // 期望 2
console.log("方法1:", threeSumSmaller([], 0)); // 期望 0
console.log("方法1:", threeSumSmaller([0], 0)); // 期望 0
console.log("方法2:", threeSumSmaller2([-2, 0, 1, 3], 2)); // 期望 2
console.log("方法2:", threeSumSmaller2([3, 1, 0, -2], 4)); // 期望 3

export {};
