// ============================================================
// 161. 出租车的最大盈利
// ============================================================
// LeetCode 2008. Maximum Earnings From Taxi
// 出租车从 1 到 n，rides[i] = [start, end, tip]，求最大盈利。

// 方法1：动态规划 + 二分查找
function maxTaxiEarnings(n: number, rides: number[][]): number {
  // 按终点排序
  rides.sort((a, b) => a[1] - b[1]);
  // dp[i] = 到位置 i 为止的最大盈利
  const dp = new Array(n + 1).fill(0);
  let rideIdx = 0;
  for (let pos = 1; pos <= n; pos++) {
    dp[pos] = dp[pos - 1]; // 不载客
    // 载客：所有终点为 pos 的 ride
    while (rideIdx < rides.length && rides[rideIdx][1] === pos) {
      const [start, end, tip] = rides[rideIdx];
      const earning = end - start + tip;
      dp[pos] = Math.max(dp[pos], dp[start] + earning);
      rideIdx++;
    }
  }
  return dp[n];
}

// 方法2：排序 + 二分查找 + 动态规划
function maxTaxiEarningsBinary(n: number, rides: number[][]): number {
  rides.sort((a, b) => a[1] - b[1]);
  const m = rides.length;
  // dp[i] = 考虑前 i 个 ride 的最大盈利
  const dp = new Array(m + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    const [start, end, tip] = rides[i - 1];
    const earning = end - start + tip;
    // 不选当前 ride
    dp[i] = dp[i - 1];
    // 选当前 ride，找最后一个 end <= start 的 ride
    let lo = 0;
    let hi = i - 1;
    let last = 0;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (rides[mid][1] <= start) {
        last = mid + 1;
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    dp[i] = Math.max(dp[i], dp[last] + earning);
  }
  return dp[m];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 161. 出租车的最大盈利 =====");
console.log(
  "DP 5,[[2,5,4],[1,5,1]]:",
  maxTaxiEarnings(5, [
    [2, 5, 4],
    [1, 5, 1],
  ]),
); // 7
console.log(
  "DP 20,[[1,6,1],[3,10,2],[10,12,3],[11,12,2],[12,15,2],[13,18,1]]:",
  maxTaxiEarnings(20, [
    [1, 6, 1],
    [3, 10, 2],
    [10, 12, 3],
    [11, 12, 2],
    [12, 15, 2],
    [13, 18, 1],
  ]),
); // 20

export {};
