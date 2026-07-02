// ============================================================
// 142. 矩阵中 1 的最大数量
// ============================================================
// LeetCode 1183. Maximum Number of Ones
// 在 W x H 的二进制矩阵中放置 1，要求任意 sideLength x sideLength 子矩阵中 1
// 的数量不超过 maxOnes。返回矩阵中 1 的最大总数。
//
// 关键洞察：任一 sideLength x sideLength 窗口对 sideLength 取模后，恰好覆盖
// sideLength x sideLength “基本块”中的每个位置各一次。因此“每个窗口至多 maxOnes
// 个 1”等价于“在基本块中至多选取 maxOnes 个位置填 1”。每个基本块位置 (i, j)
// 对应矩阵中所有满足 r % sideLength == i 且 c % sideLength == j 的实际单元格，
// 其数量 = rowCount(i) * colCount(j)。为使总数最大，贪心选取权值最大的 maxOnes 个位置。

// 方法1：枚举基本块每个位置的权值并排序贪心（时间 O(sideLength² log(sideLength²))）
function maximumNumberOfOnes(
  width: number,
  height: number,
  sideLength: number,
  maxOnes: number,
): number {
  // 计算行方向上模 k 等于 i 的行数
  const rowCount = (i: number): number => {
    // 行 r 满足 r % sideLength == i 且 0 <= r < height
    if (i >= height) return 0;
    return Math.floor((height - 1 - i) / sideLength) + 1;
  };
  const colCount = (j: number): number => {
    if (j >= width) return 0;
    return Math.floor((width - 1 - j) / sideLength) + 1;
  };

  const weights: number[] = [];
  for (let i = 0; i < sideLength; i++) {
    for (let j = 0; j < sideLength; j++) {
      weights.push(rowCount(i) * colCount(j));
    }
  }
  weights.sort((a, b) => b - a);

  let ans = 0;
  const take = Math.min(maxOnes, weights.length);
  for (let k = 0; k < take; k++) {
    ans += weights[k];
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 142. 矩阵中 1 的最大数量 =====");
console.log("方法1:", maximumNumberOfOnes(3, 3, 2, 1)); // 期望: 4
console.log("方法1:", maximumNumberOfOnes(3, 3, 2, 2)); // 期望: 6
console.log("方法1:", maximumNumberOfOnes(4, 4, 2, 2)); // 期望: 8
console.log("方法1:", maximumNumberOfOnes(1, 1, 1, 1)); // 期望: 1

export {};
