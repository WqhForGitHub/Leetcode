// ============================================================
// 003. 滑动窗口最大值
// ============================================================
// LeetCode 239. Sliding Window Maximum
// 给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到最右侧，
// 返回每个滑动窗口中的最大值。

// ------------------------------------------------------------
// 方法1：单调递减双端队列
// ------------------------------------------------------------
// 维护一个存储下标的单调递减队列，队首始终为当前窗口最大值下标。
// 每次入队前弹出队尾所有小于当前值的下标，再移除队首超出窗口的下标。
// 时间 O(n)，空间 O(k)。
function maxSlidingWindow1(nums: number[], k: number): number[] {
  const result: number[] = [];
  const deque: number[] = []; // 存下标，对应值单调递减
  for (let i = 0; i < nums.length; i++) {
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (deque[0] <= i - k) {
      deque.shift();
    }
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：分块预处理（稀疏表思路）
// ------------------------------------------------------------
// 将数组按 k 分块，预处理每个块的前缀最大值与后缀最大值，
// 窗口最大值 = max(左块后缀最大, 右块前缀最大)。
// 时间 O(n)，空间 O(n)。
function maxSlidingWindow2(nums: number[], k: number): number[] {
  const n = nums.length;
  const result: number[] = [];
  const prefix: number[] = new Array(n);
  const suffix: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    if (i % k === 0) {
      prefix[i] = nums[i];
    } else {
      prefix[i] = Math.max(prefix[i - 1], nums[i]);
    }
  }
  for (let i = n - 1; i >= 0; i--) {
    if (i === n - 1 || (i + 1) % k === 0) {
      suffix[i] = nums[i];
    } else {
      suffix[i] = Math.max(suffix[i + 1], nums[i]);
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
    JSON.stringify(maxSlidingWindow1([1, 3, -1, -3, 5, 3, 6, 7], 3)),
    "期望: [3,3,5,5,6,7]",
  );
  console.log("测试2:", JSON.stringify(maxSlidingWindow1([1], 1)), "期望: [1]");
  console.log(
    "测试3:",
    JSON.stringify(maxSlidingWindow2([1, 3, -1, -3, 5, 3, 6, 7], 3)),
    "期望: [3,3,5,5,6,7]",
  );
  console.log("测试4:", JSON.stringify(maxSlidingWindow2([1], 1)), "期望: [1]");
}

test();

export {};
