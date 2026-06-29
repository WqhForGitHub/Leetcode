// ============================================================
// 091. 最大平均通过率
// ============================================================
// LeetCode 1792. Maximum Average Pass Ratio
// 每次给一个班加一个学生，求最大平均通过率。
// 时间复杂度：O((N+extraStudents) log N)，空间复杂度：O(N)

// 方法1：最大堆（按边际收益）
function maxAverageRatio(classes: number[][], extraStudents: number): number {
  const gain = (pass: number, total: number): number => {
    return (pass + 1) / (total + 1) - pass / total;
  };
  const heap: Array<{ gain: number; pass: number; total: number }> = [];
  const less = (a: number, b: number): boolean => heap[a].gain > heap[b].gain;
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (less(i, p)) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const siftDown = (i: number): void => {
    const n = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && less(l, s)) s = l;
      if (r < n && less(r, s)) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  for (const [pass, total] of classes) {
    heap.push({ gain: gain(pass, total), pass, total });
    siftUp(heap.length - 1);
  }
  for (let i = 0; i < extraStudents; i++) {
    const top = heap[0];
    top.pass++;
    top.total++;
    top.gain = gain(top.pass, top.total);
    siftDown(0);
  }
  let sum = 0;
  for (const { pass, total } of heap) sum += pass / total;
  return sum / heap.length;
}

// 方法2：每次排序（低效）
function maxAverageRatioSort(classes: number[][], extraStudents: number): number {
  const gain = (pass: number, total: number): number => {
    return (pass + 1) / (total + 1) - pass / total;
  };
  const arr = classes.map(([p, t]) => [p, t]);
  for (let i = 0; i < extraStudents; i++) {
    arr.sort((a, b) => gain(b[0], b[1]) - gain(a[0], a[1]));
    arr[0][0]++;
    arr[0][1]++;
  }
  let sum = 0;
  for (const [p, t] of arr) sum += p / t;
  return sum / arr.length;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 091. 最大平均通过率 =====");
console.log("堆:", maxAverageRatio([[1, 2], [3, 5], [2, 2]], 2)); // 期望 0.78333
console.log("堆:", maxAverageRatio([[2, 4], [3, 9], [4, 5], [2, 10]], 4)); // 期望 0.53485

export {};
