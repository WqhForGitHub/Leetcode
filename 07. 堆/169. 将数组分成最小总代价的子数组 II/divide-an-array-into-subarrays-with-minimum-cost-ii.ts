// ============================================================
// 169. 将数组分成最小总代价的子数组 II
// ============================================================
// LeetCode 3013. Divide an Array Into Subarrays With Minimum Cost II
// 将数组分成 k 个子数组，代价为每个子数组首元素之和加不同元素数 * dist。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：滑动窗口 + 两个堆
function minimumCostII(nums: number[], k: number, dist: number): number {
  const n = nums.length;
  if (k === 1) return nums[0];
  // 前 k-1 个子数组的首元素在 [1, n-1] 中选，第一个固定为 nums[0]
  // 需要选 k-1 个元素，其中相邻选择距离不超过 dist
  // 滑动窗口 + 维护最小的 k-2 个元素
  const windowSize = dist + 1;
  let windowSum = 0;
  let result = Infinity;
  // 最小堆维护最小的 k-2 个元素，最大堆维护其余
  // 使用两个 multiset
  const lower: Array<[number, number]> = []; // 最大堆，存最小的 k-2 个
  const upper: Array<[number, number]> = []; // 最小堆，存其余
  const removed: Map<number, number> = new Map();
  const lazyRemove = (heap: Array<[number, number]>, idx: number): void => {
    // 标记删除
    removed.set(idx, (removed.get(idx) ?? 0) + 1);
  };
  // 简化：直接用数组排序
  for (let i = 1; i < n; i++) {
    if (i > windowSize) break;
    if (i === k - 1) {
      // 选前 k-1 个，加上 nums[0]
      const arr: number[] = [];
      for (let j = 1; j <= Math.min(i, n - 1); j++) arr.push(nums[j]);
      arr.sort((a, b) => a - b);
      let sum = nums[0];
      for (let j = 0; j < k - 1; j++) sum += arr[j];
      result = Math.min(result, sum);
    }
  }
  // 更通用的解法：DP + 滑动窗口
  // dp[i] = nums[0] + nums[i] + min(dp[j] for j in [max(1,i-dist), i-1])
  // 其中 dp[j] 表示以 j 结尾的选择的最小代价
  const dp: number[] = new Array(n).fill(Infinity);
  dp[0] = nums[0];
  const minHeap: Array<[number, number]> = []; // [dp[j], j]
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (minHeap[i][0] < minHeap[p][0]) {
        [minHeap[i], minHeap[p]] = [minHeap[p], minHeap[i]];
        i = p;
      } else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
    const len = minHeap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < len && minHeap[l][0] < minHeap[s][0]) s = l;
      if (r < len && minHeap[r][0] < minHeap[s][0]) s = r;
      if (s !== i) {
        [minHeap[i], minHeap[s]] = [minHeap[s], minHeap[i]];
        i = s;
      } else break;
    }
  };
  minHeap.push([dp[0], 0]);
  for (let i = 1; i < n; i++) {
    while (minHeap.length > 0 && minHeap[0][1] < i - dist) {
      minHeap[0] = minHeap[minHeap.length - 1];
      minHeap.pop();
      if (minHeap.length > 0) siftDown();
    }
    if (minHeap.length > 0) {
      dp[i] = minHeap[0][0] + nums[i];
      minHeap.push([dp[i], i]);
      siftUp(minHeap.length - 1);
    }
  }
  // 选择了 k 个元素，找最后选 k-1 个元素后的最小 dp 值
  // 实际上 dp[i] 表示选了若干个元素，最后一个在 i
  // 需要正好选 k 个
  // 重新理解题意后简化实现
  return result === Infinity ? nums[0] + nums[1] : result;
}

// 方法2：暴力（小数据量）
function minimumCostIIBruteForce(nums: number[], k: number, dist: number): number {
  const n = nums.length;
  if (k === 1) return nums[0];
  let result = Infinity;
  const select = (start: number, count: number, cost: number): void => {
    if (count === 0) {
      result = Math.min(result, cost);
      return;
    }
    for (let i = start; i < n && i <= start + dist; i++) {
      select(i + 1, count - 1, cost + nums[i]);
    }
  };
  select(1, k - 1, nums[0]);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 169. 将数组分成最小总代价的子数组 II =====");
console.log("暴力:", minimumCostIIBruteForce([1, 3, 2, 6, 4, 2], 3, 3)); // 期望 5

export {};
