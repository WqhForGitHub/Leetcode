// ============================================================
// 114. 将数组和减半的最少操作次数
// ============================================================
// LeetCode 2208. Minimum Operations to Halve Array Sum
// 每次选一个数减半，求使数组和至少减半的最少操作次数。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：最大堆（推荐）
function halveArray(nums: number[]): number {
  const heap: number[] = [];
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
        const l = 2 * i + 1,
          r = 2 * i + 2;
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
  let total = 0;
  for (const n of nums) {
    heap.push(n);
    total += n;
  }
  for (let i = (heap.length >> 1) - 1; i >= 0; i--) {
    let idx = i;
    while (true) {
      let s = idx;
      const l = 2 * idx + 1,
        r = 2 * idx + 2;
      if (l < heap.length && heap[l] > heap[s]) s = l;
      if (r < heap.length && heap[r] > heap[s]) s = r;
      if (s !== idx) {
        [heap[idx], heap[s]] = [heap[s], heap[idx]];
        idx = s;
      } else break;
    }
  }
  const target = total / 2;
  let cur = total;
  let ops = 0;
  while (cur > target) {
    const top = popMax();
    const half = top / 2;
    cur -= half;
    pushMax(half);
    ops++;
  }
  return ops;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 114. 将数组和减半的最少操作次数 =====");
console.log("操作数:", halveArray([5, 19, 8, 1])); // 期望 3
console.log("操作数:", halveArray([3, 8, 20])); // 期望 3

export {};
