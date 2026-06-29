// ============================================================
// 131. 预算内的最多机器人数目
// ============================================================
// LeetCode 2398. Maximum Number of Robots Within Budget
// 有 n 个机器人，每个有费用和时间，选最多连续 k 个使 max(chargeTimes) + k * sum(runningCosts) <= budget。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：双单调队列 + 滑动窗口
function maximumRobots(chargeTimes: number[], runningCosts: number[], budget: number): number {
  const n = chargeTimes.length;
  const maxDeque: number[] = [];
  let left = 0;
  let sum = 0;
  let result = 0;
  for (let right = 0; right < n; right++) {
    while (maxDeque.length > 0 && chargeTimes[maxDeque[maxDeque.length - 1]] <= chargeTimes[right]) {
      maxDeque.pop();
    }
    maxDeque.push(right);
    sum += runningCosts[right];
    const k = right - left + 1;
    while (maxDeque.length > 0 && chargeTimes[maxDeque[0]] + k * sum > budget) {
      left++;
      while (maxDeque[0] < left) maxDeque.shift();
      sum -= runningCosts[left - 1];
      k = right - left + 1;
    }
    if (maxDeque.length > 0) {
      result = Math.max(result, right - left + 1);
    }
  }
  return result;
}

// 方法2：最大堆 + 滑动窗口（懒删除）
function maximumRobotsHeap(chargeTimes: number[], runningCosts: number[], budget: number): number {
  const n = chargeTimes.length;
  const heap: Array<{ val: number; idx: number }> = [];
  let left = 0;
  let sum = 0;
  let result = 0;
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].val > heap[p].val) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
    const len = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l].val > heap[s].val) s = l;
      if (r < len && heap[r].val > heap[s].val) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  for (let right = 0; right < n; right++) {
    heap.push({ val: chargeTimes[right], idx: right });
    siftUp(heap.length - 1);
    sum += runningCosts[right];
    const k = right - left + 1;
    while (heap.length > 0 && heap[0].val + k * sum > budget) {
      left++;
      sum -= runningCosts[left - 1];
      while (heap.length > 0 && heap[0].idx < left) {
        heap[0] = heap[heap.length - 1];
        heap.pop();
        if (heap.length > 0) siftDown();
      }
    }
    if (heap.length > 0) {
      result = Math.max(result, right - left + 1);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 131. 预算内的最多机器人数目 =====");
console.log("单调队列:", maximumRobots([3, 6, 1, 3, 4], [2, 1, 3, 4, 5], 25)); // 期望 3
console.log("堆:", maximumRobotsHeap([11, 12, 19], [10, 8, 7], 19)); // 期望 0

export {};
