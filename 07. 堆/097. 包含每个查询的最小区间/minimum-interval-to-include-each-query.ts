// ============================================================
// 097. 包含每个查询的最小区间
// ============================================================
// LeetCode 1851. Minimum Interval to Include Each Query
// 给定区间和查询，返回包含每个查询的最短区间长度。
// 时间复杂度：O((N+Q) log(N+Q))，空间复杂度：O(N+Q)

// 方法1：离线查询 + 最小堆
function minInterval(intervals: number[][], queries: number[]): number[] {
  const sortedIntervals = intervals.slice().sort((a, b) => a[0] - b[0]);
  const indexedQueries = queries.map((q, i) => ({ q, i })).sort((a, b) => a.q - b.q);
  const result: number[] = new Array(queries.length).fill(-1);
  const heap: Array<{ len: number; right: number }> = [];
  const push = (v: { len: number; right: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].len < heap[p].len) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { len: number; right: number } | undefined => {
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
        if (l < heap.length && heap[l].len < heap[s].len) s = l;
        if (r < heap.length && heap[r].len < heap[s].len) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  let idx = 0;
  for (const { q, i } of indexedQueries) {
    while (idx < sortedIntervals.length && sortedIntervals[idx][0] <= q) {
      push({ len: sortedIntervals[idx][1] - sortedIntervals[idx][0] + 1, right: sortedIntervals[idx][1] });
      idx++;
    }
    while (heap.length > 0 && heap[0].right < q) pop();
    if (heap.length > 0) result[i] = heap[0].len;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 097. 包含每个查询的最小区间 =====");
console.log("结果:", minInterval([[1, 4], [2, 4], [3, 6], [4, 4]], [2, 3, 4, 5])); // 期望 [3,3,1,4]
console.log("结果:", minInterval([[2, 3], [2, 5], [1, 8], [20, 25]], [2, 19, 5, 22])); // 期望 [2,-1,4,6]

export {};
