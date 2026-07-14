// ============================================================
// 059. 校园自行车分配 II
// ============================================================
// LeetCode 1063. Campus Bikes II
// 给定 workers 和 bikes 的二维坐标，将每辆自行车分配给至多一个工人，
// 最小化所有分配的曼哈顿距离之和。每个工人恰好一辆自行车。
// 时间复杂度：O(N * 2^M) DP, 空间复杂度：O(2^M)；回溯为 O(N!)

// 方法1：回溯 (排列枚举)
// 为每个工人选择一辆未使用的自行车，更新最小总距离
// 时间复杂度 O(N!) (N=M 时), 空间复杂度 O(N)
function assignBikes(workers: number[][], bikes: number[][]): number {
  const n = workers.length;
  const m = bikes.length;
  const used: boolean[] = new Array(m).fill(false);
  let best = Infinity;

  const dist = (i: number, j: number): number =>
    Math.abs(workers[i][0] - bikes[j][0]) + Math.abs(workers[i][1] - bikes[j][1]);

  const backtrack = (worker: number, cur: number): void => {
    if (worker === n) {
      if (cur < best) best = cur;
      return;
    }
    // 剪枝：当前累计距离已超过最优，跳过
    if (cur >= best) return;
    for (let j = 0; j < m; j++) {
      if (used[j]) continue;
      used[j] = true;
      backtrack(worker + 1, cur + dist(worker, j));
      used[j] = false;
    }
  };

  backtrack(0, 0);
  return best;
}

// 方法2：状态压缩 DP
// dp[mask] 表示使用了 mask 表示的自行车集合时的最小距离
// 时间复杂度 O(N * 2^M), 空间复杂度 O(2^M)
function assignBikes2(workers: number[][], bikes: number[][]): number {
  const n = workers.length;
  const m = bikes.length;
  const dist = (i: number, j: number): number =>
    Math.abs(workers[i][0] - bikes[j][0]) + Math.abs(workers[i][1] - bikes[j][1]);

  const total = 1 << m;
  const dp: number[] = new Array(total).fill(Infinity);
  dp[0] = 0;

  for (let mask = 0; mask < total; mask++) {
    // mask 中已使用的自行车数即下一个要分配的工人索引
    const worker = countBits(mask);
    if (worker >= n) continue;
    for (let j = 0; j < m; j++) {
      if ((mask >> j) & 1) continue;
      const next = mask | (1 << j);
      const candidate = dp[mask] + dist(worker, j);
      if (candidate < dp[next]) dp[next] = candidate;
    }
  }

  // 取恰好使用 n 辆自行车的状态中的最小值
  let ans = Infinity;
  for (let mask = 0; mask < total; mask++) {
    if (countBits(mask) === n && dp[mask] < ans) ans = dp[mask];
  }
  return ans;
}

function countBits(x: number): number {
  let c = 0;
  while (x) {
    c += x & 1;
    x >>= 1;
  }
  return c;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 059. 校园自行车分配 II =====");
console.log(
  assignBikes(
    [
      [0, 0],
      [2, 2],
    ],
    [
      [1, 1],
      [3, 3],
    ],
  ),
); // 期望结果: 6
console.log(
  assignBikes2(
    [
      [0, 0],
      [2, 2],
    ],
    [
      [1, 1],
      [3, 3],
    ],
  ),
); // 期望结果: 6
console.log(
  assignBikes(
    [
      [0, 0],
      [1, 1],
      [2, 0],
    ],
    [
      [1, 0],
      [2, 2],
      [2, 1],
    ],
  ),
); // 期望结果: 4
console.log(
  assignBikes2(
    [
      [0, 0],
      [1, 1],
      [2, 0],
    ],
    [
      [1, 0],
      [2, 2],
      [2, 1],
    ],
  ),
); // 期望结果: 4

export {};
