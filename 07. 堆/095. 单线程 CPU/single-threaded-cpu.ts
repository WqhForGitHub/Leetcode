// ============================================================
// 095. 单线程 CPU
// ============================================================
// LeetCode 1834. Single-Threaded CPU
// 按 CPU 时间顺序处理任务，每次选可执行中处理时间最短的任务。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：最小堆（按处理时间）
function getOrder(tasks: number[][]): number[] {
  const indexed = tasks.map((t, i) => ({ enq: t[0], proc: t[1], idx: i }));
  indexed.sort((a, b) => a.enq - b.enq);
  const result: number[] = [];
  const heap: Array<{ proc: number; idx: number; enq: number }> = [];
  const push = (v: { proc: number; idx: number; enq: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].proc < heap[p].proc || (heap[i].proc === heap[p].proc && heap[i].idx < heap[p].idx)) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { proc: number; idx: number; enq: number } => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && (heap[l].proc < heap[s].proc || (heap[l].proc === heap[s].proc && heap[l].idx < heap[s].idx))) s = l;
        if (r < heap.length && (heap[r].proc < heap[s].proc || (heap[r].proc === heap[s].proc && heap[r].idx < heap[s].idx))) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  let time = 0;
  let i = 0;
  const n = indexed.length;
  while (result.length < n) {
    while (i < n && indexed[i].enq <= time) {
      push({ proc: indexed[i].proc, idx: indexed[i].idx, enq: indexed[i].enq });
      i++;
    }
    if (heap.length === 0) {
      time = indexed[i].enq;
      continue;
    }
    const cur = pop();
    result.push(cur.idx);
    time += cur.proc;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 095. 单线程 CPU =====");
console.log("顺序:", getOrder([[1, 2], [2, 4], [3, 2], [4, 1]])); // 期望 [0,2,3,1]
console.log("顺序:", getOrder([[7, 10], [7, 12], [7, 5], [7, 4], [7, 2]])); // 期望 [4,3,2,0,1]

export {};
