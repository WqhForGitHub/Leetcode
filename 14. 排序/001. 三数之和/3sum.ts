// ============================================================
// 001. 三数之和
// ============================================================
// LeetCode 15. 3Sum
// 给定数组 nums，找出所有和为 0 的不重复三元组 [nums[i], nums[j], nums[k]]。

// 方法1：排序 + 双指针（推荐，时间 O(n^2)，空间 O(log n) 排序栈）
function threeSum(nums: number[]): number[][] {
  const result: number[][] = [];
  const n = nums.length;
  if (n < 3) return result;

  nums.sort((a, b) => a - b);

  for (let i = 0; i < n - 2; i++) {
    // 跳过重复的固定元素
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    // 剪枝：最小值已大于 0
    if (nums[i] + nums[i + 1] + nums[i + 2] > 0) break;
    // 剪枝：当前值与最大两个值之和仍小于 0
    if (nums[i] + nums[n - 2] + nums[n - 1] < 0) continue;

    let left = i + 1;
    let right = n - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        // 跳过重复元素
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

// 方法2：哈希集合（时间 O(n^2)，空间 O(n)）
function threeSum2(nums: number[]): number[][] {
  const result: number[][] = [];
  const n = nums.length;
  if (n < 3) return result;

  nums.sort((a, b) => a - b);

  for (let i = 0; i < n - 2; i++) {
    // 跳过重复的固定元素
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    const seen = new Set<number>();
    for (let j = i + 1; j < n; j++) {
      const complement = -nums[i] - nums[j];
      if (seen.has(complement)) {
        result.push([nums[i], complement, nums[j]]);
        // 跳过重复的 j
        while (j + 1 < n && nums[j + 1] === nums[j]) j++;
      }
      seen.add(nums[j]);
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 001. 三数之和 =====");
console.log("方法1:", threeSum([-1, 0, 1, 2, -1, -4])); // 期望: [[-1,-1,2],[-1,0,1]]
console.log("方法1:", threeSum([0, 1, 1])); // 期望: []
console.log("方法1:", threeSum([0, 0, 0])); // 期望: [[0,0,0]]
console.log("方法2:", threeSum2([-1, 0, 1, 2, -1, -4])); // 期望: [[-1,-1,2],[-1,0,1]]
console.log("方法2:", threeSum2([0, 0, 0])); // 期望: [[0,0,0]]

export {};
