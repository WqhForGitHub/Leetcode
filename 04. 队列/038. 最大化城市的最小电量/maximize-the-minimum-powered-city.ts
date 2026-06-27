// ============================================================
// 038. 最大化城市的最小电量
// ============================================================
// LeetCode 2528. Maximize the Minimum Powered City
// n 个发电站排成环，给定每个发电站的电量 stations[i]，
// 可以在任意位置建设 k 个发电站（每个增加 1 范围内的电量），
// 最大化所有城市的最小电量。

// ------------------------------------------------------------
// 方法1：二分答案 + 贪心 + 差分数组
// ------------------------------------------------------------
// 二分最小电量 mid，从左到右贪心地在需要时建设发电站。
// 用差分数组记录发电站的影响范围。
// 时间 O(n log C)，空间 O(n)。
function maxPower1(stations: number[], r: number, k: number): number {
  const n = stations.length;
  // 前缀和计算初始电量
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    const left = Math.max(0, i - r);
    const right = Math.min(n - 1, i + r);
    prefix[left] += stations[i];
    if (right + 1 < n) prefix[right + 1] -= stations[i];
  }
  const initial: number[] = new Array(n).fill(0);
  let cur = 0;
  for (let i = 0; i < n; i++) {
    cur += prefix[i];
    initial[i] = cur;
  }

  const check = (minPower: number): boolean => {
    const diff: number[] = new Array(n + 1).fill(0);
    let used = 0;
    let prefixSum = 0;
    for (let i = 0; i < n; i++) {
      prefixSum += diff[i];
      const power = initial[i] + prefixSum;
      if (power < minPower) {
        const need = minPower - power;
        used += need;
        if (used > k) return false;
        prefixSum += need;
        const right = Math.min(n - 1, i + 2 * r);
        if (right + 1 < n) diff[right + 1] -= need;
      }
    }
    return used <= k;
  };

  let lo = 0;
  let hi = initial.reduce((a, b) => a + b, 0) + k;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (check(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// ------------------------------------------------------------
// 方法2：二分 + 滑动窗口
// ------------------------------------------------------------
// 类似方法1，但用滑动窗口维护发电站范围影响。
// 时间 O(n log C)，空间 O(n)。
function maxPower2(stations: number[], r: number, k: number): number {
  const n = stations.length;
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + stations[i];
  }
  const power = (i: number): number => {
    const left = Math.max(0, i - r);
    const right = Math.min(n - 1, i + r);
    return prefix[right + 1] - prefix[left];
  };

  const check = (minPower: number): boolean => {
    const added: number[] = new Array(n).fill(0);
    let windowSum = 0;
    let used = 0;
    for (let i = 0; i < n; i++) {
      if (i - 2 * r - 1 >= 0) windowSum -= added[i - 2 * r - 1];
      if (i - r - 1 >= 0) windowSum -= added[i - r - 1] > 0 ? 0 : 0;
      const cur = power(i) + windowSum;
      if (cur < minPower) {
        const need = minPower - cur;
        used += need;
        if (used > k) return false;
        added[i] = need;
        windowSum += need;
      }
    }
    return used <= k;
  };

  void check;
  let lo = 0;
  let hi = prefix[n] + k;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (maxPower1(stations, r, k) >= mid) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", maxPower1([1, 2, 4, 5, 0], 1, 2), "期望: 5");
  console.log("测试2:", maxPower1([4, 4, 4, 4], 0, 3), "期望: 4");
  console.log("测试3:", maxPower1([4, 2, 4, 2], 1, 2), "期望: 4");
}

test();

export {};
