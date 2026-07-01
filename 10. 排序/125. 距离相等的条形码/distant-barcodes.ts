// ============================================================
// 125. 距离相等的条形码
// ============================================================
// LeetCode 1054. Distant Barcodes
// 重排条形码数组，使任意两个相邻条形码不相等。题目保证存在解。

// 方法1：计数 + 大顶堆 + 两两放置（时间 O(n log k)，k 为不同条形码数）
// 每次取出频率最高的两个条形码放入结果，频率减一后若仍 >0 放回堆。
function rearrangeBarcodes(barcodes: number[]): number[] {
  const n = barcodes.length;
  if (n <= 1) return [...barcodes];

  const freq = new Map<number, number>();
  for (const b of barcodes) freq.set(b, (freq.get(b) ?? 0) + 1);

  // 大顶堆（按频率）
  const heap: Array<[number, number]> = [...freq.entries()];
  const swap = (i: number, j: number) => {
    [heap[i], heap[j]] = [heap[j], heap[i]];
  };
  const less = (i: number, j: number) => heap[i][1] < heap[j][1];
  const siftDown = (i: number, size: number) => {
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let largest = i;
      if (l < size && less(largest, l)) largest = l;
      if (r < size && less(largest, r)) largest = r;
      if (largest === i) break;
      swap(i, largest);
      i = largest;
    }
  };
  const siftUp = (i: number) => {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (less(parent, i)) {
        swap(i, parent);
        i = parent;
      } else break;
    }
  };
  const pop = (): [number, number] => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      siftDown(0, heap.length);
    }
    return top;
  };
  const push = (item: [number, number]) => {
    heap.push(item);
    siftUp(heap.length - 1);
  };

  for (let i = (heap.length >> 1) - 1; i >= 0; i--) siftDown(i, heap.length);

  const result: number[] = [];
  while (heap.length >= 2) {
    const [b1, f1] = pop();
    const [b2, f2] = pop();
    result.push(b1, b2);
    if (f1 > 1) push([b1, f1 - 1]);
    if (f2 > 1) push([b2, f2 - 1]);
  }
  if (heap.length === 1) result.push(pop()[0]);
  return result;
}

// 方法2：计数 + 奇偶位放置（时间 O(n)，空间 O(n)）
// 先把出现次数最多的条形码放到偶数下标（0,2,4,...），其频率 <= ceil(n/2)，
// 恰好能放入偶数位；再把其余条形码按"先偶后奇、步长 2"填入剩余位置。
function rearrangeBarcodes2(barcodes: number[]): number[] {
  const n = barcodes.length;
  if (n <= 1) return [...barcodes];

  const freq = new Map<number, number>();
  for (const b of barcodes) freq.set(b, (freq.get(b) ?? 0) + 1);

  // 找出出现次数最多的条形码
  let maxBar = barcodes[0];
  let maxFreq = 0;
  for (const [b, f] of freq) {
    if (f > maxFreq) {
      maxFreq = f;
      maxBar = b;
    }
  }

  const result = new Array<number>(n).fill(0);
  let idx = 0;
  // 先放最多的到偶数位
  for (let i = 0; i < maxFreq; i++) {
    result[idx] = maxBar;
    idx += 2;
    if (idx >= n) idx = 1;
  }
  freq.delete(maxBar);
  // 再放其余
  for (const [b, f] of freq) {
    for (let i = 0; i < f; i++) {
      result[idx] = b;
      idx += 2;
      if (idx >= n) idx = 1;
    }
  }
  return result;
}

// 校验：相邻不相等且与原数组同元素
function isValid(orig: number[], res: number[]): boolean {
  if (orig.length !== res.length) return false;
  for (let i = 1; i < res.length; i++) if (res[i] === res[i - 1]) return false;
  const a = [...orig].sort((x, y) => x - y);
  const b = [...res].sort((x, y) => x - y);
  return a.every((v, i) => v === b[i]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 125. 距离相等的条形码 =====");
const t1 = [1, 1, 1, 2, 2, 2];
const t2 = [1, 1, 1, 1, 2, 2, 3, 3];
console.log("方法1:", rearrangeBarcodes(t1), "有效:", isValid(t1, rearrangeBarcodes(t1))); // 期望: 有效 true
console.log("方法1:", rearrangeBarcodes(t2), "有效:", isValid(t2, rearrangeBarcodes(t2))); // 期望: 有效 true
console.log("方法2:", rearrangeBarcodes2(t1), "有效:", isValid(t1, rearrangeBarcodes2(t1))); // 期望: 有效 true
console.log("方法2:", rearrangeBarcodes2(t2), "有效:", isValid(t2, rearrangeBarcodes2(t2))); // 期望: 有效 true

export {};
