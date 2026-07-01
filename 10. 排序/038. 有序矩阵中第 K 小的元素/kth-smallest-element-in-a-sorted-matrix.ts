// ============================================================
// 038. 有序矩阵中第 K 小的元素
// ============================================================
// LeetCode 378. Kth Smallest Element in a Sorted Matrix
// n×n 矩阵每行每列均升序，找出其中第 k 小的元素。

// 小顶堆实现（元素为 [val, row, col]，按 val 排序）
class MinHeapTriplet {
  private data: Array<[number, number, number]> = [];

  size(): number {
    return this.data.length;
  }

  push(item: [number, number, number]): void {
    this.data.push(item);
    this.siftUp(this.data.length - 1);
  }

  pop(): [number, number, number] | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.data[parent][0] <= this.data[i][0]) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && this.data[left][0] < this.data[smallest][0]) smallest = left;
      if (right < n && this.data[right][0] < this.data[smallest][0]) smallest = right;
      if (smallest === i) break;
      [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
      i = smallest;
    }
  }
}

// 方法1：小顶堆归并（O(k log n) 时间，O(n) 空间）
// 每行首元素入堆，每次弹出最小并压入该行下一个元素，第 k 次弹出即为答案。
function kthSmallestHeap(matrix: number[][], k: number): number {
  const n = matrix.length;
  const heap = new MinHeapTriplet();
  for (let r = 0; r < n; r++) {
    heap.push([matrix[r][0], r, 0]);
  }
  let result = matrix[0][0];
  for (let i = 0; i < k; i++) {
    const [val, r, c] = heap.pop()!;
    result = val;
    if (c + 1 < n) {
      heap.push([matrix[r][c + 1], r, c + 1]);
    }
  }
  return result;
}

// 方法2：二分值域（O(n log(max-min)) 时间，O(1) 空间）
// 在矩阵最小值与最大值之间二分，统计 <= mid 的元素个数以收缩区间。
function kthSmallestBinarySearch(matrix: number[][], k: number): number {
  const n = matrix.length;
  let lo = matrix[0][0];
  let hi = matrix[n - 1][n - 1];
  // 从左下角出发，统计矩阵中 <= mid 的元素个数
  const countLE = (mid: number): number => {
    let count = 0;
    let row = n - 1;
    let col = 0;
    while (row >= 0 && col < n) {
      if (matrix[row][col] <= mid) {
        count += row + 1; // 当前列 0..row 均 <= mid
        col++;
      } else {
        row--;
      }
    }
    return count;
  };
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (countLE(mid) < k) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 038. 有序矩阵中第 K 小的元素 =====");

const matrix = [
  [1, 5, 9],
  [10, 11, 13],
  [12, 13, 15],
];

console.log("堆归并 k=8:", kthSmallestHeap(matrix, 8)); // 期望 13
console.log("二分   k=8:", kthSmallestBinarySearch(matrix, 8)); // 期望 13
console.log("堆归并 k=1:", kthSmallestHeap(matrix, 1)); // 期望 1
console.log("二分   k=1:", kthSmallestBinarySearch(matrix, 1)); // 期望 1
console.log("堆归并 k=9:", kthSmallestHeap(matrix, 9)); // 期望 15
console.log("二分   k=9:", kthSmallestBinarySearch(matrix, 9)); // 期望 15

export {};
