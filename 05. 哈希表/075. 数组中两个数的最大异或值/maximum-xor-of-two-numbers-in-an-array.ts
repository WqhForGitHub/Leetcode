// ============================================================
// 075. 数组中两个数的最大异或值
// ============================================================
// LeetCode 421. Maximum XOR of Two Numbers in an Array
// 找数组中两个数的最大异或值
// 思路：从高位到低位贪心，用哈希集合存储前缀，尝试让当前位为 1
//       即检查是否存在 a, b 使得 a ^ b = candidate（a ^ candidate 是否在集合中）
// 时间复杂度：O(n * log max)，空间复杂度：O(n)

function findMaximumXOR(nums: number[]): number {
  let maxResult = 0;
  let mask = 0;

  // 从最高位到最低位逐位确定
  for (let i = 31; i >= 0; i--) {
    // mask 用于截取前 i+1 位
    mask = mask | (1 << i);

    // 收集所有数的前缀
    const set = new Set<number>();
    for (const num of nums) {
      set.add(num & mask);
    }

    // 尝试让第 i 位为 1
    const candidate = maxResult | (1 << i);

    // 检查是否存在两个前缀异或后等于 candidate
    // 即 a ^ b = candidate => a = b ^ candidate
    for (const prefix of set) {
      if (set.has(prefix ^ candidate)) {
        maxResult = candidate;
        break;
      }
    }
  }

  return maxResult;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 075. 数组中两个数的最大异或值 =====");
console.log(findMaximumXOR([3, 10, 5, 25, 2, 8])); // 期望输出: 28 (5 ^ 25 = 28)
console.log(findMaximumXOR([0])); // 期望输出: 0
console.log(findMaximumXOR([2, 4])); // 期望输出: 6 (2 ^ 4 = 6)

export {};
