// ============================================================
// 023. 任务调度器
// ============================================================
// LeetCode 621. Task Scheduler
// 给定任务数组和冷却时间 n，相同任务之间需间隔 n 个时间单位，求最少时间。
// 时间复杂度：O(N)，空间复杂度：O(1)

// 方法1：贪心 + 计数（推荐）
function leastInterval(tasks: string[], n: number): number {
  const freq = new Array(26).fill(0);
  for (const t of tasks) freq[t.charCodeAt(0) - 65]++;
  const maxFreq = Math.max(...freq);
  const maxCount = freq.filter((f) => f === maxFreq).length;
  return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);
}

// 方法2：最大堆模拟
function leastIntervalHeap(tasks: string[], n: number): number {
  const freq = new Array(26).fill(0);
  for (const t of tasks) freq[t.charCodeAt(0) - 65]++;
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
  for (const f of freq) if (f > 0) pushMax(f);
  let time = 0;
  while (heap.length > 0) {
    const temp: number[] = [];
    for (let i = 0; i <= n; i++) {
      if (heap.length === 0 && temp.length === 0) break;
      time++;
      if (heap.length > 0) {
        const top = popMax();
        if (top > 1) temp.push(top - 1);
      }
    }
    for (const t of temp) pushMax(t);
  }
  return time;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 023. 任务调度器 =====");
console.log("贪心:", leastInterval(["A", "A", "A", "B", "B", "B"], 2)); // 期望 8
console.log("堆:", leastIntervalHeap(["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], 2)); // 期望 16

export {};
