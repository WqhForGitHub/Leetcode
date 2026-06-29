// ============================================================
// 065. 最大的团队表现值
// ============================================================
// LeetCode 1383. Maximum Performance of a Team
// 选 k 个工程师，团队表现为 min(speed) * sum(speed)，求最大值。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：最大堆 + 按 efficiency 降序排序
function maxPerformance(n: number, speed: number[], efficiency: number[], k: number): number {
  const MOD = 1000000007;
  const engineers: Array<{ e: number; s: number }> = [];
  for (let i = 0; i < n; i++) engineers.push({ e: efficiency[i], s: speed[i] });
  engineers.sort((a, b) => b.e - a.e);
  // 最小堆维护速度最快的 k 个
  const heap: number[] = [];
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
  let sum = 0;
  let result = 0;
  for (const eng of engineers) {
    if (heap.length === k) sum -= popMin();
    pushMin(eng.s);
    sum += eng.s;
    result = Math.max(result, sum * eng.e);
  }
  return result % MOD;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 065. 最大的团队表现值 =====");
console.log("最大表现:", maxPerformance(6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 2)); // 期望 60
console.log("最大表现:", maxPerformance(6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 3)); // 期望 68
console.log("最大表现:", maxPerformance(6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 4)); // 期望 72

export {};
