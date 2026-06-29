// ============================================================
// 040. 雇佣 K 名工人的最低成本
// ============================================================
// LeetCode 857. Minimum Cost to Hire K Workers
// 雇佣 K 个工人，工资按质量比例支付且不低于期望工资，求最低总工资。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：最大堆 + 按 wage/quality 排序（推荐）
function mincostToHireWorkers(quality: number[], wage: number[], k: number): number {
  const n = quality.length;
  const workers: Array<{ ratio: number; q: number }> = [];
  for (let i = 0; i < n; i++) {
    workers.push({ ratio: wage[i] / quality[i], q: quality[i] });
  }
  workers.sort((a, b) => a.ratio - b.ratio);
  // 最大堆维护质量最小的 k 个
  const heap: number[] = [];
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
  let sumQ = 0;
  let result = Infinity;
  for (const w of workers) {
    sumQ += w.q;
    pushMax(w.q);
    if (heap.length > k) {
      sumQ -= popMax();
    }
    if (heap.length === k) {
      result = Math.min(result, sumQ * w.ratio);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 040. 雇佣 K 名工人的最低成本 =====");
console.log("最低成本:", mincostToHireWorkers([10, 20, 5], [70, 50, 30], 2)); // 期望 105
console.log("最低成本:", mincostToHireWorkers([3, 1, 10, 10, 1], [4, 8, 2, 2, 7], 3)); // 期望 30.66667

export {};
