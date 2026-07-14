// ============================================================
// 020. IPO
// ============================================================
// LeetCode 502. IPO
// 给定 n 个项目的纯利润和资本需求，初始资金 w，最多做 k 个项目，求最终最大资本。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：最小堆（按资本）+ 最大堆（按利润）（推荐）
function findMaximizedCapital(k: number, w: number, profits: number[], capital: number[]): number {
  const n = profits.length;
  const projects: Array<{ cap: number; pro: number }> = [];
  for (let i = 0; i < n; i++) projects.push({ cap: capital[i], pro: profits[i] });
  projects.sort((a, b) => a.cap - b.cap);
  // 最大堆按利润
  const maxHeap: number[] = [];
  const pushMax = (v: number): void => {
    maxHeap.push(v);
    let i = maxHeap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (maxHeap[i] > maxHeap[p]) {
        [maxHeap[i], maxHeap[p]] = [maxHeap[p], maxHeap[i]];
        i = p;
      } else break;
    }
  };
  const popMax = (): number | undefined => {
    if (maxHeap.length === 0) return undefined;
    const top = maxHeap[0];
    const last = maxHeap.pop()!;
    if (maxHeap.length > 0) {
      maxHeap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < maxHeap.length && maxHeap[l] > maxHeap[s]) s = l;
        if (r < maxHeap.length && maxHeap[r] > maxHeap[s]) s = r;
        if (s !== i) {
          [maxHeap[i], maxHeap[s]] = [maxHeap[s], maxHeap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  let idx = 0;
  let cur = w;
  for (let i = 0; i < k; i++) {
    while (idx < n && projects[idx].cap <= cur) {
      pushMax(projects[idx].pro);
      idx++;
    }
    if (maxHeap.length === 0) break;
    cur += popMax()!;
  }
  return cur;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 020. IPO =====");
console.log("最大资本:", findMaximizedCapital(2, 0, [1, 2, 3], [0, 1, 1])); // 期望 4
console.log("最大资本:", findMaximizedCapital(3, 0, [1, 2, 3], [0, 1, 2])); // 期望 6

export {};
