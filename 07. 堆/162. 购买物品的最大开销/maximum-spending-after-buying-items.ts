// ============================================================
// 162. 购买物品的最大开销
// ============================================================
// LeetCode 2931. Maximum Spending After Buying Items
// m 个商店每个有降序排列的商品价格，每天买一个商品，第 d 天花费 d * 价格，求最大总花费。
// 时间复杂度：O(mn log m)，空间复杂度：O(m)

// 方法1：最大堆
function maxSpending(values: number[][]): number {
  const m = values.length;
  const n = values[0].length;
  // 最大堆 [value, shop, index]
  const heap: Array<[number, number, number]> = [];
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] > heap[p][0]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
    const len = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l][0] > heap[s][0]) s = l;
      if (r < len && heap[r][0] > heap[s][0]) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  // 每个商店最后一个元素入堆
  for (let i = 0; i < m; i++) {
    heap.push([values[i][n - 1], i, n - 1]);
    siftUp(heap.length - 1);
  }
  let result = 0n;
  let day = 1;
  while (heap.length > 0) {
    const [val, shop, idx] = heap[0];
    result += BigInt(day) * BigInt(val);
    day++;
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown();
    if (idx > 0) {
      heap.push([values[shop][idx - 1], shop, idx - 1]);
      siftUp(heap.length - 1);
    }
  }
  return Number(result);
}

// 方法2：最小堆（从小到大买）
function maxSpendingMin(values: number[][]): number {
  const m = values.length;
  const n = values[0].length;
  const allValues: number[] = [];
  for (const shop of values) {
    for (const v of shop) allValues.push(v);
  }
  allValues.sort((a, b) => a - b);
  let result = 0n;
  for (let i = 0; i < allValues.length; i++) {
    result += BigInt(i + 1) * BigInt(allValues[i]);
  }
  return Number(result);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 162. 购买物品的最大开销 =====");
console.log("最大堆:", maxSpending([[8, 5, 2], [6, 4, 1], [9, 7, 3]])); // 期望 285
console.log("排序:", maxSpendingMin([[10, 8, 6], [4, 2, 0]])); // 期望 96? 验证

export {};
