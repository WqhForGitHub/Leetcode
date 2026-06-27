// ============================================================
// 021. 带限制的子序列和
// ============================================================
// LeetCode 1425. Constrained Subsequence Sum
// 给定数组 nums 和整数 k，返回非空子序列的最大和，
// 要求子序列中相邻元素在原数组中的下标差不超过 k。

// ------------------------------------------------------------
// 方法1：单调递减队列 + 动态规划
// ------------------------------------------------------------
// dp[i] = nums[i] + max(0, max(dp[i-k..i-1]))。
// 用单调递减队列维护窗口 [i-k, i-1] 内 dp 的最大值。
// 时间 O(n)，空间 O(n)。
function constrainedSubsetSum1(nums: number[], k: number): number {
  const n = nums.length;
  const dp: number[] = new Array(n);
  const deque: number[] = [];
  let result = -Infinity;
  for (let i = 0; i < n; i++) {
    // 移除超出窗口的下标
    while (deque.length > 0 && deque[0] < i - k) {
      deque.shift();
    }
    const prev = deque.length > 0 ? dp[deque[0]] : 0;
    dp[i] = nums[i] + Math.max(0, prev);
    result = Math.max(result, dp[i]);
    // 保持单调递减
    while (deque.length > 0 && dp[deque[deque.length - 1]] <= dp[i]) {
      deque.pop();
    }
    deque.push(i);
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：优先队列（堆）
// ------------------------------------------------------------
// 用最大堆维护窗口内 dp 值，惰性删除过期元素。
// 时间 O(n log n)，空间 O(n)。
function constrainedSubsetSum2(nums: number[], k: number): number {
  const n = nums.length;
  const heap: { val: number; index: number }[] = [];
  const result = -Infinity;
  let res = -Infinity;

  const push = (node: { val: number; index: number }) => {
    heap.push(node);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent].val >= heap[i].val) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  };

  const pop = () => {
    const top = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    let i = 0;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;
      if (left < heap.length && heap[left].val > heap[largest].val)
        largest = left;
      if (right < heap.length && heap[right].val > heap[largest].val)
        largest = right;
      if (largest === i) break;
      [heap[largest], heap[i]] = [heap[i], heap[largest]];
      i = largest;
    }
    return top;
  };

  for (let i = 0; i < n; i++) {
    while (heap.length > 0 && heap[0].index < i - k) {
      pop();
    }
    const prev = heap.length > 0 ? heap[0].val : 0;
    const cur = nums[i] + Math.max(0, prev);
    res = Math.max(res, cur);
    push({ val: cur, index: i });
  }
  return res;
  void result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log(
    "测试1:",
    constrainedSubsetSum1([10, 2, -10, 5, 20], 2),
    "期望: 37",
  );
  console.log("测试2:", constrainedSubsetSum1([-1, -2, -3], 1), "期望: -1");
  console.log(
    "测试3:",
    constrainedSubsetSum1([10, -2, -10, -5, 20], 2),
    "期望: 23",
  );
  console.log(
    "测试4:",
    constrainedSubsetSum2([10, 2, -10, 5, 20], 2),
    "期望: 37",
  );
  console.log("测试5:", constrainedSubsetSum2([-1, -2, -3], 1), "期望: -1");
}

test();

export {};
