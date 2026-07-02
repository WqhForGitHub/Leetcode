// ============================================================
// 069. 最长数对链
// ============================================================
// LeetCode 646. Maximum Length of Pair Chain
// 给定 n 个数对 pairs，每个数对 [a, b] 满足 a < b。
// 数对链：当且仅当 pairs[i][1] < pairs[i+1][0] 时 pairs[i+1] 可接在 pairs[i] 之后。
// 可以任意重排数对顺序，求能组成的最长数对链长度。

// 方法1：贪心，按右端点排序后计数（推荐，O(n log n) 时间，O(1) 额外空间）
// 经典区间调度问题：按结束时间升序排序，每次选择开始时间 > 上一个结束时间的数对，
// 这样留给后续数对的空间最大，能选出最多不冲突的数对。
function findLongestChain(pairs: number[][]): number {
  // 按右端点升序排序
  pairs.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let lastEnd = -Infinity;
  for (const [start, end] of pairs) {
    if (start > lastEnd) {
      count++;
      lastEnd = end;
    }
  }
  return count;
}

// 方法2：按右端点排序 + 动态规划（O(n²) 时间，O(n) 空间）
// dp[i] 表示以 pairs[i] 结尾的最长链长度。
// dp[i] = 1 + max(dp[j])，其中 j 满足 pairs[j][1] < pairs[i][0]。
// 排序后可保证 j < i 时 pairs[j][1] <= pairs[i][1]，便于转移。
function findLongestChain_dp(pairs: number[][]): number {
  pairs.sort((a, b) => a[1] - b[1]);
  const n = pairs.length;
  const dp: number[] = new Array(n).fill(1);
  let best = 1;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (pairs[j][1] < pairs[i][0]) {
        if (dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
        }
      }
    }
    if (dp[i] > best) best = dp[i];
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 069. 最长数对链 =====");
console.log(
  "贪心 [[1,2],[2,3],[3,4]]:",
  findLongestChain([
    [1, 2],
    [2, 3],
    [3, 4],
  ]),
); // 期望 2
console.log(
  "贪心 [[1,2],[7,8],[4,5]]:",
  findLongestChain([
    [1, 2],
    [7, 8],
    [4, 5],
  ]),
); // 期望 3
console.log(
  "贪心 [[1,10],[2,3],[4,5],[6,7]]:",
  findLongestChain([
    [1, 10],
    [2, 3],
    [4, 5],
    [6, 7],
  ]),
); // 期望 3
console.log(
  "DP [[1,2],[2,3],[3,4]]:",
  findLongestChain_dp([
    [1, 2],
    [2, 3],
    [3, 4],
  ]),
); // 期望 2
console.log(
  "DP [[1,2],[7,8],[4,5]]:",
  findLongestChain_dp([
    [1, 2],
    [7, 8],
    [4, 5],
  ]),
); // 期望 3
console.log(
  "DP [[1,10],[2,3],[4,5],[6,7]]:",
  findLongestChain_dp([
    [1, 10],
    [2, 3],
    [4, 5],
    [6, 7],
  ]),
); // 期望 3

export {};
