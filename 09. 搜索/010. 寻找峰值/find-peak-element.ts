// ============================================================
// 010. 寻找峰值
// ============================================================
// LeetCode 162. Find Peak Element
// 峰值元素是指其值大于左右相邻值的元素。返回任意一个峰值索引。
// nums[-1] = nums[n] = -∞。时间复杂度 O(log n)。

// 方法1：二分查找（爬坡法）
function findPeakElement(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] > nums[mid + 1]) {
      // 峰值在左半部分（含 mid）
      right = mid;
    } else {
      // 峰值在右半部分
      left = mid + 1;
    }
  }
  return left;
}

// 方法2：线性扫描（O(n)）
function findPeakElementLinear(nums: number[]): number {
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] > nums[i + 1]) return i;
  }
  return nums.length - 1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 010. 寻找峰值 =====");
console.log("二分 [1,2,3,1]:", findPeakElement([1, 2, 3, 1])); // 2
console.log("二分 [1,2,1,3,5,6,4]:", findPeakElement([1, 2, 1, 3, 5, 6, 4])); // 1 或 5
console.log("线性 [1,2,3,1]:", findPeakElementLinear([1, 2, 3, 1])); // 2

export {};
