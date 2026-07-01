// ============================================================
// 066. 3n 块披萨
// ============================================================
// LeetCode 1388. Pizza With 3n Slices
// 3n 块披萨排成环，每次选一块，相邻两块被别人拿走，求你拿的 n 块披萨总和最大。
// 时间复杂度：O(n^2)，空间复杂度：O(n^2)

// 方法1：动态规划（环形 = 两次线性 DP）
function maxSizeSlices(slices: number[]): number {
  const n = slices.length;
  const m = n / 3;
  const solve = (arr: number[]): number => {
    const len = arr.length;
    const dp: number[][] = Array.from({ length: len + 1 }, () => new Array(m + 1).fill(0));
    for (let i = 1; i <= len; i++) {
      for (let j = 1; j <= m; j++) {
        dp[i][j] = Math.max(dp[i - 1][j], (i >= 2 ? dp[i - 2][j - 1] : 0) + arr[i - 1]);
      }
    }
    return dp[len][m];
  };
  // 不选第一块 或 不选最后一块
  return Math.max(solve(slices.slice(0, n - 1)), solve(slices.slice(1, n)));
}

// 方法2：贪心 + 双向链表 + 最小堆
function maxSizeSlicesGreedy(slices: number[]): number {
  const n = slices.length;
  // 双向链表
  const prev: number[] = new Array(n);
  const next: number[] = new Array(n);
  const vals: number[] = slices.slice();
  for (let i = 0; i < n; i++) {
    prev[i] = (i - 1 + n) % n;
    next[i] = (i + 1) % n;
  }
  // 最大堆
  const heap: Array<{ v: number; i: number }> = [];
  const inHeap: boolean[] = new Array(n).fill(true);
  const pushMax = (v: { v: number; i: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].v > heap[p].v) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const popMax = (): { v: number; i: number } => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l].v > heap[s].v) s = l;
        if (r < heap.length && heap[r].v > heap[s].v) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  for (let i = 0; i < n; i++) pushMax({ v: slices[i], i });
  let result = 0;
  for (let k = 0; k < n / 3; k++) {
    let top = popMax();
    while (!inHeap[top.i]) top = popMax();
    result += top.v;
    const l = prev[top.i];
    const r = next[top.i];
    inHeap[l] = false;
    inHeap[r] = false;
    const newVal = vals[l] + vals[r] - vals[top.i];
    vals[top.i] = newVal;
    const ll = prev[l];
    const rr = next[r];
    next[ll] = top.i;
    prev[top.i] = ll;
    prev[rr] = top.i;
    next[top.i] = rr;
    pushMax({ v: newVal, i: top.i });
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 066. 3n 块披萨 =====");
console.log("DP:", maxSizeSlices([1, 2, 3, 4, 5, 6])); // 期望 10
console.log("贪心:", maxSizeSlicesGreedy([8, 9, 8, 6, 1, 1])); // 期望 16

export {};
