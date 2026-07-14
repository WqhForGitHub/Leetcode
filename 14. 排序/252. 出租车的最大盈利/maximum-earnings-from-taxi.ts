// ============================================================
// 252. 出租车的最大盈利
// ============================================================
// LeetCode 2008. Maximum Earnings From Taxi
// 有 n 个站点 (1..n)，rides[i] = [start, end, tip]。
// 每趟利润 = end - start + tip，一趟占用区间 [start, end)。
// 不能接重叠的趟。求最大总利润。

// 方法1：按 end 排序 + DP，dp[i] 表示考虑结束位置不超过 i 的最大利润 + 二分找上一趟
// 时间复杂度 O(m log m) 其中 m 为 rides 数量
function maxTaxiEarnings1(n: number, rides: number[][]): number {
  rides.sort((a, b) => a[1] - b[1]);
  // dp[i] 表示前 i 个 ride 的最大利润
  const m = rides.length;
  const dp: number[] = new Array(m + 1).fill(0);
  // 二分找最大的 j 使得 rides[j].end <= rides[i].start
  function binarySearch(i: number): number {
    let lo = 0;
    let hi = i - 1;
    let ans = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (rides[mid][1] <= rides[i][0]) {
        ans = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return ans;
  }
  for (let i = 0; i < m; i++) {
    const [s, e, tip] = rides[i];
    const profit = e - s + tip;
    const prev = binarySearch(i);
    const take = profit + (prev >= 0 ? dp[prev + 1] : 0);
    dp[i + 1] = Math.max(dp[i], take);
  }
  return dp[m];
}

// 方法2：按 end 排序 + DP，用按 end 索引的哈希表 + 二分
// 时间复杂度 O(m log m)
function maxTaxiEarnings2(n: number, rides: number[][]): number {
  rides.sort((a, b) => a[1] - b[1]);
  const m = rides.length;
  const dp: number[] = new Array(m).fill(0);
  function binarySearch(i: number): number {
    let lo = 0;
    let hi = i - 1;
    let ans = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (rides[mid][1] <= rides[i][0]) {
        ans = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return ans;
  }
  let best = 0;
  for (let i = 0; i < m; i++) {
    const [s, e, tip] = rides[i];
    const profit = e - s + tip;
    const prev = binarySearch(i);
    const take = profit + (prev >= 0 ? dp[prev] : 0);
    dp[i] = Math.max(i > 0 ? dp[i - 1] : 0, take);
    best = Math.max(best, dp[i]);
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 252. 出租车的最大盈利 =====");
console.log(
  "方法1 n=5,[[2,5,4],[1,5,1]]:",
  maxTaxiEarnings1(5, [
    [2, 5, 4],
    [1, 5, 1],
  ]),
);
console.log(
  "方法1 n=20,[[1,6,1],[3,10,2],[10,12,3],[11,12,2],[12,15,2],[13,18,1]]:",
  maxTaxiEarnings1(20, [
    [1, 6, 1],
    [3, 10, 2],
    [10, 12, 3],
    [11, 12, 2],
    [12, 15, 2],
    [13, 18, 1],
  ]),
);
console.log(
  "方法2 n=5,[[2,5,4],[1,5,1]]:",
  maxTaxiEarnings2(5, [
    [2, 5, 4],
    [1, 5, 1],
  ]),
);
console.log(
  "方法2 n=20,[[1,6,1],[3,10,2],[10,12,3],[11,12,2],[12,15,2],[13,18,1]]:",
  maxTaxiEarnings2(20, [
    [1, 6, 1],
    [3, 10, 2],
    [10, 12, 3],
    [11, 12, 2],
    [12, 15, 2],
    [13, 18, 1],
  ]),
);

export {};
