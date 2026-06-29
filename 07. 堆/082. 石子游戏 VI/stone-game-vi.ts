// ============================================================
// 082. 石子游戏 VI
// ============================================================
// LeetCode 1686. Stone Game VI
// Alice 和 Bob 轮流取石子，得分分别为 aliceValues 和 bobValues，求谁赢。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：贪心 + 排序（按 aliceValues[i]+bobValues[i] 降序）
function stoneGameVI(aliceValues: number[], bobValues: number[]): number {
  const n = aliceValues.length;
  const indices: number[] = Array.from({ length: n }, (_, i) => i);
  indices.sort((a, b) => aliceValues[b] + bobValues[b] - (aliceValues[a] + bobValues[a]));
  let aliceScore = 0;
  let bobScore = 0;
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) aliceScore += aliceValues[indices[i]];
    else bobScore += bobValues[indices[i]];
  }
  if (aliceScore > bobScore) return 1;
  if (aliceScore < bobScore) return -1;
  return 0;
}

// 方法2：最大堆
function stoneGameVIHeap(aliceValues: number[], bobValues: number[]): number {
  const heap: Array<{ sum: number; idx: number }> = [];
  const pushMax = (v: { sum: number; idx: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].sum > heap[p].sum) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const popMax = (): { sum: number; idx: number } => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l].sum > heap[s].sum) s = l;
        if (r < heap.length && heap[r].sum > heap[s].sum) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  for (let i = 0; i < aliceValues.length; i++) {
    pushMax({ sum: aliceValues[i] + bobValues[i], idx: i });
  }
  let aliceScore = 0;
  let bobScore = 0;
  let turn = 0;
  while (heap.length > 0) {
    const top = popMax();
    if (turn === 0) aliceScore += aliceValues[top.idx];
    else bobScore += bobValues[top.idx];
    turn ^= 1;
  }
  if (aliceScore > bobScore) return 1;
  if (aliceScore < bobScore) return -1;
  return 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 082. 石子游戏 VI =====");
console.log("贪心:", stoneGameVI([1, 3], [2, 1])); // 期望 1
console.log("堆:", stoneGameVIHeap([1, 2], [3, 1])); // 期望 0

export {};
