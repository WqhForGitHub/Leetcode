// ============================================================
// 154. 两天自由外汇交易后的最大货币数
// ============================================================
// 自定义题：货币汇率图（两天不同汇率），从初始货币两天交易后返回，
// 求最大数量。利用汇率乘积找正环套利。
// 思路：Floyd 求多源最大乘积 / Bellman-Ford 找正环。
// 时间复杂度：O(n^3) Floyd，空间复杂度：O(n^2)。

interface Rate {
  from: number;
  to: number;
  rate: number;
}

// 方法1：Floyd 最大乘积
// dist[i][j] 表示一天内由 i 到 j 最大可获得的货币倍数，取 max(dist, *) 传递。
function maxCurrencyAfterTwoDaysFloyd(
  n: number,
  day1Rates: Rate[],
  day2Rates: Rate[],
  start: number,
): number {
  const build = (rates: Rate[]): number[][] => {
    const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) dist[i][i] = 1;
    for (const r of rates) {
      dist[r.from][r.to] = Math.max(dist[r.from][r.to], r.rate);
    }
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] * dist[k][j] > dist[i][j]) {
            dist[i][j] = dist[i][k] * dist[k][j];
          }
        }
      }
    }
    return dist;
  };
  const d1 = build(day1Rates);
  const d2 = build(day2Rates);
  // 两天交易后返回 start 的最大倍数
  let best = 1;
  for (let mid = 0; mid < n; mid++) {
    if (d1[start][mid] > 0 && d2[mid][start] > 0) {
      best = Math.max(best, d1[start][mid] * d2[mid][start]);
    }
  }
  return best;
}

// 方法2：Bellman-Ford 找正环套利（单日）
// 对每天用松弛法求从 start 出发的最大乘积，两天组合后取最大。
function maxCurrencyAfterTwoDaysBellman(
  n: number,
  day1Rates: Rate[],
  day2Rates: Rate[],
  start: number,
): number {
  const bestPath = (rates: Rate[]): number[] => {
    const dist: number[] = new Array(n).fill(0);
    dist[start] = 1;
    // 松弛 n 轮以传播最优值
    for (let iter = 0; iter < n; iter++) {
      for (const r of rates) {
        if (dist[r.from] > 0 && dist[r.from] * r.rate > dist[r.to]) {
          dist[r.to] = dist[r.from] * r.rate;
        }
      }
    }
    return dist;
  };
  const d1 = bestPath(day1Rates);
  // 第二天：对每个中间货币 m，再求 m 出发的最大乘积回到 start
  const reverse: Rate[] = day2Rates; // 直接以各中间为起点
  let best = 1;
  for (let mid = 0; mid < n; mid++) {
    if (d1[mid] <= 0) continue;
    const dist: number[] = new Array(n).fill(0);
    dist[mid] = 1;
    for (let iter = 0; iter < n; iter++) {
      for (const r of reverse) {
        if (dist[r.from] > 0 && dist[r.from] * r.rate > dist[r.to]) {
          dist[r.to] = dist[r.from] * r.rate;
        }
      }
    }
    if (dist[start] > 0) best = Math.max(best, d1[mid] * dist[start]);
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 154. 两天自由外汇交易后的最大货币数 =====");
console.log(
  "Floyd:",
  maxCurrencyAfterTwoDaysFloyd(
    2,
    [{ from: 0, to: 1, rate: 2 }],
    [{ from: 1, to: 0, rate: 0.6 }],
    0,
  ), // 期望 1.2
);
console.log(
  "Bellman:",
  maxCurrencyAfterTwoDaysBellman(
    2,
    [{ from: 0, to: 1, rate: 2 }],
    [{ from: 1, to: 0, rate: 0.6 }],
    0,
  ), // 期望 1.2
);
console.log(
  "Floyd:",
  maxCurrencyAfterTwoDaysFloyd(
    3,
    [
      { from: 0, to: 1, rate: 3 },
      { from: 1, to: 2, rate: 2 },
    ],
    [{ from: 2, to: 0, rate: 0.2 }],
    0,
  ), // 期望 3*2*0.2=1.2
);
console.log(
  "Bellman:",
  maxCurrencyAfterTwoDaysBellman(
    3,
    [
      { from: 0, to: 1, rate: 3 },
      { from: 1, to: 2, rate: 2 },
    ],
    [{ from: 2, to: 0, rate: 0.2 }],
    0,
  ), // 期望 1.2
);
console.log(
  "Floyd:",
  maxCurrencyAfterTwoDaysFloyd(2, [], [], 0), // 期望 1
);
console.log(
  "Bellman:",
  maxCurrencyAfterTwoDaysBellman(2, [], [], 0), // 期望 1
);

export {};
