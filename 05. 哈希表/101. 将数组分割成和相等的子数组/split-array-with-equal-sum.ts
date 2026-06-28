// ============================================================
// 101. 将数组分割成和相等的子数组
// ============================================================
// LeetCode 548. Split Array with Equal Sum
// 给定一个有 n 个整数的数组，判断能否将其分成三个非空、不相交的子数组，
// 且三个子数组的和相等。要求去掉首尾元素，中间子数组之间至少隔一个元素。
// 时间复杂度：O(n^2)，空间复杂度：O(n)

// 思路：前缀和 + 哈希表
// 1. 枚举中间分割点 j，用哈希表记录左侧所有可能的等分点 i
// 2. 对每个 j，再枚举右侧分割点 k，判断右侧和是否存在于左侧哈希表中
function splitArray(nums: number[]): boolean {
  const n = nums.length;
  if (n < 7) return false;

  // 前缀和：prefix[i] = nums[0] + ... + nums[i-1]
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  // 枚举中间切分点 j：[i+1, j-1] 为第二段，需要 j - i >= 2
  // 第一段 [0, i-1]，第三段 [k+1, n-1]
  for (let j = 3; j < n - 3; j++) {
    const seen = new Set<number>();
    // 枚举左侧切分点 i：第一段 [0, i-1]，第二段 [i+1, j-1]
    for (let i = 1; i < j - 1; i++) {
      const leftSum = prefix[i] - prefix[0];
      const midSum = prefix[j] - prefix[i + 1];
      if (leftSum === midSum) {
        seen.add(leftSum);
      }
    }
    // 枚举右侧切分点 k：第三段 [k+1, n-1]
    for (let k = j + 2; k < n - 1; k++) {
      const midSum = prefix[k] - prefix[j + 1];
      const rightSum = prefix[n] - prefix[k + 1];
      if (midSum === rightSum && seen.has(rightSum)) {
        return true;
      }
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 101. 将数组分割成和相等的子数组 =====");
// 测试 1: [1,2,1,2,1,2,1] 可分成 [1,2,1] [2,1,2] [1] ? 实际上 1+2+1=4, 2+1+2=5 不等
console.log(splitArray([1, 2, 1, 2, 1, 2, 1])); // 期望: false
// 测试 2: [1,2,1,3,0,0,2,2,1,3,0,0] 可分成等和三段
console.log(splitArray([1, 2, 1, 3, 0, 0, 2, 2, 1, 3, 0, 0])); // 期望: true
// 测试 3: 数组长度不足
console.log(splitArray([1, 2, 3, 4])); // 期望: false

export {};
