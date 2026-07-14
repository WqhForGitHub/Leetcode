// ============================================================
// 044. 丢失的数字
// ============================================================
// LeetCode 268. Missing Number
// 给定包含 [0, n] 中 n 个数字的数组，找出那个缺失的数字。
// 时间复杂度：O(n)，空间复杂度：O(n)

function missingNumber(nums: number[]): number {
  // 哈希集合：先把所有数存入集合，再依次检查 0..n
  const set = new Set<number>();
  for (const num of nums) {
    set.add(num);
  }
  const n = nums.length;
  for (let i = 0; i <= n; i++) {
    if (!set.has(i)) return i;
  }
  return -1; // 理论上不会到达
}

// ============================================================
// 测试
// ============================================================
console.log("===== 044. 丢失的数字 =====");
console.log(missingNumber([3, 0, 1])); // 2
console.log(missingNumber([0, 1])); // 2
console.log(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 8
console.log(missingNumber([0])); // 1

export {};
