// ============================================================
// 122. 装满杯子需要的最短总时长
// ============================================================
// LeetCode 2335. Minimum Amount of Time to Fill Cups
// 给定冷水和热水需求量，每秒可装2杯不同类型或1杯同一类型，求最少时间。
// 时间复杂度：O(1)，空间复杂度：O(1)

// 方法1：贪心（数学）
function fillCups(amount: number[]): number {
  const [a, b, c] = amount;
  const max = Math.max(a, b, c);
  const sum = a + b + c;
  if (max >= sum - max) return max;
  return Math.ceil(sum / 2);
}

// 方法2：最大堆模拟
function fillCupsHeap(amount: number[]): number {
  const heap: number[] = amount.filter(x => x > 0);
  const siftDown = (i: number, len: number): void => {
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l] > heap[s]) s = l;
      if (r < len && heap[r] > heap[s]) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(i, heap.length);
  let time = 0;
  while (heap.length >= 2) {
    const first = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown(0, heap.length);
    const second = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown(0, heap.length);
    if (first > 1) { heap.push(first - 1); }
    if (second > 1) { heap.push(second - 1); }
    for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(i, heap.length);
    time++;
  }
  return time + (heap.length > 0 ? heap[0] : 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 122. 装满杯子需要的最短总时长 =====");
console.log("贪心:", fillCups([1, 4, 2])); // 期望 4
console.log("堆:", fillCupsHeap([5, 4, 4])); // 期望 7

export {};
