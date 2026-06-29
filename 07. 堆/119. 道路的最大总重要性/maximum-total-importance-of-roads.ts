// ============================================================
// 119. 道路的最大总重要性
// ============================================================
// LeetCode 2285. Maximum Total Importance of Roads
// 给每个城市赋值 1 到 n，使道路重要性（两端值之和）最大。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：按度数排序赋值
function maximumImportance(n: number, roads: number[][]): number {
  const degree: number[] = new Array(n).fill(0);
  for (const [u, v] of roads) {
    degree[u]++;
    degree[v]++;
  }
  degree.sort((a, b) => a - b);
  let result = 0;
  for (let i = 0; i < n; i++) {
    result += degree[i] * (i + 1);
  }
  return result;
}

// 方法2：最大堆（按度数）
function maximumImportanceHeap(n: number, roads: number[][]): number {
  const degree: number[] = new Array(n).fill(0);
  for (const [u, v] of roads) {
    degree[u]++;
    degree[v]++;
  }
  // 最大堆按度数
  const heap: number[] = degree.slice();
  const siftDown = (i: number, size: number): void => {
    while (true) {
      let s = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < size && heap[l] > heap[s]) s = l;
      if (r < size && heap[r] > heap[s]) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  for (let i = (heap.length >> 1) - 1; i >= 0; i--) siftDown(i, heap.length);
  let result = 0;
  let val = n;
  while (heap.length > 0) {
    const top = heap[0];
    result += top * val;
    val--;
    heap[0] = heap[heap.length - 1];
    heap.pop();
    siftDown(0, heap.length);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 119. 道路的最大总重要性 =====");
console.log(
  "排序:",
  maximumImportance(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 2],
    [1, 3],
    [2, 4],
    [3, 4],
  ]),
); // 期望 43
console.log(
  "堆:",
  maximumImportanceHeap(5, [
    [0, 3],
    [2, 4],
    [1, 3],
  ]),
); // 期望 20

export {};
