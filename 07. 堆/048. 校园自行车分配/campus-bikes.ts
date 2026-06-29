// ============================================================
// 048. 校园自行车分配
// ============================================================
// LeetCode 1057. Campus Bikes
// 给定工人和自行车坐标，按曼哈顿距离最小分配（距离相同取工人索引，再取自行车索引）。
// 时间复杂度：O(mn log(mn))，空间复杂度：O(mn)

// 方法1：最小堆按 (距离, 工人, 自行车)
function assignBikes(workers: number[][], bikes: number[][]): number[] {
  const m = workers.length;
  const n = bikes.length;
  const heap: Array<{ d: number; w: number; b: number }> = [];
  const push = (v: { d: number; w: number; b: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      const cmp = heap[i].d - heap[p].d || heap[i].w - heap[p].w || heap[i].b - heap[p].b;
      if (cmp < 0) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { d: number; w: number; b: number } | undefined => {
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
        const cmpL = l < heap.length ? heap[l].d - heap[s].d || heap[l].w - heap[s].w || heap[l].b - heap[s].b : 1;
        const cmpR = r < heap.length ? heap[r].d - heap[s].d || heap[r].w - heap[s].w || heap[r].b - heap[s].b : 1;
        if (cmpL < 0 && (cmpR >= 0 || heap[l].d - heap[r].d <= 0)) s = l;
        else if (cmpR < 0) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  for (let w = 0; w < m; w++) {
    for (let b = 0; b < n; b++) {
      const d = Math.abs(workers[w][0] - bikes[b][0]) + Math.abs(workers[w][1] - bikes[b][1]);
      push({ d, w, b });
    }
  }
  const result: number[] = new Array(m).fill(-1);
  const usedBike: boolean[] = new Array(n).fill(false);
  let assigned = 0;
  while (assigned < m) {
    const top = pop()!;
    if (result[top.w] === -1 && !usedBike[top.b]) {
      result[top.w] = top.b;
      usedBike[top.b] = true;
      assigned++;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 048. 校园自行车分配 =====");
console.log("分配:", assignBikes([[0, 0], [2, 1]], [[1, 2], [3, 3]])); // 期望 [1,0]
console.log("分配:", assignBikes([[0, 0], [1, 1], [2, 0]], [[1, 0], [2, 2], [2, 1]])); // 期望 [0,2,1]

export {};
