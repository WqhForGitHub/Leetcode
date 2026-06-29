// ============================================================
// 025. 最小区间
// ============================================================
// LeetCode 632. Smallest Range Covering Elements from K Lists
// 你有 k 个升序排列的整数列表，找到最小区间使每个列表至少有一个数在其中。
// 时间复杂度：O(N log k)，空间复杂度：O(k)

// 方法1：最小堆（推荐）
function smallestRange(nums: number[][]): number[] {
  const heap: Array<{ val: number; r: number; c: number }> = [];
  const push = (v: { val: number; r: number; c: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].val < heap[p].val) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { val: number; r: number; c: number } | undefined => {
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
        if (l < heap.length && heap[l].val < heap[s].val) s = l;
        if (r < heap.length && heap[r].val < heap[s].val) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  let maxVal = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    push({ val: nums[i][0], r: i, c: 0 });
    maxVal = Math.max(maxVal, nums[i][0]);
  }
  let best = [-Infinity, Infinity];
  while (heap.length === nums.length) {
    const top = pop()!;
    if (maxVal - top.val < best[1] - best[0] || (maxVal - top.val === best[1] - best[0] && top.val < best[0])) {
      best = [top.val, maxVal];
    }
    if (top.c + 1 < nums[top.r].length) {
      const nv = nums[top.r][top.c + 1];
      push({ val: nv, r: top.r, c: top.c + 1 });
      maxVal = Math.max(maxVal, nv);
    }
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 025. 最小区间 =====");
console.log("最小区间:", smallestRange([[4, 10, 15, 24, 26], [0, 9, 12, 20], [5, 18, 22, 30]]));
// 期望 [20,24]

export {};
