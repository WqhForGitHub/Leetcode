// ============================================================
// 070. 绝对差不超过限制的最长连续子数组
// ============================================================
// LeetCode 1438. Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit
// 求最长连续子数组使最大值与最小值之差不超过 limit。
// 时间复杂度：O(N)，空间复杂度：O(N)

// 方法1：双单调队列（推荐）
function longestSubarray(nums: number[], limit: number): number {
  const maxDeque: number[] = []; // 单调递减
  const minDeque: number[] = []; // 单调递增
  let left = 0;
  let result = 0;
  for (let right = 0; right < nums.length; right++) {
    while (maxDeque.length > 0 && nums[maxDeque[maxDeque.length - 1]] <= nums[right]) maxDeque.pop();
    maxDeque.push(right);
    while (minDeque.length > 0 && nums[minDeque[minDeque.length - 1]] >= nums[right]) minDeque.pop();
    minDeque.push(right);
    while (nums[maxDeque[0]] - nums[minDeque[0]] > limit) {
      left++;
      while (maxDeque[0] < left) maxDeque.shift();
      while (minDeque[0] < left) minDeque.shift();
    }
    result = Math.max(result, right - left + 1);
  }
  return result;
}

// 方法2：两个堆 + 滑动窗口
function longestSubarrayHeap(nums: number[], limit: number): number {
  const maxHeap: Array<{ val: number; idx: number }> = [];
  const minHeap: Array<{ val: number; idx: number }> = [];
  const pushHeap = (heap: Array<{ val: number; idx: number }>, v: { val: number; idx: number }, isMax: boolean): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      const cmp = isMax ? heap[i].val > heap[p].val : heap[i].val < heap[p].val;
      if (cmp) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  let left = 0;
  let result = 0;
  for (let right = 0; right < nums.length; right++) {
    pushHeap(maxHeap, { val: nums[right], idx: right }, true);
    pushHeap(minHeap, { val: nums[right], idx: right }, false);
    while (maxHeap[0].val - minHeap[0].val > limit) {
      left++;
      while (maxHeap[0].idx < left) {
        maxHeap[0] = maxHeap[maxHeap.length - 1];
        maxHeap.pop();
        let i = 0;
        const n = maxHeap.length;
        while (true) {
          let s = i;
          const l = 2 * i + 1;
          const r = 2 * i + 2;
          if (l < n && maxHeap[l].val > maxHeap[s].val) s = l;
          if (r < n && maxHeap[r].val > maxHeap[s].val) s = r;
          if (s !== i) {
            [maxHeap[i], maxHeap[s]] = [maxHeap[s], maxHeap[i]];
            i = s;
          } else break;
        }
      }
      while (minHeap[0].idx < left) {
        minHeap[0] = minHeap[minHeap.length - 1];
        minHeap.pop();
        let i = 0;
        const n = minHeap.length;
        while (true) {
          let s = i;
          const l = 2 * i + 1;
          const r = 2 * i + 2;
          if (l < n && minHeap[l].val < minHeap[s].val) s = l;
          if (r < n && minHeap[r].val < minHeap[s].val) s = r;
          if (s !== i) {
            [minHeap[i], minHeap[s]] = [minHeap[s], minHeap[i]];
            i = s;
          } else break;
        }
      }
    }
    result = Math.max(result, right - left + 1);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 070. 绝对差不超过限制的最长连续子数组 =====");
console.log("单调队列:", longestSubarray([8, 2, 4, 7], 4)); // 期望 2
console.log("堆:", longestSubarrayHeap([10, 1, 2, 4, 7, 2], 5)); // 期望 4

export {};
