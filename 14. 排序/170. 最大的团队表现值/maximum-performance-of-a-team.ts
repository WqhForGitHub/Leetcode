// ============================================================
// 170. 最大的团队表现值
// ============================================================
// LeetCode 1383. Maximum Performance of a Team
// n 个工程师，speed[i]、efficiency[i]。选至多 k 个，团队表现值 = sum(speed) * min(efficiency)。
// 返回最大表现值 mod 1e9+7。

// 方法1：按 efficiency 降序 + speed 最小堆（O(n log n)）
function maxPerformance1(n: number, speed: number[], efficiency: number[], k: number): number {
  const MOD = 1000000007n;
  const idx = speed.map((_, i) => i).sort((a, b) => efficiency[b] - efficiency[a]);
  const heap: number[] = []; // speed 最小堆
  let sum = 0n;
  let ans = 0n;

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

  for (const i of idx) {
    // 维护堆大小 <= k：满则先弹出最小 speed
    if (heap.length === k) sum -= BigInt(pop());
    push(speed[i]);
    sum += BigInt(speed[i]);
    // 当前 efficiency 为团队最小值时的表现
    const perf = sum * BigInt(efficiency[i]);
    if (perf > ans) ans = perf;
  }
  return Number(ans % MOD);
}

// 方法2：组合数组排序 + 优先队列（O(n log n)）
function maxPerformance2(n: number, speed: number[], efficiency: number[], k: number): number {
  const MOD = 1000000007n;
  const engineers = speed.map((s, i) => ({ s, e: efficiency[i] }));
  engineers.sort((a, b) => b.e - a.e);
  const pq: number[] = []; // speed 最小堆
  let sum = 0n;
  let ans = 0n;

  const push = (v: number) => {
    pq.push(v);
    let i = pq.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (pq[p] > pq[i]) {
        [pq[p], pq[i]] = [pq[i], pq[p]];
        i = p;
      } else break;
    }
  };
  const pop = (): number => {
    const top = pq[0];
    const last = pq.pop()!;
    if (pq.length > 0) {
      pq[0] = last;
      let i = 0;
      const m = pq.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let s = i;
        if (l < m && pq[l] < pq[s]) s = l;
        if (r < m && pq[r] < pq[s]) s = r;
        if (s === i) break;
        [pq[s], pq[i]] = [pq[i], pq[s]];
        i = s;
      }
    }
    return top;
  };

  for (const { s, e } of engineers) {
    if (pq.length === k) sum -= BigInt(pop());
    push(s);
    sum += BigInt(s);
    const perf = sum * BigInt(e);
    if (perf > ans) ans = perf;
  }
  return Number(ans % MOD);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 170. 最大的团队表现值 =====");
console.log("方法1 n=6 k=2:", maxPerformance1(6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 2)); // 60
console.log("方法2 n=6 k=2:", maxPerformance2(6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 2)); // 60
console.log("方法1 n=6 k=3:", maxPerformance1(6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 3)); // 68
console.log("方法2 n=6 k=4:", maxPerformance2(6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 4)); // 72

export {};
