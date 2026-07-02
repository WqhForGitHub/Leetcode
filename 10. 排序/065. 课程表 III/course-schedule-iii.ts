// ============================================================
// 065. 课程表 III
// ============================================================
// LeetCode 630. Course Schedule III
// 有 n 门课，每门课有 duration（耗时）和 lastDay（最后完成日）。
// 课程从 t=0 开始，必须在 lastDay 之前（含）完成，一次只能上一门课。
// 求最多能完成多少门课。

// 方法1：按截止时间排序 + 最大堆维护已选课程耗时（推荐，O(n log n) 时间）
// 思路：
//   1. 将课程按 lastDay 升序排序，按顺序尝试选课。
//   2. 维护一个最大堆存放已选课程的 duration，以及当前总耗时 total。
//   3. 若加入当前课程后 total <= lastDay，直接入堆。
//   4. 否则，若当前课程 duration 小于堆顶（之前选的最长课程），
//      则弹出堆顶并替换为当前课程（用更长课程换更短课程，给后续留更多时间）。
//   5. 最终堆的大小即为答案。
class MaxHeap {
  private data: number[] = [];

  size(): number {
    return this.data.length;
  }

  peek(): number {
    return this.data[0];
  }

  push(val: number): void {
    this.data.push(val);
    this.siftUp(this.data.length - 1);
  }

  pop(): number {
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.data[parent] >= this.data[i]) break;
      const tmp = this.data[parent];
      this.data[parent] = this.data[i];
      this.data[i] = tmp;
      i = parent;
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.data[left] > this.data[largest]) largest = left;
      if (right < n && this.data[right] > this.data[largest]) largest = right;
      if (largest === i) break;
      const tmp = this.data[largest];
      this.data[largest] = this.data[i];
      this.data[i] = tmp;
      i = largest;
    }
  }
}

function scheduleCourse(courses: number[][]): number {
  // 按 lastDay 升序排序
  courses.sort((a, b) => a[1] - b[1]);

  const heap = new MaxHeap();
  let total = 0;

  for (const [duration, lastDay] of courses) {
    if (total + duration <= lastDay) {
      // 可以直接选这门课
      heap.push(duration);
      total += duration;
    } else if (heap.size() > 0 && duration < heap.peek()) {
      // 用更短的课程替换堆顶最长的课程，腾出时间
      const removed = heap.pop();
      heap.push(duration);
      total = total - removed + duration;
    }
    // 否则丢弃当前课程
  }

  return heap.size();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 065. 课程表 III =====");
console.log(
  "[[100,200],[200,1300],[1000,1250],[2000,3200]]:",
  scheduleCourse([
    [100, 200],
    [200, 1300],
    [1000, 1250],
    [2000, 3200],
  ]),
); // 期望 3
console.log("[[1,2]]:", scheduleCourse([[1, 2]])); // 期望 1
console.log(
  "[[3,2],[4,3]]:",
  scheduleCourse([
    [3, 2],
    [4, 3],
  ]),
); // 期望 0
console.log(
  "[[5,5],[4,6],[2,6]]:",
  scheduleCourse([
    [5, 5],
    [4, 6],
    [2, 6],
  ]),
); // 期望 2

export {};
