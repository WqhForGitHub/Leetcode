// ============================================================
// 161. 子序列最大优雅度
// ============================================================
// LeetCode 2813. Maximal Elegance of a K-Length Subsequence
// 选 k 个项目，优雅度 = (利润之和 + 不同类别数^2) 的最大值。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：排序 + 最小堆 + 贪心
function findMaximumElegance(items: number[][], k: number): number {
  items.sort((a, b) => b[0] - a[0]);
  const minHeap: number[] = [];
  const seenCategories: Set<number> = new Set();
  let sum = 0;
  let result = 0;
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (minHeap[i] < minHeap[p]) {
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
      if (l < len && minHeap[l] < minHeap[s]) s = l;
      if (r < len && minHeap[r] < minHeap[s]) s = r;
      if (s !== i) {
        [minHeap[i], minHeap[s]] = [minHeap[s], minHeap[i]];
        i = s;
      } else break;
    }
  };
  const duplicates: number[] = [];
  for (let i = 0; i < items.length; i++) {
    const [profit, category] = items[i];
    if (i < k) {
      sum += profit;
      if (seenCategories.has(category)) {
        minHeap.push(profit);
        siftUp(minHeap.length - 1);
        duplicates.push(profit);
      } else {
        seenCategories.add(category);
      }
    } else {
      if (!seenCategories.has(category) && minHeap.length > 0) {
        const minProfit = minHeap[0];
        minHeap[0] = minHeap[minHeap.length - 1];
        minHeap.pop();
        if (minHeap.length > 0) siftDown();
        sum = sum - minProfit + profit;
        seenCategories.add(category);
      }
    }
    result = Math.max(result, sum + seenCategories.size * seenCategories.size);
  }
  return result;
}

// 方法2：排序 + 栈
function findMaximumEleganceStack(items: number[][], k: number): number {
  items.sort((a, b) => b[0] - a[0]);
  let sum = 0;
  const seen: Set<number> = new Set();
  const dup: number[] = [];
  for (let i = 0; i < k; i++) {
    sum += items[i][0];
    if (seen.has(items[i][1])) dup.push(items[i][0]);
    else seen.add(items[i][1]);
  }
  let result = sum + seen.size * seen.size;
  let dupIdx = dup.length - 1;
  for (let i = k; i < items.length && dupIdx >= 0; i++) {
    if (!seen.has(items[i][1])) {
      seen.add(items[i][1]);
      sum = sum - dup[dupIdx--] + items[i][0];
      result = Math.max(result, sum + seen.size * seen.size);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 161. 子序列最大优雅度 =====");
console.log(
  "堆:",
  findMaximumElegance(
    [
      [3, 2],
      [5, 1],
      [10, 1],
    ],
    2,
  ),
); // 期望 17
console.log(
  "栈:",
  findMaximumEleganceStack(
    [
      [3, 1],
      [3, 1],
      [2, 2],
      [5, 3],
    ],
    3,
  ),
); // 期望 19

export {};
