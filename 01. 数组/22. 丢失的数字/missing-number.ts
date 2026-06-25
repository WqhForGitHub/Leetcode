// ============================================================
// 22. 丢失的数字
// ============================================================
// LeetCode 268. Missing Number
// 给定包含 [0, n] 中 n 个数的数组 nums，找出 [0, n] 范围内缺失的那个数字。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：异或（推荐）
function missingNumberXor(nums: number[]): number {
  // 利用异或性质：a ^ a = 0，a ^ 0 = a
  // 将数组下标 [0, n-1] 和值一起异或，再异或 n，缺失的数字会留下
  let result = nums.length;
  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i];
  }
  return result;
}

// 方法2：数学求和公式
function missingNumberMath(nums: number[]): number {
  // 0~n 的和为 n*(n+1)/2，减去数组元素之和即为缺失数字
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  let actualSum = 0;
  for (const num of nums) {
    actualSum += num;
  }
  return expectedSum - actualSum;
}

// 方法3：排序
function missingNumberSort(nums: number[]): number {
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== i) {
      return i;
    }
  }
  return nums.length;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 22. 丢失的数字 =====");
console.log("描述:", missingNumberXor([3, 0, 1])); // 期望结果: 2
console.log("描述:", missingNumberXor([0, 1])); // 期望结果: 2
console.log("描述:", missingNumberXor([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 期望结果: 8
console.log("描述:", missingNumberMath([3, 0, 1])); // 期望结果: 2
console.log("描述:", missingNumberSort([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 期望结果: 8

export {};
