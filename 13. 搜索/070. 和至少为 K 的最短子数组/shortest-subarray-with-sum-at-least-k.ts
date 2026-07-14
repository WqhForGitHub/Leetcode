// ============================================================
// 070. 和至少为 K 的最短子数组
// ============================================================
// LeetCode 862. Shortest Subarray with Sum at Least K
// 返回数组中和至少为 k 的最短非空连续子数组长度。

// 方法1：单调双端队列 + 前缀和（O(n)）
function shortestSubarray(nums: number[], k: number): number {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  const deque: number[] = []; // 存储下标，维护单调递增的前缀和
  let minLen = Infinity;
  for (let i = 0; i <= n; i++) {
    // 从队首弹出满足条件的
    while (deque.length > 0 && prefix[i] - prefix[deque[0]] >= k) {
      minLen = Math.min(minLen, i - deque.shift()!);
    }
    // 维护单调性，从队尾弹出
    while (deque.length > 0 && prefix[i] <= prefix[deque[deque.length - 1]]) {
      deque.pop();
    }
    deque.push(i);
  }
  return minLen === Infinity ? -1 : minLen;
}

// 方法2：前缀和 + 有序集合二分（O(n log n)）
function shortestSubarrayBinary(nums: number[], k: number): number {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  // sortedList 存 [prefixSum, index]
  const sortedList: [number, number][] = [];
  let minLen = Infinity;
  for (let i = 0; i <= n; i++) {
    // 找最大的 prefixSum <= prefix[i] - k
    const target = prefix[i] - k;
    let best = -1;
    let lo = 0;
    let hi = sortedList.length - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (sortedList[mid][0] <= target) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (best !== -1) {
      minLen = Math.min(minLen, i - sortedList[best][1]);
    }
    // 插入并保持有序
    let insertPos = 0;
    while (insertPos < sortedList.length && sortedList[insertPos][0] < prefix[i]) {
      insertPos++;
    }
    sortedList.splice(insertPos, 0, [prefix[i], i]);
  }
  return minLen === Infinity ? -1 : minLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 070. 和至少为 K 的最短子数组 =====");
console.log("队列 [1],1:", shortestSubarray([1], 1)); // 1
console.log("队列 [1,2],4:", shortestSubarray([1, 2], 4)); // -1
console.log("队列 [2,-1,2],3:", shortestSubarray([2, -1, 2], 3)); // 3
console.log("二分 [2,-1,2],3:", shortestSubarrayBinary([2, -1, 2], 3)); // 3

export {};
