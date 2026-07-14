// ============================================================
// 024. 课程表 III
// ============================================================
// LeetCode 630. Course Schedule III
// 每门课有持续时间和截止时间，求最多能上多少门课。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：贪心 + 最大堆（按截止时间排序）（推荐）
function scheduleCourse(courses: number[][]): number {
  courses.sort((a, b) => a[1] - b[1]);
  const heap: number[] = []; // 最大堆存课程时长
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
  let time = 0;
  for (const [dur, end] of courses) {
    if (time + dur <= end) {
      time += dur;
      pushMax(dur);
    } else if (heap.length > 0 && heap[0] > dur) {
      time += dur - popMax();
      pushMax(dur);
    }
  }
  return heap.length;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 024. 课程表 III =====");
console.log(
  "最多课程:",
  scheduleCourse([
    [100, 200],
    [200, 1300],
    [1000, 1250],
    [2000, 3200],
  ]),
); // 期望 3

export {};
