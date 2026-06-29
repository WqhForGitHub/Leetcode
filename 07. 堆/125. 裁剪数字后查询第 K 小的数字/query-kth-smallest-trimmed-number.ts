// ============================================================
// 125. 裁剪数字后查询第 K 小的数字
// ============================================================
// LeetCode 2343. Query Kth Smallest Trimmed Number
// 给定数字字符串数组，每次查询裁剪后几位并找第 k 小。
// 时间复杂度：O(q * n log n)，空间复杂度：O(n)

// 方法1：排序
function smallestTrimmedNumbers(nums: string[], queries: number[][]): number[] {
  const result: number[] = [];
  for (const [k, trim] of queries) {
    const trimmed: Array<{ val: string; idx: number }> = nums.map((s, i) => ({
      val: s.slice(s.length - trim),
      idx: i,
    }));
    trimmed.sort((a, b) => (a.val < b.val ? -1 : a.val > b.val ? 1 : a.idx - b.idx));
    result.push(trimmed[k - 1].idx);
  }
  return result;
}

// 方法2：堆（维护 k 个最小值）
function smallestTrimmedNumbersHeap(nums: string[], queries: number[][]): number[] {
  const result: number[] = [];
  for (const [k, trim] of queries) {
    const arr: Array<{ val: string; idx: number }> = nums.map((s, i) => ({
      val: s.slice(s.length - trim),
      idx: i,
    }));
    // 使用最大堆维护 k 个最小
    const heap: Array<{ val: string; idx: number }> = [];
    const less = (a: (typeof arr)[0], b: (typeof arr)[0]): boolean => {
      return a.val > b.val || (a.val === b.val && a.idx > b.idx);
    };
    const siftDown = (i: number): void => {
      const n = heap.length;
      while (true) {
        let s = i;
        const l = 2 * i + 1,
          r = 2 * i + 2;
        if (l < n && less(heap[l], heap[s])) s = l;
        if (r < n && less(heap[r], heap[s])) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    };
    for (const item of arr) {
      heap.push(item);
      let i = heap.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (less(heap[i], heap[p])) {
          [heap[i], heap[p]] = [heap[p], heap[i]];
          i = p;
        } else break;
      }
      if (heap.length > k) {
        heap[0] = heap[heap.length - 1];
        heap.pop();
        siftDown(0);
      }
    }
    result.push(heap[0].idx);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 125. 裁剪数字后查询第 K 小的数字 =====");
console.log(
  "排序:",
  smallestTrimmedNumbers(
    ["102", "473", "251", "814"],
    [
      [1, 1],
      [2, 3],
      [4, 2],
      [1, 2],
    ],
  ),
);
// 期望 [2, 2, 1, 0]
console.log("堆:", smallestTrimmedNumbersHeap(["643", "841", "5"], [[1, 3]])); // 期望 [2]

export {};
