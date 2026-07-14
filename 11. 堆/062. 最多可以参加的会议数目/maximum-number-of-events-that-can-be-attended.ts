// ============================================================
// 062. 最多可以参加的会议数目
// ============================================================
// LeetCode 1353. Maximum Number of Events That Can Be Attended
// 每个会议有开始和结束时间，每天只能参加一个，求最多参加数。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：最小堆按结束时间 + 贪心（推荐）
function maxEvents(events: number[][]): number {
  events.sort((a, b) => a[0] - b[0]);
  const heap: number[] = []; // 最小堆存结束时间
  const pushMin = (v: number): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] < heap[p]) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const popMin = (): number => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l] < heap[s]) s = l;
        if (r < heap.length && heap[r] < heap[s]) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  let i = 0;
  let result = 0;
  let maxDay = 0;
  for (const e of events) maxDay = Math.max(maxDay, e[1]);
  for (let day = 1; day <= maxDay; day++) {
    while (i < events.length && events[i][0] === day) {
      pushMin(events[i][1]);
      i++;
    }
    while (heap.length > 0 && heap[0] < day) popMin();
    if (heap.length > 0) {
      popMin();
      result++;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 062. 最多可以参加的会议数目 =====");
console.log(
  "最多会议:",
  maxEvents([
    [1, 2],
    [2, 3],
    [3, 4],
  ]),
); // 期望 3
console.log(
  "最多会议:",
  maxEvents([
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 2],
  ]),
); // 期望 4

export {};
