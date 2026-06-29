// ============================================================
// 056. 矩阵中 1 的最大数量
// ============================================================
// LeetCode 1183. Maximum Number of Ones
// 在 width x height 矩阵中放置 1，任意 sideLength x sideLength 子矩阵中 1 不超过 maxOnes，求最多放多少个 1。
// 时间复杂度：O(sideLength^2 log(sideLength^2))，空间复杂度：O(sideLength^2)

// 方法1：最大堆，按格子被覆盖次数排序
function maximumNumberOfOnes(width: number, height: number, sideLength: number, maxOnes: number): number {
  const counts: number[] = [];
  for (let i = 0; i < sideLength; i++) {
    for (let j = 0; j < sideLength; j++) {
      const r = Math.floor((height - i - 1) / sideLength) + 1;
      const c = Math.floor((width - j - 1) / sideLength) + 1;
      counts.push(r * c);
    }
  }
  counts.sort((a, b) => b - a);
  let result = 0;
  for (let i = 0; i < maxOnes; i++) result += counts[i];
  return result;
}

// 方法2：最大堆（显式堆）
function maximumNumberOfOnesHeap(width: number, height: number, sideLength: number, maxOnes: number): number {
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
  for (let i = 0; i < sideLength; i++) {
    for (let j = 0; j < sideLength; j++) {
      const r = Math.floor((height - i - 1) / sideLength) + 1;
      const c = Math.floor((width - j - 1) / sideLength) + 1;
      pushMax(r * c);
    }
  }
  let result = 0;
  for (let i = 0; i < maxOnes && heap.length > 0; i++) {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let j = 0;
      while (true) {
        let s = j;
        const l = 2 * j + 1;
        const r = 2 * j + 2;
        if (l < heap.length && heap[l] > heap[s]) s = l;
        if (r < heap.length && heap[r] > heap[s]) s = r;
        if (s !== j) {
          [heap[j], heap[s]] = [heap[s], heap[j]];
          j = s;
        } else break;
      }
    }
    result += top;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 056. 矩阵中 1 的最大数量 =====");
console.log("排序:", maximumNumberOfOnes(3, 3, 2, 1)); // 期望 4
console.log("堆:", maximumNumberOfOnesHeap(3, 3, 2, 1)); // 期望 4

export {};
