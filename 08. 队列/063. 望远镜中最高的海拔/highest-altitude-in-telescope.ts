// ============================================================
// 063. 望远镜中最高的海拔
// ============================================================
// LeetCode LCR 038 / 剑指 Offer 59-I. 滑动窗口的最大值
// 给定一个数组 nums 和窗口大小 k，返回每个滑动窗口中的最大值。

// ------------------------------------------------------------
// 方法1：单调递减双端队列
// ------------------------------------------------------------
// 维护一个存储下标的单调递减队列，队首始终为当前窗口最大值下标。
// 时间 O(n)，空间 O(k)。
function maxAltitude1(heights: number[], k: number): number[] {
  const result: number[] = [];
  const deque: number[] = [];
  for (let i = 0; i < heights.length; i++) {
    while (deque.length > 0 && heights[deque[deque.length - 1]] <= heights[i]) {
      deque.pop();
    }
    deque.push(i);
    if (deque[0] <= i - k) {
      deque.shift();
    }
    if (i >= k - 1) {
      result.push(heights[deque[0]]);
    }
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：分块预处理
// ------------------------------------------------------------
// 将数组按 k 分块，预处理每个块的前缀最大值与后缀最大值。
// 时间 O(n)，空间 O(n)。
function maxAltitude2(heights: number[], k: number): number[] {
  const n = heights.length;
  const result: number[] = [];
  const prefix: number[] = new Array(n);
  const suffix: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    if (i % k === 0) {
      prefix[i] = heights[i];
    } else {
      prefix[i] = Math.max(prefix[i - 1], heights[i]);
    }
  }
  for (let i = n - 1; i >= 0; i--) {
    if (i === n - 1 || (i + 1) % k === 0) {
      suffix[i] = heights[i];
    } else {
      suffix[i] = Math.max(suffix[i + 1], heights[i]);
    }
  }
  for (let i = 0; i <= n - k; i++) {
    result.push(Math.max(suffix[i], prefix[i + k - 1]));
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log(
    "测试1:",
    JSON.stringify(maxAltitude1([1, 3, -1, -3, 5, 3, 6, 7], 3)),
    "期望: [3,3,5,5,6,7]",
  );
  console.log("测试2:", JSON.stringify(maxAltitude1([1], 1)), "期望: [1]");
  console.log(
    "测试3:",
    JSON.stringify(maxAltitude2([1, 3, -1, -3, 5, 3, 6, 7], 3)),
    "期望: [3,3,5,5,6,7]",
  );
  console.log("测试4:", JSON.stringify(maxAltitude2([1], 1)), "期望: [1]");
}

test();

export {};
