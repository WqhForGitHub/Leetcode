// ============================================================
// 015. 和至少为 K 的最短子数组
// ============================================================
// LeetCode 862. Shortest Subarray with Sum at Least K
// 返回数组 A 中最短的非空连续子数组的长度，其和至少为 K。不存在返回 -1。
// 数组可能包含负数。

// ------------------------------------------------------------
// 方法1：前缀和 + 单调双端队列
// ------------------------------------------------------------
// 计算 prefix[i]，维护单调递增的前缀和下标队列。
// 对每个 i，不断从队首弹出满足 prefix[i]-prefix[队首]>=K 的下标并更新答案。
// 再从队尾弹出 >= prefix[i] 的下标保持单调性。
// 时间 O(n)，空间 O(n)。
function shortestSubarray1(nums: number[], k: number): number {
  const n = nums.length;
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  const deque: number[] = [];
  let result = Infinity;
  for (let i = 0; i <= n; i++) {
    while (deque.length > 0 && prefix[i] - prefix[deque[0]] >= k) {
      result = Math.min(result, i - deque.shift()!);
    }
    while (deque.length > 0 && prefix[i] <= prefix[deque[deque.length - 1]]) {
      deque.pop();
    }
    deque.push(i);
  }
  return result === Infinity ? -1 : result;
}

// ------------------------------------------------------------
// 方法2：前缀和 + 滑动窗口（仅适用于非负数）
// ------------------------------------------------------------
// 当数组全为非负数时，可用简单滑动窗口。
// 时间 O(n)，空间 O(1)。
function shortestSubarray2(nums: number[], k: number): number {
  const n = nums.length;
  let sum = 0;
  let left = 0;
  let result = Infinity;
  for (let right = 0; right < n; right++) {
    sum += nums[right];
    while (sum >= k) {
      result = Math.min(result, right - left + 1);
      sum -= nums[left++];
    }
  }
  return result === Infinity ? -1 : result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", shortestSubarray1([1], 1), "期望: 1");
  console.log("测试2:", shortestSubarray1([1, 2], 4), "期望: -1");
  console.log("测试3:", shortestSubarray1([2, -1, 2], 3), "期望: 3");
  console.log(
    "测试4:",
    shortestSubarray1([84, -37, 32, 40, 95], 167),
    "期望: 3",
  );
  console.log("测试5:", shortestSubarray2([1, 2, 3, 4, 5], 11), "期望: 3");
}

test();

export {};
