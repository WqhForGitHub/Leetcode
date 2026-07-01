// ============================================================
// 028. 俄罗斯套娃信封问题
// ============================================================
// LeetCode 354. Russian Doll Envelopes
// 信封宽高二维，一个信封能套另一个当且仅当宽高都严格大于。
// 求最多能嵌套的信封个数。

// 方法1：排序 + 二分查找 LIS（O(n log n)）
function maxEnvelopes(envelopes: number[][]): number {
  // 宽升序，同宽时高降序
  envelopes.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return b[1] - a[1];
  });
  // 对高度做 LIS
  const tails: number[] = [];
  for (const env of envelopes) {
    const h = env[1];
    let left = 0;
    let right = tails.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < h) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    if (left === tails.length) tails.push(h);
    else tails[left] = h;
  }
  return tails.length;
}

// 方法2：动态规划（O(n²)）
function maxEnvelopesDP(envelopes: number[][]): number {
  envelopes.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const n = envelopes.length;
  const dp = new Array(n).fill(1);
  let maxLen = 1;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (
        envelopes[j][0] < envelopes[i][0] &&
        envelopes[j][1] < envelopes[i][1]
      ) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLen = Math.max(maxLen, dp[i]);
  }
  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 028. 俄罗斯套娃信封问题 =====");
console.log(
  "二分 [[5,4],[6,4],[6,7],[2,3]]:",
  maxEnvelopes([
    [5, 4],
    [6, 4],
    [6, 7],
    [2, 3],
  ])
); // 3
console.log(
  "DP [[5,4],[6,4],[6,7],[2,3]]:",
  maxEnvelopesDP([
    [5, 4],
    [6, 4],
    [6, 7],
    [2, 3],
  ])
); // 3

export {};
