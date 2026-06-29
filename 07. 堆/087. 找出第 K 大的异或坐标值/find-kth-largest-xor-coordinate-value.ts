// ============================================================
// 087. 找出第 K 大的异或坐标值
// ============================================================
// LeetCode 1738. Find Kth Largest XOR Coordinate Value
// 给定矩阵，坐标 (i,j) 的异或值为从 (0,0) 到 (i,j) 的异或和，返回第 k 大。
// 时间复杂度：O(mn log k)，空间复杂度：O(k)

// 方法1：二维前缀异或 + 最小堆
function kthLargestValue(matrix: number[][], k: number): number {
  const m = matrix.length;
  const n = matrix[0].length;
  const heap: number[] = []; // 最小堆维护 k 个最大值
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
  const xor: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const top = i > 0 ? xor[i - 1][j] : 0;
      const left = j > 0 ? xor[i][j - 1] : 0;
      const tl = i > 0 && j > 0 ? xor[i - 1][j - 1] : 0;
      xor[i][j] = top ^ left ^ tl ^ matrix[i][j];
      pushMin(xor[i][j]);
      if (heap.length > k) popMin();
    }
  }
  return heap[0];
}

// 方法2：排序
function kthLargestValueSort(matrix: number[][], k: number): number {
  const m = matrix.length;
  const n = matrix[0].length;
  const xor: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  const values: number[] = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const top = i > 0 ? xor[i - 1][j] : 0;
      const left = j > 0 ? xor[i][j - 1] : 0;
      const tl = i > 0 && j > 0 ? xor[i - 1][j - 1] : 0;
      xor[i][j] = top ^ left ^ tl ^ matrix[i][j];
      values.push(xor[i][j]);
    }
  }
  values.sort((a, b) => b - a);
  return values[k - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 087. 找出第 K 大的异或坐标值 =====");
console.log("堆:", kthLargestValue([[5, 2], [1, 6]], 1)); // 期望 7
console.log("排序:", kthLargestValueSort([[5, 2], [1, 6]], 2)); // 期望 5

export {};
