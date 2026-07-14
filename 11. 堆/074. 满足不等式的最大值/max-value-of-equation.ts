// ============================================================
// 074. 满足不等式的最大值
// ============================================================
// LeetCode 1499. Max Value of Equation
// 给定点数组按 x 升序，求 |xi - xj| + yi + yj (j > i 且 |xi-xj| <= k) 的最大值。
// 时间复杂度：O(N)，空间复杂度：O(N)

// 方法1：单调队列（推荐）
function findMaxValueOfEquation(points: number[][], k: number): number {
  // 求 yi + yj + xj - xi = (yj - xj) + (yi + xi) 的最大值
  const deque: number[] = []; // 存索引，按 yi+xi 递减
  let result = -Infinity;
  for (let j = 0; j < points.length; j++) {
    const [xj, yj] = points[j];
    while (deque.length > 0 && xj - points[deque[0]][0] > k) deque.shift();
    if (deque.length > 0) {
      const [xi, yi] = points[deque[0]];
      result = Math.max(result, yj - xj + yi + xi);
    }
    while (
      deque.length > 0 &&
      points[deque[deque.length - 1]][1] + points[deque[deque.length - 1]][0] <= yi + xi
    ) {
      deque.pop();
    }
    deque.push(j);
  }
  return result;
}

// 方法2：最大堆 + 延迟删除
function findMaxValueOfEquationHeap(points: number[][], k: number): number {
  const heap: Array<{ val: number; x: number }> = []; // 最大堆按 yi+xi
  const pushMax = (v: { val: number; x: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].val > heap[p].val) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const popMax = (): { val: number; x: number } => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l].val > heap[s].val) s = l;
        if (r < heap.length && heap[r].val > heap[s].val) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  let result = -Infinity;
  for (const [xj, yj] of points) {
    while (heap.length > 0 && xj - heap[0].x > k) popMax();
    if (heap.length > 0) {
      result = Math.max(result, yj - xj + heap[0].val);
    }
    pushMax({ val: yj + xj, x: xj });
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 074. 满足不等式的最大值 =====");
console.log(
  "单调队列:",
  findMaxValueOfEquation(
    [
      [1, 3],
      [2, 0],
      [5, 10],
      [6, -10],
    ],
    1,
  ),
); // 期望 4
console.log(
  "堆:",
  findMaxValueOfEquationHeap(
    [
      [0, 0],
      [3, 0],
      [9, 2],
    ],
    3,
  ),
); // 期望 3

export {};
