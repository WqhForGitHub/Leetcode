// ============================================================
// 146. 将珠子放入背包中
// ============================================================
// LeetCode 2551. Put Marbles in Bags
// 将 weights 分成 k 段，每段代价为首尾之和，求最大总代价与最小总代价的差。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：排序
function putMarbles(weights: number[], k: number): number {
  const n = weights.length;
  if (k === 1 || k === n) return 0;
  const pairSums: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    pairSums.push(weights[i] + weights[i + 1]);
  }
  pairSums.sort((a, b) => a - b);
  let minSum = 0;
  let maxSum = 0;
  for (let i = 0; i < k - 1; i++) {
    minSum += pairSums[i];
    maxSum += pairSums[pairSums.length - 1 - i];
  }
  return maxSum - minSum;
}

// 方法2：最大堆 + 最小堆
function putMarblesHeap(weights: number[], k: number): number {
  const n = weights.length;
  if (k === 1 || k === n) return 0;
  const minHeap: number[] = [];
  const maxHeap: number[] = [];
  const pushMin = (v: number): void => {
    minHeap.push(v);
    let i = minHeap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (minHeap[i] < minHeap[p]) {
        [minHeap[i], minHeap[p]] = [minHeap[p], minHeap[i]];
        i = p;
      } else break;
    }
  };
  const pushMax = (v: number): void => {
    maxHeap.push(v);
    let i = maxHeap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (maxHeap[i] > maxHeap[p]) {
        [maxHeap[i], maxHeap[p]] = [maxHeap[p], maxHeap[i]];
        i = p;
      } else break;
    }
  };
  for (let i = 0; i < n - 1; i++) {
    const sum = weights[i] + weights[i + 1];
    pushMin(sum);
    pushMax(sum);
  }
  let result = 0;
  for (let i = 0; i < k - 1; i++) {
    result += maxHeap[0] - minHeap[0];
    // pop min
    minHeap[0] = minHeap[minHeap.length - 1];
    minHeap.pop();
    let j = 0;
    while (true) {
      let s = j;
      const l = 2 * j + 1,
        r = 2 * j + 2;
      if (l < minHeap.length && minHeap[l] < minHeap[s]) s = l;
      if (r < minHeap.length && minHeap[r] < minHeap[s]) s = r;
      if (s !== j) {
        [minHeap[j], minHeap[s]] = [minHeap[s], minHeap[j]];
        j = s;
      } else break;
    }
    // pop max
    maxHeap[0] = maxHeap[maxHeap.length - 1];
    maxHeap.pop();
    j = 0;
    while (true) {
      let s = j;
      const l = 2 * j + 1,
        r = 2 * j + 2;
      if (l < maxHeap.length && maxHeap[l] > maxHeap[s]) s = l;
      if (r < maxHeap.length && maxHeap[r] > maxHeap[s]) s = r;
      if (s !== j) {
        [maxHeap[j], maxHeap[s]] = [maxHeap[s], maxHeap[j]];
        j = s;
      } else break;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 146. 将珠子放入背包中 =====");
console.log("排序:", putMarbles([1, 3, 5, 1], 2)); // 期望 4
console.log("堆:", putMarblesHeap([1, 3, 5, 1], 2)); // 期望 4

export {};
