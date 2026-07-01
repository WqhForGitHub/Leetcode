// ============================================================
// 088. 移除石子的最大得分
// ============================================================
// LeetCode 1753. Maximum Score From Removing Stones
// 三堆石子 a、b、c，每次从两堆各取一个，求最大操作次数。
// 时间复杂度：O(1)，空间复杂度：O(1)

// 方法1：贪心（最大堆模拟）
function maximumScore(a: number, b: number, c: number): number {
  const heap: number[] = [a, b, c];
  // 建最大堆
  const buildHeap = (): void => {
    for (let i = heap.length >> (1 - 1); i >= 0; i--) siftDown(i, heap.length);
  };
  const siftDown = (i: number, n: number): void => {
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && heap[l] > heap[s]) s = l;
      if (r < n && heap[r] > heap[s]) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  buildHeap();
  let result = 0;
  while (heap[1] > 0 || heap[2] > 0) {
    heap[0]--;
    heap[1] = Math.max(heap[1] - 1, 0);
    result++;
    siftDown(0, heap.length);
    // 重新堆化第二大的（简化：每次重建）
    if (heap[0] < heap[1] || heap[0] < heap[2]) {
      [heap[0], heap[1]] = [heap[1], heap[0]];
    }
  }
  return result;
}

// 方法2：数学
function maximumScoreMath(a: number, b: number, c: number): number {
  const sorted = [a, b, c].sort((x, y) => x - y);
  const [x, y, z] = sorted;
  if (x + y <= z) return x + y;
  return Math.floor((x + y + z) / 2);
}

// 方法3：排序模拟
function maximumScoreSort(a: number, b: number, c: number): number {
  const arr = [a, b, c].sort((x, y) => y - x);
  let result = 0;
  while (arr[1] > 0) {
    arr[0]--;
    arr[1]--;
    result++;
    arr.sort((x, y) => y - x);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 088. 移除石子的最大得分 =====");
console.log("数学:", maximumScoreMath(2, 4, 6)); // 期望 6
console.log("数学:", maximumScoreMath(4, 4, 6)); // 期望 7
console.log("排序:", maximumScoreSort(1, 8, 8)); // 期望 8

export {};
