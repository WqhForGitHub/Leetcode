// ============================================================
// 016. 丢失的数字
// ============================================================
// LeetCode 268. Missing Number
// 给定包含 [0, n] 中 n 个数的数组，找出那个缺失的数字。

// 方法1：数学求和公式（高斯求和）
function missingNumber(nums: number[]): number {
  const n = nums.length;
  const expected = (n * (n + 1)) / 2;
  const actual = nums.reduce((a, b) => a + b, 0);
  return expected - actual;
}

// 方法2：异或
function missingNumberXor(nums: number[]): number {
  let result = nums.length;
  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i];
  }
  return result;
}

// 方法3：排序后二分查找
function missingNumberBinary(nums: number[]): number {
  nums.sort((a, b) => a - b);
  let left = 0;
  let right = nums.length;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] > mid) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 016. 丢失的数字 =====");
console.log("数学 [3,0,1]:", missingNumber([3, 0, 1])); // 2
console.log("数学 [0,1]:", missingNumber([0, 1])); // 2
console.log("异或 [9,6,4,2,3,5,7,0,1]:", missingNumberXor([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 8
console.log("二分 [9,6,4,2,3,5,7,0,1]:", missingNumberBinary([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 8

export {};
