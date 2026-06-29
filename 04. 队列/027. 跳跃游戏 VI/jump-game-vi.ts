// ============================================================
// 027. 跳跃游戏 VI
// ============================================================
// LeetCode 1696. Jump Game VI
// 在数组中从下标 0 开始跳跃，每次最多跳 k 步，跳到终点获得分数，
// 求能获得的最大分数。

// ------------------------------------------------------------
// 方法1：单调递减队列 + 动态规划
// ------------------------------------------------------------
// dp[i] = nums[i] + max(dp[i-k..i-1])。
// 用单调递减队列维护窗口内 dp 最大值。
// 时间 O(n)，空间 O(n)。
function maxResult1(nums: number[], k: number): number {
  const n = nums.length;
  const dp: number[] = new Array(n);
  const deque: number[] = [0];
  dp[0] = nums[0];
  for (let i = 1; i < n; i++) {
    while (deque.length > 0 && deque[0] < i - k) {
      deque.shift();
    }
    dp[i] = nums[i] + dp[deque[0]];
    while (deque.length > 0 && dp[deque[deque.length - 1]] <= dp[i]) {
      deque.pop();
    }
    deque.push(i);
  }
  return dp[n - 1];
}

// ------------------------------------------------------------
// 方法2：优先队列（最大堆）
// ------------------------------------------------------------
// 用最大堆维护窗口内 dp 值，惰性删除过期元素。
// 时间 O(n log n)，空间 O(n)。
function maxResult2(nums: number[], k: number): number {
  const n = nums.length;
  const heap: { val: number; index: number }[] = [{ val: nums[0], index: 0 }];

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
      if (left < heap.length && heap[left].val > heap[largest].val) largest = left;
      if (right < heap.length && heap[right].val > heap[largest].val) largest = right;
      if (largest === i) break;
      [heap[largest], heap[i]] = [heap[i], heap[largest]];
      i = largest;
    }
    return top;
  };

  for (let i = 1; i < n; i++) {
    while (heap[0].index < i - k) {
      pop();
    }
    const cur = nums[i] + heap[0].val;
    if (i === n - 1) return cur;
    push({ val: cur, index: i });
  }
  return nums[0];
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", maxResult1([1, -1, -2, 4, -7, 3], 2), "期望: 7");
  console.log("测试2:", maxResult1([10, -5, -2, 4, 0, 3], 3), "期望: 17");
  console.log("测试3:", maxResult1([1, -5, -20, 4, -1, 3, -6, -3], 2), "期望: 0");
  console.log("测试4:", maxResult2([1, -1, -2, 4, -7, 3], 2), "期望: 7");
  console.log("测试5:", maxResult2([10, -5, -2, 4, 0, 3], 3), "期望: 17");
}

test();

export {};
