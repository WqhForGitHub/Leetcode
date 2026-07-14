// ============================================================
// 042. 最低加油次数
// ============================================================
// LeetCode 871. Minimum Number of Refueling Stops
// 汽车从起点到终点，沿途有加油站，求最少加油次数。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：最大堆（贪心）（推荐）
function minRefuelStops(target: number, startFuel: number, stations: number[][]): number {
  // 最大堆存沿途加油站油量
  const heap: number[] = [];
  const pushMax = (v: number): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] > heap[p]) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const popMax = (): number => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l] > heap[s]) s = l;
        if (r < heap.length && heap[r] > heap[s]) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  let fuel = startFuel;
  let stops = 0;
  let i = 0;
  const n = stations.length;
  while (fuel < target) {
    while (i < n && stations[i][0] <= fuel) {
      pushMax(stations[i][1]);
      i++;
    }
    if (heap.length === 0) return -1;
    fuel += popMax();
    stops++;
  }
  return stops;
}

// 方法2：动态规划
function minRefuelStopsDP(target: number, startFuel: number, stations: number[][]): number {
  const n = stations.length;
  const dp: number[] = new Array(n + 1).fill(0);
  dp[0] = startFuel;
  for (let i = 0; i < n; i++) {
    for (let t = i; t >= 0; t--) {
      if (dp[t] >= stations[i][0]) {
        dp[t + 1] = Math.max(dp[t + 1], dp[t] + stations[i][1]);
      }
    }
  }
  for (let i = 0; i <= n; i++) {
    if (dp[i] >= target) return i;
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 042. 最低加油次数 =====");
console.log("最大堆:", minRefuelStops(1, 1, [])); // 期望 0
console.log("最大堆:", minRefuelStops(100, 1, [[10, 100]])); // 期望 -1
console.log(
  "DP:",
  minRefuelStopsDP(100, 10, [
    [10, 60],
    [20, 30],
    [30, 30],
    [60, 40],
  ]),
); // 期望 2

export {};
