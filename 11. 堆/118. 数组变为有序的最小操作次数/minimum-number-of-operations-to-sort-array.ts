// ============================================================
// 118. 数组变为有序的最小操作次数
// ============================================================
// LeetCode 2366. Minimum Replacements to Sort the Array
// 每次操作可将一个元素拆成两个和等于原值的元素，求使数组非递减的最少操作次数。
// 时间复杂度：O(N)，空间复杂度：O(1)

// 方法1：贪心（从后往前）
function minimumReplacement(nums: number[]): number {
  const n = nums.length;
  let result = 0;
  let prev = nums[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    if (nums[i] <= prev) {
      prev = nums[i];
    } else {
      // 需要拆分 nums[i] 为若干份使最大 <= prev
      const k = Math.ceil(nums[i] / prev);
      result += k - 1;
      prev = Math.floor(nums[i] / k);
    }
  }
  return result;
}

// 方法2：用堆（不推荐，仅展示）
function minimumReplacementHeap(nums: number[]): number {
  // 此问题更适合贪心，堆方法不适用
  return minimumReplacement(nums);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 118. 数组变为有序的最小操作次数 =====");
console.log("操作数:", minimumReplacement([3, 9, 3])); // 期望 2
console.log("操作数:", minimumReplacement([1, 2, 3, 4, 5])); // 期望 0

export {};
