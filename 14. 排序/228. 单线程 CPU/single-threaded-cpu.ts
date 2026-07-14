// ============================================================
// 228. 单线程 CPU
// ============================================================
// LeetCode 1834. Single-Threaded CPU
// 给定 tasks[i] = [enqueueTime, processingTime]（下标从 0 开始），CPU 在时刻 0 启动，
// 每次只能处理一个任务，在所有已入队任务中选择 processingTime 最小（相同则下标最小）
// 的任务处理。返回任务的处理顺序下标。

// 方法1：按入队时间排序 + 最小堆模拟（O(n log n)）
// 按入队时间排序任务，使用最小堆（键为 [processingTime, idx]）模拟 CPU 调度，
// 堆空时把时间推进到下一个任务的入队时刻。
function getOrder(tasks: number[][]): number[] {
  const n = tasks.length;
  const indexed = tasks.map((t, i) => ({
    enqueue: t[0],
    process: t[1],
    idx: i,
  }));
  indexed.sort((a, b) => a.enqueue - b.enqueue || a.idx - b.idx);

  const result: number[] = [];
  const heap: number[][] = []; // 元素: [processTime, idx]
  const cmp = (a: number[], b: number[]): number => a[0] - b[0] || a[1] - b[1];

  const push = (entry: number[]): void => {
    heap.push(entry);
    let k = heap.length - 1;
    while (k > 0) {
      const p = (k - 1) >> 1;
      if (cmp(heap[k], heap[p]) < 0) {
        [heap[k], heap[p]] = [heap[p], heap[k]];
        k = p;
      } else {
        break;
      }
    }
  };

  const pop = (): number[] => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let k = 0;
      const len = heap.length;
      while (true) {
        let s = k;
        const l = 2 * k + 1;
        const r = 2 * k + 2;
        if (l < len && cmp(heap[l], heap[s]) < 0) s = l;
        if (r < len && cmp(heap[r], heap[s]) < 0) s = r;
        if (s !== k) {
          [heap[k], heap[s]] = [heap[s], heap[k]];
          k = s;
        } else {
          break;
        }
      }
    }
    return top;
  };

  let time = 0;
  let ptr = 0;
  while (result.length < n) {
    while (ptr < n && indexed[ptr].enqueue <= time) {
      push([indexed[ptr].process, indexed[ptr].idx]);
      ptr++;
    }
    if (heap.length === 0) {
      time = indexed[ptr].enqueue;
      continue;
    }
    const top = pop();
    result.push(top[1]);
    time += top[0];
  }
  return result;
}

// 方法2：排序 + 优先队列（带时间推进）（O(n log n)）
// 思路与方法1一致，使用一个独立的 MinHeap 类作为优先队列，结构更清晰。
class MinHeap {
  private data: { proc: number; idx: number }[] = [];

  size(): number {
    return this.data.length;
  }

  push(item: { proc: number; idx: number }): void {
    this.data.push(item);
    let k = this.data.length - 1;
    while (k > 0) {
      const p = (k - 1) >> 1;
      if (this.less(this.data[k], this.data[p])) {
        [this.data[k], this.data[p]] = [this.data[p], this.data[k]];
        k = p;
      } else {
        break;
      }
    }
  }

  pop(): { proc: number; idx: number } {
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      let k = 0;
      const len = this.data.length;
      while (true) {
        let s = k;
        const l = 2 * k + 1;
        const r = 2 * k + 2;
        if (l < len && this.less(this.data[l], this.data[s])) s = l;
        if (r < len && this.less(this.data[r], this.data[s])) s = r;
        if (s !== k) {
          [this.data[k], this.data[s]] = [this.data[s], this.data[k]];
          k = s;
        } else {
          break;
        }
      }
    }
    return top;
  }

  private less(a: { proc: number; idx: number }, b: { proc: number; idx: number }): boolean {
    return a.proc !== b.proc ? a.proc < b.proc : a.idx < b.idx;
  }
}

function getOrder2(tasks: number[][]): number[] {
  const n = tasks.length;
  const arr = tasks.map((t, i) => ({
    enqueue: t[0],
    proc: t[1],
    idx: i,
  }));
  arr.sort((a, b) => a.enqueue - b.enqueue || a.idx - b.idx);

  const result: number[] = [];
  const pq = new MinHeap();
  let time = 0;
  let ptr = 0;
  while (result.length < n) {
    while (ptr < n && arr[ptr].enqueue <= time) {
      pq.push({ proc: arr[ptr].proc, idx: arr[ptr].idx });
      ptr++;
    }
    if (pq.size() === 0) {
      time = arr[ptr].enqueue;
      continue;
    }
    const top = pq.pop();
    result.push(top.idx);
    time += top.proc;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 228. 单线程 CPU =====");
console.log(
  "方法1 [[1,2],[2,4],[3,2],[4,1]]:",
  getOrder([
    [1, 2],
    [2, 4],
    [3, 2],
    [4, 1],
  ]),
);
console.log(
  "方法2 [[1,2],[2,4],[3,2],[4,1]]:",
  getOrder2([
    [1, 2],
    [2, 4],
    [3, 2],
    [4, 1],
  ]),
);
console.log(
  "方法1 [[7,10],[7,12],[7,5],[7,4],[7,2]]:",
  getOrder([
    [7, 10],
    [7, 12],
    [7, 5],
    [7, 4],
    [7, 2],
  ]),
);
console.log(
  "方法2 [[7,10],[7,12],[7,5],[7,4],[7,2]]:",
  getOrder2([
    [7, 10],
    [7, 12],
    [7, 5],
    [7, 4],
    [7, 2],
  ]),
);

export {};
