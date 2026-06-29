// ============================================================
// 047. 距离相等的条形码
// ============================================================
// LeetCode 1054. Distant Barcodes
// 重排条形码使相邻两个不相同。
// 时间复杂度：O(N log k)，空间复杂度：O(k)

// 方法1：最大堆（按频率）
function rearrangeBarcodes(barcodes: number[]): number[] {
  const freq = new Map<number, number>();
  for (const b of barcodes) freq.set(b, (freq.get(b) ?? 0) + 1);
  const heap: Array<{ b: number; c: number }> = [];
  const siftDown = (i: number, n: number): void => {
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && heap[l].c > heap[s].c) s = l;
      if (r < n && heap[r].c > heap[s].c) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].c > heap[p].c) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  for (const [b, c] of freq) {
    heap.push({ b, c });
    siftUp(heap.length - 1);
  }
  const result: number[] = [];
  while (heap.length >= 2) {
    const a = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    siftDown(0, heap.length);
    const b = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    siftDown(0, heap.length);
    result.push(a.b, b.b);
    if (a.c > 1) {
      heap.push({ b: a.b, c: a.c - 1 });
      siftUp(heap.length - 1);
    }
    if (b.c > 1) {
      heap.push({ b: b.b, c: b.c - 1 });
      siftUp(heap.length - 1);
    }
  }
  if (heap.length === 1) result.push(heap[0].b);
  return result;
}

// 方法2：奇偶位置填充
function rearrangeBarcodesOddEven(barcodes: number[]): number[] {
  const freq = new Map<number, number>();
  for (const b of barcodes) freq.set(b, (freq.get(b) ?? 0) + 1);
  let maxCnt = 0;
  let maxBar = barcodes[0];
  for (const [b, c] of freq) {
    if (c > maxCnt) {
      maxCnt = c;
      maxBar = b;
    }
  }
  const res: number[] = new Array(barcodes.length).fill(0);
  let idx = 0;
  for (let i = 0; i < maxCnt; i++) {
    res[idx] = maxBar;
    idx += 2;
  }
  freq.delete(maxBar);
  for (const [b, c] of freq) {
    for (let i = 0; i < c; i++) {
      if (idx >= res.length) idx = 1;
      res[idx] = b;
      idx += 2;
    }
  }
  return res;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 047. 距离相等的条形码 =====");
console.log("堆:", rearrangeBarcodes([1, 1, 1, 2, 2, 2])); // 期望 [2,1,2,1,2,1] 之类
console.log("奇偶:", rearrangeBarcodesOddEven([1, 1, 1, 1, 2, 2, 3, 3])); // 期望 [1,2,1,3,1,2,1,3] 之类

export {};
