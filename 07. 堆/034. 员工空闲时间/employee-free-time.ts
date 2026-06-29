// ============================================================
// 034. 员工空闲时间
// ============================================================
// LeetCode 759. Employee Free Time
// 给定员工的日程列表，返回所有员工的共同空闲时间。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

interface Interval {
  start: number;
  end: number;
}

// 方法1：最小堆合并所有区间
function employeeFreeTime(schedule: Interval[][]): Interval[] {
  const all: Interval[] = [];
  for (const emp of schedule) for (const iv of emp) all.push(iv);
  all.sort((a, b) => a.start - b.start);
  const merged: Interval[] = [];
  for (const iv of all) {
    if (merged.length === 0 || merged[merged.length - 1].end < iv.start) {
      merged.push({ ...iv });
    } else {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, iv.end);
    }
  }
  const result: Interval[] = [];
  for (let i = 1; i < merged.length; i++) {
    if (merged[i - 1].end < merged[i].start) {
      result.push({ start: merged[i - 1].end, end: merged[i].start });
    }
  }
  return result;
}

// 方法2：最小堆多路归并
function employeeFreeTimeHeap(schedule: Interval[][]): Interval[] {
  const heap: Array<{ iv: Interval; emp: number; idx: number }> = [];
  const less = (a: number, b: number): boolean => heap[a].iv.start < heap[b].iv.start;
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
  for (let e = 0; e < schedule.length; e++) {
    if (schedule[e].length > 0) {
      heap.push({ iv: schedule[e][0], emp: e, idx: 0 });
      siftUp(heap.length - 1);
    }
  }
  const result: Interval[] = [];
  let prevEnd = heap.length > 0 ? heap[0].iv.end : -Infinity;
  while (heap.length > 0) {
    const top = heap[0];
    if (top.iv.start > prevEnd) {
      result.push({ start: prevEnd, end: top.iv.start });
    }
    prevEnd = Math.max(prevEnd, top.iv.end);
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      siftDown(0);
    }
    if (top.idx + 1 < schedule[top.emp].length) {
      heap.push({ iv: schedule[top.emp][top.idx + 1], emp: top.emp, idx: top.idx + 1 });
      siftUp(heap.length - 1);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 034. 员工空闲时间 =====");
console.log("归并:", JSON.stringify(employeeFreeTime([[[1, 2], [5, 6]], [[1, 3]], [[4, 10]]].map((e) => e.map((x) => ({ start: x[0], end: x[1] }))))));
// 期望 [{"start":3,"end":4}]

export {};
