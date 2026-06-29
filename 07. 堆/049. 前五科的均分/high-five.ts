// ============================================================
// 049. 前五科的均分
// ============================================================
// LeetCode 1086. High Five
// 给定学生 ID 和分数，返回每个学生前五高分平均分（按 ID 升序）。
// 时间复杂度：O(N log 5)，空间复杂度：O(N)

// 方法1：最小堆维护每个学生前五
function highFive(items: number[][]): number[][] {
  const map = new Map<number, number[]>();
  for (const [id, score] of items) {
    if (!map.has(id)) map.set(id, []);
    const heap = map.get(id)!;
    heap.push(score);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] < heap[p]) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
    if (heap.length > 5) {
      const last = heap.pop()!;
      heap[0] = last;
      let j = 0;
      while (true) {
        let s = j;
        const l = 2 * j + 1;
        const r = 2 * j + 2;
        if (l < heap.length && heap[l] < heap[s]) s = l;
        if (r < heap.length && heap[r] < heap[s]) s = r;
        if (s !== j) {
          [heap[j], heap[s]] = [heap[s], heap[j]];
          j = s;
        } else break;
      }
    }
  }
  const ids = Array.from(map.keys()).sort((a, b) => a - b);
  const result: number[][] = [];
  for (const id of ids) {
    const scores = map.get(id)!;
    const avg = Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length);
    result.push([id, avg]);
  }
  return result;
}

// 方法2：排序
function highFiveSort(items: number[][]): number[][] {
  const map = new Map<number, number[]>();
  for (const [id, score] of items) {
    if (!map.has(id)) map.set(id, []);
    map.get(id)!.push(score);
  }
  const result: number[][] = [];
  const ids = Array.from(map.keys()).sort((a, b) => a - b);
  for (const id of ids) {
    const scores = map.get(id)!.sort((a, b) => b - a).slice(0, 5);
    const avg = Math.floor(scores.reduce((a, b) => a + b, 0) / 5);
    result.push([id, avg]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 049. 前五科的均分 =====");
console.log("堆:", JSON.stringify(highFive([[1, 91], [1, 92], [2, 93], [2, 97], [1, 60], [2, 77], [1, 65], [1, 87], [1, 100], [2, 100], [2, 76]])));
// 期望 [[1,87],[2,88]]

export {};
