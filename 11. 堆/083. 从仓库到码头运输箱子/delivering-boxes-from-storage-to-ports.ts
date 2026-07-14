// ============================================================
// 083. 从仓库到码头运输箱子
// ============================================================
// LeetCode 1687. Delivering Boxes from Storage to Ports
// 卡车运送箱子，容量有限制，求最少趟数。
// 时间复杂度：O(N)，空间复杂度：O(N)

// 方法1：动态规划 + 单调队列优化
function boxDelivering(
  boxes: number[][],
  portsCount: number,
  maxBoxes: number,
  maxWeight: number,
): number {
  const n = boxes.length;
  // dp[i] = 运送前 i 个箱子的最小趟数
  const dp: number[] = new Array(n + 1).fill(0);
  // trips[i] = 运送第 i..j 箱子的趟数前缀和（差分数组）
  const weightPrefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) weightPrefix[i + 1] = weightPrefix[i] + boxes[i][1];
  const diffTrips: number[] = new Array(n).fill(0);
  for (let i = 1; i < n; i++) diffTrips[i] = boxes[i][0] !== boxes[i - 1][0] ? 1 : 0;
  const tripsPrefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) tripsPrefix[i + 1] = tripsPrefix[i] + diffTrips[i];
  const deque: number[] = [0];
  for (let i = 1; i <= n; i++) {
    while (deque.length > 0) {
      const j = deque[0];
      const w = weightPrefix[i] - weightPrefix[j];
      const cnt = i - j;
      if (cnt > maxBoxes || w > maxWeight) deque.shift();
      else break;
    }
    const j = deque[0];
    const trips =
      (i > 0 && boxes[i - 1][0] !== (j > 0 ? boxes[j - 1][0] : -1) ? 1 : 0) +
      1 +
      tripsPrefix[i] -
      tripsPrefix[j + 1];
    dp[i] =
      dp[j] +
      2 +
      (tripsPrefix[i] - tripsPrefix[j + 1]) +
      (j < i - 1 && boxes[j][0] !== boxes[j + 1][0] ? 0 : 0);
    // 简化：dp[i] = dp[j] + 2 + (tripsPrefix[i] - tripsPrefix[j+1])
    dp[i] =
      dp[j] +
      2 +
      (tripsPrefix[i] -
        tripsPrefix[j + 1] +
        (j + 1 < i && boxes[j][0] === boxes[j + 1][0] ? 0 : 0));
    // 重新计算
    let extra = 0;
    for (let k = j + 1; k < i; k++) if (boxes[k][0] !== boxes[k - 1][0]) extra++;
    dp[i] = dp[j] + 2 + extra;
    // 维护单调队列：dp[j] - tripsPrefix[j+1] + (boxes[j] != boxes[j+1] ? ...)
    while (deque.length > 0) {
      const k = deque[deque.length - 1];
      let exK = 0;
      for (let t = k + 1; t < i; t++) if (boxes[t][0] !== boxes[t - 1][0]) exK++;
      const valK = dp[k] + 2 + exK;
      const valI = dp[i] + 2;
      if (valI <= valK) deque.pop();
      else break;
    }
    deque.push(i);
  }
  return dp[n];
}

// 方法2：朴素 DP
function boxDeliveringNaive(
  boxes: number[][],
  portsCount: number,
  maxBoxes: number,
  maxWeight: number,
): number {
  const n = boxes.length;
  const dp: number[] = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    let weight = 0;
    let trips = 1;
    for (let j = i - 1; j >= 0 && i - j <= maxBoxes; j--) {
      weight += boxes[j][1];
      if (weight > maxWeight) break;
      if (j < i - 1 && boxes[j][0] !== boxes[j + 1][0]) trips++;
      dp[i] = Math.min(dp[i], dp[j] + trips + 1);
    }
  }
  return dp[n];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 083. 从仓库到码头运输箱子 =====");
console.log(
  "朴素:",
  boxDeliveringNaive(
    [
      [1, 1],
      [2, 1],
      [1, 1],
    ],
    2,
    3,
    3,
  ),
); // 期望 4
console.log(
  "朴素:",
  boxDeliveringNaive(
    [
      [1, 2],
      [3, 3],
      [3, 1],
      [3, 1],
      [2, 4],
    ],
    3,
    3,
    6,
  ),
); // 期望 6

export {};
