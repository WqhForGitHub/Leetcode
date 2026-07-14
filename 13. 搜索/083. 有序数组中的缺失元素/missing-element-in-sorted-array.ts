// ============================================================
// 083. 有序数组中的缺失元素
// ============================================================
// LeetCode 1060. Missing Element in Sorted Array
// 升序数组中从 nums[0] 开始的第 k 个缺失元素。

// 方法1：二分查找
function missingElement(nums: number[], k: number): number {
  const n = nums.length;
  // missing(idx) = nums[idx] - nums[0] - idx，表示 idx 之前缺失的个数
  // 找第一个 missing(idx) >= k 的位置
  let left = 0;
  let right = n - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const missing = nums[mid] - nums[0] - mid;
    if (missing < k) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  // 此时 left 是第一个 missing >= k 的位置
  // 但也可能 left-1 的 missing < k
  const missingLeft = nums[left - 1] - nums[0] - (left - 1);
  return nums[left - 1] + (k - missingLeft);
}

// 方法2：线性扫描
function missingElementLinear(nums: number[], k: number): number {
  for (let i = 1; i < nums.length; i++) {
    const diff = nums[i] - nums[i - 1] - 1;
    if (k <= diff) {
      return nums[i - 1] + k;
    }
    k -= diff;
  }
  return nums[nums.length - 1] + k;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 083. 有序数组中的缺失元素 =====");
console.log("二分 [4,7,9,10],1:", missingElement([4, 7, 9, 10], 1)); // 5
console.log("二分 [4,7,9,10],3:", missingElement([4, 7, 9, 10], 3)); // 8
console.log("二分 [1,2,4],3:", missingElement([1, 2, 4], 3)); // 6
console.log("线性 [4,7,9,10],1:", missingElementLinear([4, 7, 9, 10], 1)); // 5

export {};
