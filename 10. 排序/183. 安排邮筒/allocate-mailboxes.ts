// ============================================================
// 183. 安排邮筒
// ============================================================
// LeetCode 1478. Allocate Mailboxes
// 给定房屋坐标数组 houses 和邮筒数 k，将邮筒放置在合适位置，
// 使所有房屋到最近邮筒的距离之和最小，返回最小总距离。

// 方法1：DP + 前缀和优化求区间代价（O(k * n^2)）
// 排序后，cost(i,j) 表示区间 [i,j] 用一个邮筒（放中位数）的距离和，
// 用前缀和 O(1) 计算。dp[kk][i] 表示前 i 个房屋用 kk 个邮筒的最小代价。
function minDistance(houses: number[], k: number): number {
  houses.sort((a, b) => a - b);
  const n = houses.length;
  if (k >= n) return 0;
  // 前缀和
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + houses[i];
  // 区间 [i,j] 一个邮筒放在中位数处
  const cost = (i: number, j: number): number => {
    const m = Math.floor((i + j) / 2);
    const median = houses[m];
    const leftCount = m - i + 1;
    const rightCount = j - m;
    const leftSum = prefix[m + 1] - prefix[i];
    const rightSum = prefix[j + 1] - prefix[m + 1];
    return median * leftCount - leftSum + rightSum - median * rightCount;
  };
  const INF = Infinity;
  const dp: number[][] = Array.from({ length: k + 1 }, () => new Array(n + 1).fill(INF));
  for (let kk = 0; kk <= k; kk++) dp[kk][0] = 0;
  for (let kk = 1; kk <= k; kk++) {
    for (let i = 1; i <= n; i++) {
      // 第 kk 个邮筒负责区间 [j+1, i]
      for (let j = 0; j < i; j++) {
        if (dp[kk - 1][j] === INF) continue;
        const c = dp[kk - 1][j] + cost(j, i - 1);
        if (c < dp[kk][i]) dp[kk][i] = c;
      }
    }
  }
  return dp[k][n];
}

// 方法2：DP + 预计算代价矩阵（O(k * n^2 + n^2)）
// 先把所有 cost[i][j] 预计算成二维表，再做相同的 DP。
function minDistance2(houses: number[], k: number): number {
  houses.sort((a, b) => a - b);
  const n = houses.length;
  if (k >= n) return 0;
  // 预计算 cost[i][j]：区间 [i,j] 用一个邮筒的最小总距离
  const cost: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const m = Math.floor((i + j) / 2);
      const median = houses[m];
      let c = 0;
      for (let t = i; t <= j; t++) c += Math.abs(houses[t] - median);
      cost[i][j] = c;
    }
  }
  const INF = Infinity;
  const dp: number[][] = Array.from({ length: k + 1 }, () => new Array(n + 1).fill(INF));
  for (let kk = 0; kk <= k; kk++) dp[kk][0] = 0;
  for (let kk = 1; kk <= k; kk++) {
    for (let i = 1; i <= n; i++) {
      for (let j = 0; j < i; j++) {
        if (dp[kk - 1][j] === INF) continue;
        const c = dp[kk - 1][j] + cost[j][i - 1];
        if (c < dp[kk][i]) dp[kk][i] = c;
      }
    }
  }
  return dp[k][n];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 183. 安排邮筒 =====");
console.log("方法1 houses=[1,4,8,10,20] k=3:", minDistance([1, 4, 8, 10, 20], 3)); // 5
console.log("方法1 houses=[2,3,5,12,18] k=2:", minDistance([2, 3, 5, 12, 18], 2)); // 9
console.log("方法1 houses=[7,4,6,1] k=1:", minDistance([7, 4, 6, 1], 1)); // 8
console.log("方法1 houses=[1,8,12,10,3] k=3:", minDistance([1, 8, 12, 10, 3], 3)); // 4
console.log("方法2 houses=[1,4,8,10,20] k=3:", minDistance2([1, 4, 8, 10, 20], 3)); // 5
console.log("方法2 houses=[2,3,5,12,18] k=2:", minDistance2([2, 3, 5, 12, 18], 2)); // 9
console.log("方法2 houses=[7,4,6,1] k=1:", minDistance2([7, 4, 6, 1], 1)); // 8
console.log("方法2 houses=[1,8,12,10,3] k=3:", minDistance2([1, 8, 12, 10, 3], 3)); // 4

export {};
