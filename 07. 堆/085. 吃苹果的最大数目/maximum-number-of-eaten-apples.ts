// ============================================================
// 085. 吃苹果的最大数目
// ============================================================
// LeetCode 1705. Maximum Number of Eaten Apples
// 苹果按天成熟并会腐烂，每天最多吃一个，求最多能吃多少个。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：最小堆（按腐烂日期）
function eatenApples(apples: number[], days: number[]): number {
  const heap: Array<{ rot: number; cnt: number }> = [];
  const push = (v: { rot: number; cnt: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].rot < heap[p].rot) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { rot: number; cnt: number } | undefined => {
    if (heap.length === 0) return undefined;
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l].rot < heap[s].rot) s = l;
        if (r < heap.length && heap[r].rot < heap[s].rot) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  let result = 0;
  const n = apples.length;
  let day = 0;
  while (day < n || heap.length > 0) {
    if (day < n && apples[day] > 0) {
      push({ rot: day + days[day], cnt: apples[day] });
    }
    while (heap.length > 0 && heap[0].rot <= day) pop();
    if (heap.length > 0) {
      const top = heap[0];
      top.cnt--;
      result++;
      if (top.cnt === 0) pop();
    }
    day++;
  }
  return result;
}

// 方法2：排序模拟
function eatenApplesSort(apples: number[], days: number[]): number {
  const list: Array<{ rot: number; cnt: number }> = [];
  const n = apples.length;
  for (let i = 0; i < n; i++) {
    if (apples[i] > 0) list.push({ rot: i + days[i], cnt: apples[i] });
  }
  list.sort((a, b) => a.rot - b.rot);
  let result = 0;
  let day = 0;
  let idx = 0;
  while (idx < list.length) {
    while (idx < list.length && list[idx].rot <= day) idx++;
    if (idx >= list.length) break;
    if (list[idx].cnt > 0) {
      list[idx].cnt--;
      result++;
      day++;
    } else {
      idx++;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 085. 吃苹果的最大数目 =====");
console.log("堆:", eatenApples([1, 2, 3, 5, 2], [3, 2, 1, 4, 2])); // 期望 7
console.log("排序:", eatenApplesSort([3, 0, 0, 0, 0, 2], [3, 0, 0, 0, 0, 2])); // 期望 5

export {};
