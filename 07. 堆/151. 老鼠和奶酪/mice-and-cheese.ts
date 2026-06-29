// ============================================================
// 151. 老鼠和奶酪
// ============================================================
// LeetCode 2611. Mice and Cheese
// 有 n 块奶酪，第1只老鼠吃 reward1[i]，第2只吃 reward2[i]。
// 第1只老鼠只能吃 k 块，求最大总奖励。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：排序 + 贪心
function miceAndCheese(reward1: number[], reward2: number[], k: number): number {
  const n = reward1.length;
  const diff: Array<{ d: number; idx: number }> = [];
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += reward2[i];
    diff.push({ d: reward1[i] - reward2[i], idx: i });
  }
  diff.sort((a, b) => b.d - a.d);
  for (let i = 0; i < k; i++) {
    total += diff[i].d;
  }
  return total;
}

// 方法2：最小堆
function miceAndCheeseHeap(reward1: number[], reward2: number[], k: number): number {
  const n = reward1.length;
  let total = 0;
  const heap: number[] = [];
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] < heap[p]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
    const len = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l] < heap[s]) s = l;
      if (r < len && heap[r] < heap[s]) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  for (let i = 0; i < n; i++) {
    total += reward2[i];
    const d = reward1[i] - reward2[i];
    heap.push(d);
    siftUp(heap.length - 1);
    if (heap.length > k) {
      heap[0] = heap[heap.length - 1];
      heap.pop();
      if (heap.length > 0) siftDown();
    }
  }
  return total + heap.reduce((a, b) => a + b, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 151. 老鼠和奶酪 =====");
console.log("排序:", miceAndCheese([1, 1, 3, 4], [4, 4, 1, 1], 2)); // 期望 15
console.log("堆:", miceAndCheeseHeap([1, 1], [1, 1], 2)); // 期望 2

export {};
