// ============================================================
// 034. 预算内的最多机器人数目
// ============================================================
// LeetCode 2398. Maximum Number of Robots Within Budget
// 有 n 个机器人，每个有 chargeTime 和 runningCost。
// 选择连续 k 个机器人运行，总成本 = max(chargeTime) + k * sum(runningCost)。
// 求预算 budget 内最多能同时运行多少个机器人。

// ------------------------------------------------------------
// 方法1：二分 + 单调队列（滑动窗口最大值）
// ------------------------------------------------------------
// 二分 k，用单调队列检查长度为 k 的窗口的最大 chargeTime + k*runningCostSum。
// 时间 O(n log n)，空间 O(n)。
function maximumRobots1(
  chargeTimes: number[],
  runningCosts: number[],
  budget: number,
): number {
  const n = chargeTimes.length;
  let lo = 0;
  let hi = n;

  const canRun = (k: number): boolean => {
    if (k === 0) return true;
    let runningSum = 0;
    const deque: number[] = [];
    for (let i = 0; i < n; i++) {
      runningSum += runningCosts[i];
      while (
        deque.length > 0 &&
        chargeTimes[deque[deque.length - 1]] <= chargeTimes[i]
      ) {
        deque.pop();
      }
      deque.push(i);
      if (i >= k - 1) {
        while (deque[0] < i - k + 1) deque.shift();
        const cost = chargeTimes[deque[0]] + k * runningSum;
        if (cost <= budget) return true;
        runningSum -= runningCosts[i - k + 1];
      }
    }
    return false;
  };

  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (canRun(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// ------------------------------------------------------------
// 方法2：滑动窗口 + 单调队列（直接贪心扩展）
// ------------------------------------------------------------
// 用双指针维护窗口，当成本超预算时收缩左端。
// 时间 O(n)，空间 O(n)。
function maximumRobots2(
  chargeTimes: number[],
  runningCosts: number[],
  budget: number,
): number {
  const n = chargeTimes.length;
  const deque: number[] = [];
  let runningSum = 0;
  let left = 0;
  let result = 0;
  for (let right = 0; right < n; right++) {
    runningSum += runningCosts[right];
    while (
      deque.length > 0 &&
      chargeTimes[deque[deque.length - 1]] <= chargeTimes[right]
    ) {
      deque.pop();
    }
    deque.push(right);
    while (deque.length > 0) {
      while (deque[0] < left) deque.shift();
      const cost = chargeTimes[deque[0]] + (right - left + 1) * runningSum;
      if (cost <= budget) break;
      runningSum -= runningCosts[left];
      left++;
    }
    result = Math.max(result, right - left + 1);
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log(
    "测试1:",
    maximumRobots1([3, 6, 1, 3, 4], [2, 1, 3, 4, 5], 25),
    "期望: 3",
  );
  console.log(
    "测试2:",
    maximumRobots1([11, 12, 19], [10, 8, 7], 19),
    "期望: 0",
  );
  console.log(
    "测试3:",
    maximumRobots2([3, 6, 1, 3, 4], [2, 1, 3, 4, 5], 25),
    "期望: 3",
  );
  console.log(
    "测试4:",
    maximumRobots2([11, 12, 19], [10, 8, 7], 19),
    "期望: 0",
  );
}

test();

export {};
