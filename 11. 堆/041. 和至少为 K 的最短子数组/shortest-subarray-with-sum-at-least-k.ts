// ============================================================
// 041. 和至少为 K 的最短子数组
// ============================================================
// LeetCode 862. Shortest Subarray with Sum at Least K
// 返回和至少为 k 的最短非空连续子数组长度。
// 时间复杂度：O(N)，空间复杂度：O(N)

// 方法1：单调队列 + 前缀和（推荐）
function shortestSubarray(nums: number[], k: number): number {
  const n = nums.length;
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  const deque: number[] = [];
  let result = n + 1;
  for (let i = 0; i <= n; i++) {
    while (deque.length > 0 && prefix[i] - prefix[deque[0]] >= k) {
      result = Math.min(result, i - deque.shift()!);
    }
    while (deque.length > 0 && prefix[i] <= prefix[deque[deque.length - 1]]) {
      deque.pop();
    }
    deque.push(i);
  }
  return result <= n ? result : -1;
}

// 方法2：暴力（小数据量）
function shortestSubarrayBrute(nums: number[], k: number): number {
  const n = nums.length;
  let result = n + 1;
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = i; j < n; j++) {
      sum += nums[j];
      if (sum >= k) {
        result = Math.min(result, j - i + 1);
        break;
      }
    }
  }
  return result <= n ? result : -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 041. 和至少为 K 的最短子数组 =====");
console.log("单调队列:", shortestSubarray([1], 1)); // 期望 1
console.log("单调队列:", shortestSubarray([1, 2], 4)); // 期望 -1
console.log("单调队列:", shortestSubarray([2, -1, 2], 3)); // 期望 3

export {};
