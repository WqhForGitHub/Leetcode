// ============================================================
// 079. 可以到达的最远建筑
// ============================================================
// LeetCode 1642. Furthest Building You Can Reach
// 用梯子（无距离限制）和砖块爬楼，求能到达的最远建筑。
// 时间复杂度：O(N log L)，空间复杂度：O(L)

// 方法1：最小堆维护梯子对应的较大高度差（推荐）
function furthestBuilding(heights: number[], bricks: number, ladders: number): number {
  const heap: number[] = []; // 最小堆，存用梯子的高度差
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
  for (let i = 0; i < heights.length - 1; i++) {
    const diff = heights[i + 1] - heights[i];
    if (diff <= 0) continue;
    pushMin(diff);
    if (heap.length > ladders) {
      bricks -= popMin();
      if (bricks < 0) return i;
    }
  }
  return heights.length - 1;
}

// 方法2：二分查找 + 验证
function furthestBuildingBinary(heights: number[], bricks: number, ladders: number): number {
  const canReach = (target: number): boolean => {
    const diffs: number[] = [];
    for (let i = 0; i < target; i++) {
      const d = heights[i + 1] - heights[i];
      if (d > 0) diffs.push(d);
    }
    diffs.sort((a, b) => b - a);
    let need = 0;
    for (let i = ladders; i < diffs.length; i++) need += diffs[i];
    return need <= bricks;
  };
  let lo = 0;
  let hi = heights.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (canReach(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 079. 可以到达的最远建筑 =====");
console.log("最小堆:", furthestBuilding([4, 2, 7, 6, 9, 14, 12], 5, 1)); // 期望 4
console.log("二分:", furthestBuildingBinary([4, 12, 2, 7, 3, 18, 20, 3, 19], 10, 2)); // 期望 7

export {};
