// ============================================================
// 159. 不间断子数组
// ============================================================
// LeetCode 2762. Continuous Subarrays
// 找满足任意两元素差不超过2的连续子数组个数。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：双单调队列
function continuousSubarrays(nums: number[]): number {
  const maxDeque: number[] = [];
  const minDeque: number[] = [];
  let left = 0;
  let result = 0;
  for (let right = 0; right < nums.length; right++) {
    while (maxDeque.length > 0 && nums[maxDeque[maxDeque.length - 1]] <= nums[right])
      maxDeque.pop();
    maxDeque.push(right);
    while (minDeque.length > 0 && nums[minDeque[minDeque.length - 1]] >= nums[right])
      minDeque.pop();
    minDeque.push(right);
    while (nums[maxDeque[0]] - nums[minDeque[0]] > 2) {
      left++;
      while (maxDeque[0] < left) maxDeque.shift();
      while (minDeque[0] < left) minDeque.shift();
    }
    result += right - left + 1;
  }
  return result;
}

// 方法2：最大堆 + 最小堆（懒删除）
function continuousSubarraysHeap(nums: number[]): number {
  const maxHeap: Array<[number, number]> = [];
  const minHeap: Array<[number, number]> = [];
  let left = 0;
  let result = 0;
  const siftUp = (heap: Array<[number, number]>, i: number, isMax: boolean): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      const cmp = isMax ? heap[i][0] > heap[p][0] : heap[i][0] < heap[p][0];
      if (cmp) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const siftDown = (heap: Array<[number, number]>, i: number, isMax: boolean): void => {
    const len = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < len && (isMax ? heap[l][0] > heap[s][0] : heap[l][0] < heap[s][0])) s = l;
      if (r < len && (isMax ? heap[r][0] > heap[s][0] : heap[r][0] < heap[s][0])) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  for (let right = 0; right < nums.length; right++) {
    maxHeap.push([nums[right], right]);
    siftUp(maxHeap, maxHeap.length - 1, true);
    minHeap.push([nums[right], right]);
    siftUp(minHeap, minHeap.length - 1, false);
    while (maxHeap[0][0] - minHeap[0][0] > 2) {
      left++;
      while (maxHeap[0][1] < left) {
        maxHeap[0] = maxHeap[maxHeap.length - 1];
        maxHeap.pop();
        if (maxHeap.length > 0) siftDown(maxHeap, 0, true);
      }
      while (minHeap[0][1] < left) {
        minHeap[0] = minHeap[minHeap.length - 1];
        minHeap.pop();
        if (minHeap.length > 0) siftDown(minHeap, 0, false);
      }
    }
    result += right - left + 1;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 159. 不间断子数组 =====");
console.log("单调队列:", continuousSubarrays([5, 4, 2, 4])); // 期望 8
console.log("堆:", continuousSubarraysHeap([1, 2, 3])); // 期望 6

export {};
