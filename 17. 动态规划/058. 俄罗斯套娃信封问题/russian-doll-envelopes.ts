// ============================================================
// 058. 俄罗斯套娃信封问题
// ============================================================
// LeetCode 354. Russian Doll Envelopes
// 给定一些信封的宽度和高度，一个信封能套入另一个当且仅当宽和高都严格大于。
// 求最多能嵌套多少个信封（俄罗斯套娃）。
// 时间复杂度 O(n log n)，空间复杂度 O(n)

// 方法1：排序 + 最长递增子序列（推荐）
// 先按宽度升序排序，宽度相同时按高度降序排序
// 然后对高度序列求最长递增子序列（LIS）
// 宽度相同时高度降序保证同宽信封不会互相嵌套
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function maxEnvelopes(envelopes: number[][]): number {
  if (envelopes.length === 0) return 0;

  // 排序：宽度升序，宽度相同则高度降序
  envelopes.sort((a: number[], b: number[]) => {
    if (a[0] === b[0]) return b[1] - a[1];
    return a[0] - b[0];
  });

  // 对高度序列求最长递增子序列（二分查找优化）
  // dp 数组维护一个递增序列，dp[i] 是长度为 i+1 的递增子序列的最小末尾元素
  const dp: number[] = [];

  for (let i: number = 0; i < envelopes.length; i++) {
    const h: number = envelopes[i][1];
    let left: number = 0;
    let right: number = dp.length;
    // 二分查找 h 在 dp 中的插入位置
    while (left < right) {
      const mid: number = Math.floor((left + right) / 2);
      if (dp[mid] < h) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    // 如果 h 比所有元素都大，扩展序列
    if (left === dp.length) {
      dp.push(h);
    } else {
      // 否则替换，保持递增序列最优
      dp[left] = h;
    }
  }

  return dp.length;
}

// 方法2：动态规划 O(n²)
// 排序后，dp[i] 表示以第 i 个信封为最外层的最大嵌套层数
// 状态转移：dp[i] = max(dp[j] + 1)，其中 j < i 且 envelopes[j] 能套入 envelopes[i]
// 时间复杂度 O(n²)，空间复杂度 O(n)
function maxEnvelopes2(envelopes: number[][]): number {
  if (envelopes.length === 0) return 0;

  // 按宽度升序排序
  envelopes.sort((a: number[], b: number[]) => a[0] - b[0]);

  const n: number = envelopes.length;
  const dp: number[] = new Array(n).fill(1);
  let result: number = 1;

  for (let i: number = 1; i < n; i++) {
    for (let j: number = 0; j < i; j++) {
      // 宽和高都严格小于才能嵌套
      if (envelopes[j][0] < envelopes[i][0] && envelopes[j][1] < envelopes[i][1]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    result = Math.max(result, dp[i]);
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 058. 俄罗斯套娃信封问题 =====");
console.log(
  maxEnvelopes([
    [5, 4],
    [6, 4],
    [6, 7],
    [2, 3],
  ]),
); // 期望结果: 3 ([2,3] -> [5,4] -> [6,7])
console.log(
  maxEnvelopes([
    [1, 1],
    [1, 1],
    [1, 1],
  ]),
); // 期望结果: 1
console.log(maxEnvelopes([])); // 期望结果: 0
console.log(
  maxEnvelopes2([
    [5, 4],
    [6, 4],
    [6, 7],
    [2, 3],
  ]),
); // 期望结果: 3

export {};
