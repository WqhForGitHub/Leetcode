// ============================================================
// 080. 销售价值减少的颜色球
// ============================================================
// LeetCode 1648. Sell Diminishing-Valued Colored Balls
// 每次 sell 一颗球价值为当前剩余同色球数，求 orders 次的最大价值。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：二分查找 + 计数
function maxProfit(inventory: number[], orders: number): number {
  const MOD = 1000000007;
  let lo = 0;
  let hi = Math.max(...inventory);
  // 找到阈值 T：所有 > T 的球都卖出，最后在 T 处卖一些
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    let cnt = 0;
    for (const inv of inventory) {
      if (inv >= mid) cnt += inv - mid + 1;
    }
    if (cnt <= orders) hi = mid - 1;
    else lo = mid;
  }
  const T = lo;
  let result = 0;
  let count = 0;
  for (const inv of inventory) {
    if (inv > T) {
      const n = inv - T;
      // 卖 T+1 到 inv
      result = (result + ((BigInt(inv) + BigInt(T + 1)) * BigInt(n) / 2n) % BigInt(MOD)) % BigInt(MOD);
      count += n;
    }
  }
  // 剩余的卖价值为 T 的球
  const remain = orders - count;
  result = (result + BigInt(T) * BigInt(remain)) % BigInt(MOD);
  return Number(result);
}

// 方法2：最大堆模拟（小数据量）
function maxProfitHeap(inventory: number[], orders: number): number {
  const MOD = 1000000007;
  const heap: number[] = inventory.slice();
  const pushMax = (v: number): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] > heap[p]) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const popMax = (): number => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l] > heap[s]) s = l;
        if (r < heap.length && heap[r] > heap[s]) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  // 建堆
  for (let i = (heap.length >> 1) - 1; i >= 0; i--) {
    let idx = i;
    while (true) {
      let s = idx;
      const l = 2 * idx + 1;
      const r = 2 * idx + 2;
      if (l < heap.length && heap[l] > heap[s]) s = l;
      if (r < heap.length && heap[r] > heap[s]) s = r;
      if (s !== idx) {
        [heap[idx], heap[s]] = [heap[s], heap[idx]];
        idx = s;
      } else break;
    }
  }
  let result = 0;
  for (let i = 0; i < orders; i++) {
    const v = popMax();
    result = (result + v) % MOD;
    pushMax(v - 1);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 080. 销售价值减少的颜色球 =====");
console.log("二分:", maxProfit([2, 5], 4)); // 期望 14
console.log("二分:", maxProfit([3, 5], 6)); // 期望 19

export {};
