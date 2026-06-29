// ============================================================
// 068. 对角线遍历 II
// ============================================================
// LeetCode 1424. Diagonal Traverse II
// 给定二维数组，按对角线从左上到右下遍历，同一对角线按行号降序。
// 时间复杂度：O(N)，空间复杂度：O(N)

// 方法1：桶排序（按 i+j 分组）
function findDiagonalOrder(nums: number[][]): number[] {
  const groups: Map<number, number[]> = new Map();
  let maxKey = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums[i].length; j++) {
      const key = i + j;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(nums[i][j]);
      maxKey = Math.max(maxKey, key);
    }
  }
  const result: number[] = [];
  for (let k = 0; k <= maxKey; k++) {
    const arr = groups.get(k);
    if (arr === undefined) continue;
    for (let i = arr.length - 1; i >= 0; i--) result.push(arr[i]);
  }
  return result;
}

// 方法2：最小堆
function findDiagonalOrderHeap(nums: number[][]): number[] {
  const heap: Array<{ sum: number; i: number; j: number }> = [];
  const push = (v: { sum: number; i: number; j: number }): void => {
    heap.push(v);
    let idx = heap.length - 1;
    while (idx > 0) {
      const p = (idx - 1) >> 1;
      if (
        heap[idx].sum < heap[p].sum ||
        (heap[idx].sum === heap[p].sum && heap[idx].i > heap[p].i)
      ) {
        [heap[idx], heap[p]] = [heap[p], heap[idx]];
        idx = p;
      } else break;
    }
  };
  const pop = (): { sum: number; i: number; j: number } | undefined => {
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
        const cmpL =
          l < heap.length ? heap[l].sum - heap[s].sum || (heap[l].i > heap[s].i ? -1 : 1) : 1;
        const cmpR =
          r < heap.length ? heap[r].sum - heap[s].sum || (heap[r].i > heap[s].i ? -1 : 1) : 1;
        if (
          cmpL < 0 &&
          (cmpR >= 0 ||
            heap[l].sum - heap[r].sum < 0 ||
            (heap[l].sum === heap[r].sum && heap[l].i > heap[r].i))
        )
          s = l;
        else if (cmpR < 0) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums[i].length; j++) {
      push({ sum: i + j, i, j });
    }
  }
  const result: number[] = [];
  while (heap.length > 0) {
    const top = pop()!;
    result.push(nums[top.i][top.j]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 068. 对角线遍历 II =====");
console.log(
  "桶排:",
  findDiagonalOrder([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
); // 期望 [1,4,2,7,5,3,8,6,9]

export {};
