// ============================================================
// 042. 找到最大非递减数组的长度
// ============================================================
// LeetCode 3226/3405 风格. 找到最大非递减数组的长度
// 允许将数组分成若干段，每段求和后用新数组替代，使新数组非递减，求最大长度。

// ------------------------------------------------------------
// 方法1：单调栈 + 贪心合并
// ------------------------------------------------------------
// 用单调栈维护前缀和，当前段和小于栈顶时合并，保证非递减。
// 时间 O(n)，空间 O(n)。
function findMaximumLength1(nums: number[]): number {
  const n = nums.length;
  // 单调栈：存储 (前缀和, 段长)
  const stack: { sum: number; length: number }[] = [];
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  // dp[i] = 以 i 结尾的最大段长
  const dp: number[] = new Array(n + 1).fill(0);
  const lastSum: number[] = new Array(n + 1).fill(0);
  // 单调队列维护最优转移点
  const deque: number[] = [0];
  let lastJ = 0;

  for (let i = 1; i <= n; i++) {
    // 找到最大的 j 使得 prefix[i] - prefix[j] >= lastSum[j]
    while (deque.length > 1) {
      const j = deque[0];
      const j2 = deque[1];
      if (prefix[i] - prefix[j] >= lastSum[j]) {
        lastJ = j;
        deque.shift();
      } else if (prefix[i] - prefix[j2] >= lastSum[j2]) {
        lastJ = j2;
        deque.shift();
      } else {
        break;
      }
    }
    // 检查队首
    const j = deque.length > 0 ? deque[0] : lastJ;
    dp[i] = dp[j] + 1;
    lastSum[i] = prefix[i] - prefix[j];

    // 保持单调性入队
    while (deque.length > 0) {
      const tail = deque[deque.length - 1];
      if (prefix[i] + lastSum[i] <= prefix[tail] + lastSum[tail]) {
        deque.pop();
      } else {
        break;
      }
    }
    deque.push(i);
  }

  return dp[n];
}

// ------------------------------------------------------------
// 方法2：二分查找 + 动态规划
// ------------------------------------------------------------
// 用二分查找代替单调队列找转移点。
// 时间 O(n log n)，空间 O(n)。
function findMaximumLength2(nums: number[]): number {
  const n = nums.length;
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  const dp: number[] = new Array(n + 1).fill(0);
  const lastSum: number[] = new Array(n + 1).fill(0);
  // 存储候选转移点的 (prefix[j] + lastSum[j], j)
  const candidates: { threshold: number; index: number }[] = [{ threshold: 0, index: 0 }];

  for (let i = 1; i <= n; i++) {
    // 二分找最大 j 使得 prefix[j] + lastSum[j] <= prefix[i]
    let lo = 0;
    let hi = candidates.length - 1;
    let bestJ = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (candidates[mid].threshold <= prefix[i]) {
        bestJ = candidates[mid].index;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    dp[i] = dp[bestJ] + 1;
    lastSum[i] = prefix[i] - prefix[bestJ];
    const threshold = prefix[i] + lastSum[i];
    // 保持单调递增
    while (candidates.length > 0 && candidates[candidates.length - 1].threshold >= threshold) {
      candidates.pop();
    }
    candidates.push({ threshold, index: i });
  }

  return dp[n];
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", findMaximumLength2([5, 2, 2]), "期望: 1");
  console.log("测试2:", findMaximumLength2([1, 2, 3]), "期望: 3");
  console.log("测试3:", findMaximumLength2([4, 3, 2, 6, 1]), "期望: 3");
}

test();

export {};
