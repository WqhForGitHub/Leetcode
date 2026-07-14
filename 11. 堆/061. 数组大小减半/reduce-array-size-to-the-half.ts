// ============================================================
// 061. 数组大小减半
// ============================================================
// LeetCode 1338. Reduce Array Size to The Half
// 选择一个整数集合，从数组中删除这些数，使数组大小至少减半，求最小集合大小。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：最大堆（按频率）
function minSetSize(arr: number[]): number {
  const freq = new Map<number, number>();
  for (const n of arr) freq.set(n, (freq.get(n) ?? 0) + 1);
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
  for (const f of freq.values()) pushMax(f);
  const target = arr.length >> 1;
  let sum = 0;
  let count = 0;
  while (sum < target) {
    sum += popMax();
    count++;
  }
  return count;
}

// 方法2：排序
function minSetSizeSort(arr: number[]): number {
  const freq = new Map<number, number>();
  for (const n of arr) freq.set(n, (freq.get(n) ?? 0) + 1);
  const counts = Array.from(freq.values()).sort((a, b) => b - a);
  const target = arr.length >> 1;
  let sum = 0;
  for (let i = 0; i < counts.length; i++) {
    sum += counts[i];
    if (sum >= target) return i + 1;
  }
  return counts.length;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 061. 数组大小减半 =====");
console.log("堆:", minSetSize([3, 3, 3, 3, 5, 5, 5, 2, 2, 7])); // 期望 2
console.log("排序:", minSetSizeSort([7, 7, 7, 7, 7, 7])); // 期望 1

export {};
