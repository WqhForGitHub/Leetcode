// ============================================================
// 022. 相对名次
// ============================================================
// LeetCode 506. Relative Ranks
// 给定运动员的分数，返回他们的相对名次，前三名为奖牌。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：最大堆排序
function findRelativeRanks(score: number[]): string[] {
  const indexed = score.map((s, i) => ({ s, i }));
  indexed.sort((a, b) => b.s - a.s);
  const result: string[] = new Array(score.length);
  const medals = ["Gold Medal", "Silver Medal", "Bronze Medal"];
  indexed.forEach((item, rank) => {
    result[item.i] = rank < 3 ? medals[rank] : String(rank + 1);
  });
  return result;
}

// 方法2：最大堆（使用堆排序）
function findRelativeRanksHeap(score: number[]): string[] {
  const heap: Array<{ s: number; i: number }> = [];
  const siftDown = (i: number, n: number): void => {
    while (true) {
      let s2 = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && heap[l].s > heap[s2].s) s2 = l;
      if (r < n && heap[r].s > heap[s2].s) s2 = r;
      if (s2 !== i) {
        [heap[i], heap[s2]] = [heap[s2], heap[i]];
        i = s2;
      } else break;
    }
  };
  score.forEach((s, i) => heap.push({ s, i }));
  const n = heap.length;
  for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(i, n);
  const result: string[] = new Array(score.length);
  const medals = ["Gold Medal", "Silver Medal", "Bronze Medal"];
  let rank = 0;
  const size = heap.length;
  for (let k = size - 1; k >= 0; k--) {
    const top = heap[0];
    result[top.i] = rank < 3 ? medals[rank] : String(rank + 1);
    rank++;
    heap[0] = heap[k];
    heap.pop();
    siftDown(0, k);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 022. 相对名次 =====");
console.log("排序:", findRelativeRanks([5, 4, 3, 2, 1])); // 期望 ["Gold Medal","Silver Medal","Bronze Medal","4","5"]
console.log("堆:", findRelativeRanksHeap([10, 3, 8, 9, 4])); // 期望 ["Gold Medal","5","Bronze Medal","Silver Medal","4"]

export {};
