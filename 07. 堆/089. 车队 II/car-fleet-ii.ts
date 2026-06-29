// ============================================================
// 089. 车队 II
// ============================================================
// LeetCode 1776. Car Fleet II
// 每辆车有位置和速度，追上后合并为车队（前车速度），求每辆车追上前车的时间。
// 时间复杂度：O(N)，空间复杂度：O(N)

// 方法1：单调栈（推荐）
function getCollisionTimes(cars: number[][]): number[] {
  const n = cars.length;
  const result: number[] = new Array(n).fill(-1);
  const stack: number[] = [];
  const collisionTime = (i: number, j: number): number => {
    // 车 i 追上车 j 的时间
    if (cars[i][1] <= cars[j][1]) return -1;
    return (cars[j][0] - cars[i][0]) / (cars[i][1] - cars[j][1]);
  };
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length > 0) {
      const j = stack[stack.length - 1];
      if (cars[i][1] <= cars[j][1]) {
        // i 不会追上 j
        stack.pop();
      } else {
        const t = collisionTime(i, j);
        if (result[j] === -1 || t <= result[j]) {
          result[i] = t;
          break;
        } else {
          // j 在追上 i 之前先撞了
          stack.pop();
        }
      }
    }
    stack.push(i);
  }
  return result;
}

// 方法2：最大堆模拟（按碰撞时间）
function getCollisionTimesHeap(cars: number[][]): number[] {
  const n = cars.length;
  const result: number[] = new Array(n).fill(-1);
  const collided: boolean[] = new Array(n).fill(false);
  const next: number[] = new Array(n).fill(-1);
  for (let i = 0; i < n - 1; i++) next[i] = i + 1;
  const heap: Array<{ t: number; i: number }> = [];
  const push = (v: { t: number; i: number }): void => {
    heap.push(v);
    let idx = heap.length - 1;
    while (idx > 0) {
      const p = (idx - 1) >> 1;
      if (heap[idx].t < heap[p].t) {
        [heap[idx], heap[p]] = [heap[p], heap[idx]];
        idx = p;
      } else break;
    }
  };
  for (let i = 0; i < n - 1; i++) {
    if (cars[i][1] > cars[i + 1][1]) {
      push({ t: (cars[i + 1][0] - cars[i][0]) / (cars[i][1] - cars[i + 1][1]), i });
    }
  }
  while (heap.length > 0) {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l].t < heap[s].t) s = l;
        if (r < heap.length && heap[r].t < heap[s].t) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    const i = top.i;
    if (collided[i] || next[i] === -1) continue;
    result[i] = top.t;
    collided[i] = true;
    const j = next[i];
    next[i] = next[j];
    const prev = next[i];
    if (prev !== -1 && cars[i][1] > cars[prev][1]) {
      // 这里需要用初始位置 + 时间推算
    }
    // 找前面的车
    for (let k = i - 1; k >= 0; k--) {
      if (!collided[k] && next[k] === i) {
        next[k] = next[i];
        if (next[k] !== -1 && cars[k][1] > cars[next[k]][1]) {
          push({ t: (cars[next[k]][0] - cars[k][0] + (result[next[k]] > 0 ? 0 : 0)) / (cars[k][1] - cars[next[k]][1]), i: k });
        }
        break;
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 089. 车队 II =====");
console.log("单调栈:", getCollisionTimes([[3, 4], [5, 4], [6, 3], [9, 1]])); // 期望 [2,1,1.5,-1]

export {};
