// ============================================================
// 023. 丢失的数字
// ============================================================
// LeetCode 268. Missing Number
// 给定一个包含 [0, n] 中 n 个不同数字的数组 nums，
// 找出那个缺失的数字（长度为 n，范围共 n+1 个数）。

// 方法1：异或（推荐，O(n)，O(1)）
// 将数组所有元素与 0..n 异或，成对出现的会抵消，剩下的是缺失的数字。
function missingNumber(nums: number[]): number {
  let xor: number = 0;
  for (let i = 0; i < nums.length; i++) {
    xor ^= i ^ nums[i];
  }
  return xor ^ nums.length;
}

// 方法2：数学求和公式（O(n)，O(1)）
// 理论和为 n*(n+1)/2，减去实际和即为缺失数字。
function missingNumber2(nums: number[]): number {
  const n: number = nums.length;
  const expected: number = (n * (n + 1)) / 2;
  let actual: number = 0;
  for (const num of nums) actual += num;
  return expected - actual;
}

// 方法3：排序后扫描（O(n log n)，O(1)）
function missingNumber3(nums: number[]): number {
  const arr: number[] = [...nums].sort((a, b) => a - b);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== i) return i;
  }
  return arr.length;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 023. 丢失的数字 =====");
console.log("方法1:", missingNumber([3, 0, 1])); // 期望 2
console.log("方法1:", missingNumber([0, 1])); // 期望 2
console.log("方法1:", missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 期望 8
console.log("方法2:", missingNumber2([3, 0, 1])); // 期望 2
console.log("方法3:", missingNumber3([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 期望 8

export {};
