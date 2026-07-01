// ============================================================
// 034. 俄罗斯套娃信封问题
// ============================================================
// LeetCode 354. Russian Doll Envelopes
// 给定一组信封 (w, h)，当一个信封的宽和高都严格大于另一个时可套入，
// 求最多能嵌套的信封数量。

// 方法1：按宽度升序、高度降序排序 + 二分求 LIS（推荐，O(n log n)）
// 宽度升序保证宽度递增可嵌套；同宽度时高度降序，使 LIS 中不会选到同宽度的两个信封。
// 随后对高度数组求最长严格递增子序列（patience sorting）。
function maxEnvelopes(envelopes: number[][]): number {
  if (envelopes.length === 0) return 0;
  envelopes.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0]; // 宽度升序
    return b[1] - a[1]; // 同宽度高度降序
  });
  const heights = envelopes.map((e) => e[1]);
  // tails[i] = 长度为 i+1 的严格递增子序列的最小末尾
  const tails: number[] = [];
  for (const h of heights) {
    // 二分查找第一个 >= h 的位置（严格递增，找 lower_bound）
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < h) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    if (lo === tails.length) {
      tails.push(h);
    } else {
      tails[lo] = h;
    }
  }
  return tails.length;
}

// 方法2：排序 + DP 求 LIS（O(n²)）
// 排序后 dp[i] = 以第 i 个信封结尾的最长嵌套链长度。
function maxEnvelopesDP(envelopes: number[][]): number {
  if (envelopes.length === 0) return 0;
  envelopes.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });
  const n = envelopes.length;
  const dp: number[] = new Array(n).fill(1);
  let best = 1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      // 严格大于才可套入
      if (envelopes[j][0] < envelopes[i][0] && envelopes[j][1] < envelopes[i][1]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 034. 俄罗斯套娃信封问题 =====");

console.log(
  "二分LIS [[5,4],[6,4],[6,7],[2,3]]:",
  maxEnvelopes([
    [5, 4],
    [6, 4],
    [6, 7],
    [2, 3],
  ]),
); // 期望 3 -> [2,3] -> [5,4] -> [6,7]
console.log(
  "二分LIS [[1,1],[1,1],[1,1]]:",
  maxEnvelopes([
    [1, 1],
    [1, 1],
    [1, 1],
  ]),
); // 期望 1
console.log(
  "DP     [[5,4],[6,4],[6,7],[2,3]]:",
  maxEnvelopesDP([
    [5, 4],
    [6, 4],
    [6, 7],
    [2, 3],
  ]),
); // 期望 3
console.log(
  "DP     [[1,1],[1,1],[1,1]]:",
  maxEnvelopesDP([
    [1, 1],
    [1, 1],
    [1, 1],
  ]),
); // 期望 1

export {};
