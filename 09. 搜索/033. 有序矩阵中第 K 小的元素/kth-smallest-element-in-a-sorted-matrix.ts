// ============================================================
// 033. 有序矩阵中第 K 小的元素
// ============================================================
// LeetCode 378. Kth Smallest Element in a Sorted Matrix
// 每行每列均升序的 n×n 矩阵中，返回第 k 小的元素。

// 方法1：二分查找值域（O(n log(max-min))）
function kthSmallest(matrix: number[][], k: number): number {
  const n = matrix.length;
  let left = matrix[0][0];
  let right = matrix[n - 1][n - 1];
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const count = countLessEqual(matrix, mid);
    if (count < k) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}

function countLessEqual(matrix: number[][], target: number): number {
  const n = matrix.length;
  let count = 0;
  let row = n - 1;
  let col = 0;
  while (row >= 0 && col < n) {
    if (matrix[row][col] <= target) {
      count += row + 1;
      col++;
    } else {
      row--;
    }
  }
  return count;
}

// 方法2：最小堆（O(k log n)）
function kthSmallestHeap(matrix: number[][], k: number): number {
  const n = matrix.length;
  // 使用数组模拟最小堆，元素 [val, row, col]
  const heap: number[][] = [];
  for (let i = 0; i < n; i++) {
    heap.push([matrix[i][0], i, 0]);
  }
  // 建堆
  heap.sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < k - 1; i++) {
    const [_, row, col] = heap.shift()!;
    if (col + 1 < n) {
      heap.push([matrix[row][col + 1], row, col + 1]);
      heap.sort((a, b) => a[0] - b[0]);
    }
  }
  return heap[0][0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 033. 有序矩阵中第 K 小的元素 =====");
const m33 = [
  [1, 5, 9],
  [10, 11, 13],
  [12, 13, 15],
];
console.log("二分 8:", kthSmallest(m33, 8)); // 13
console.log("堆 8:", kthSmallestHeap(m33, 8)); // 13
console.log("二分 1:", kthSmallest(m33, 1)); // 1

export {};
