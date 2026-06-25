// ============================================================
// 56. 1 比特与 2 比特字符
// ============================================================
// LeetCode 717. 1-bit and 2-bit Characters
// 给定由 0 和 1 组成的数组 bits：一比特字符为 0，两比特字符为 10 或 11。
// 数组最后一位一定是 0。判断最后一个字符是否为一比特字符。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：贪心-从左到右扫描（推荐）
// 遇到 1 必定是两比特字符，跳两步；遇到 0 是一比特字符，跳一步。
// 扫描到末尾，若恰好落在最后一个下标，则最后一字符是一比特
function isOneBitCharacter(bits: number[]): boolean {
  let i = 0;
  const n = bits.length;
  while (i < n - 1) {
    i += bits[i] + 1; // 1 跳两步，0 跳一步
  }
  return i === n - 1;
}

// 方法2：从倒数第二位往前找最后一个非零连续段
// 最后一个 0 前面连续的 1 的个数若为偶数，则它们能两两配对，
// 最后一个 0 独立为一比特；若为奇数，则有一个 1 与最后的 0 配成两比特
function isOneBitCharacterReverse(bits: number[]): boolean {
  let i = bits.length - 2;
  let ones = 0;
  while (i >= 0 && bits[i] === 1) {
    ones++;
    i--;
  }
  return ones % 2 === 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 56. 1 比特与 2 比特字符 =====");
console.log("描述:", isOneBitCharacter([1, 0, 0])); // 期望结果: true
console.log("描述:", isOneBitCharacter([1, 1, 1, 0])); // 期望结果: false
console.log("描述:", isOneBitCharacterReverse([1, 0, 0])); // 期望结果: true
console.log("描述:", isOneBitCharacterReverse([1, 1, 1, 0])); // 期望结果: false

export {};
