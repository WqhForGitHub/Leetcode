// ============================================================
// 046. 最后一块石头的重量
// ============================================================
// LeetCode 1046. Last Stone Weight
// 每次选最重的两块石头相撞，求最后剩下的石头重量。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：最大堆（推荐）
function lastStoneWeight(stones: number[]): number {
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
  for (const s of stones) pushMax(s);
  while (heap.length > 1) {
    const y = popMax();
    const x = popMax();
    if (x !== y) pushMax(y - x);
  }
  return heap.length === 0 ? 0 : heap[0];
}

// 方法2：排序模拟
function lastStoneWeightSort(stones: number[]): number {
  const arr = stones.slice();
  while (arr.length > 1) {
    arr.sort((a, b) => b - a);
    const y = arr.shift()!;
    const x = arr.shift()!;
    if (x !== y) arr.push(y - x);
  }
  return arr.length === 0 ? 0 : arr[0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 046. 最后一块石头的重量 =====");
console.log("最大堆:", lastStoneWeight([2, 7, 4, 1, 8, 1])); // 期望 1
console.log("排序:", lastStoneWeightSort([1])); // 期望 1

export {};
