// ============================================================
// 165. 最多可以参加的会议数目
// ============================================================
// LeetCode 1353. Maximum Number of Events That Can Be Attended
// events[i] = [startDay, endDay]，每天最多参加一个会议，可在 [start, end] 内任选一天
// 参加该会议。求最多能参加的会议数。

// 方法1：按开始时间排序 + 最小堆贪心（O(n log n + D log n)）
function maxEvents1(events: number[][]): number {
  events.sort((a, b) => a[0] - b[0]);
  const n = events.length;
  const heap: number[] = []; // 最小堆，存储结束日
  let maxDay = 0;
  for (const e of events) if (e[1] > maxDay) maxDay = e[1];

  const push = (v: number) => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p] > heap[i]) {
        [heap[p], heap[i]] = [heap[i], heap[p]];
        i = p;
      } else break;
    }
  };
  const pop = (): number => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      const m = heap.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let s = i;
        if (l < m && heap[l] < heap[s]) s = l;
        if (r < m && heap[r] < heap[s]) s = r;
        if (s === i) break;
        [heap[s], heap[i]] = [heap[i], heap[s]];
        i = s;
      }
    }
    return top;
  };

  let ans = 0;
  let i = 0;
  for (let day = 1; day <= maxDay; day++) {
    // 把所有在 day 开始的会议加入堆
    while (i < n && events[i][0] === day) {
      push(events[i][1]);
      i++;
    }
    // 丢弃已过期会议
    while (heap.length > 0 && heap[0] < day) pop();
    // 贪心：参加结束最早的可参加会议
    if (heap.length > 0) {
      pop();
      ans++;
    }
  }
  return ans;
}

// 方法2：按结束时间排序 + 贪心占用最晚可用日（O(n * D)）
function maxEvents2(events: number[][]): number {
  events.sort((a, b) => a[1] - b[1]);
  const used = new Set<number>();
  let ans = 0;
  for (const [s, e] of events) {
    // 尽量晚地参加，给前面对其他会议留机会
    for (let d = s; d <= e; d++) {
      if (!used.has(d)) {
        used.add(d);
        ans++;
        break;
      }
    }
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 165. 最多可以参加的会议数目 =====");
console.log(
  "方法1 [[1,2],[2,3],[3,4]]:",
  maxEvents1([
    [1, 2],
    [2, 3],
    [3, 4],
  ]),
); // 3
console.log(
  "方法2 [[1,2],[2,3],[3,4]]:",
  maxEvents2([
    [1, 2],
    [2, 3],
    [3, 4],
  ]),
); // 3
console.log(
  "方法1 [[1,4],[4,4],[2,2],[3,4],[1,1]]:",
  maxEvents1([
    [1, 4],
    [4, 4],
    [2, 2],
    [3, 4],
    [1, 1],
  ]),
); // 4
console.log(
  "方法2 [[1,4],[4,4],[2,2],[3,4],[1,1]]:",
  maxEvents2([
    [1, 4],
    [4, 4],
    [2, 2],
    [3, 4],
    [1, 1],
  ]),
); // 4

export {};
