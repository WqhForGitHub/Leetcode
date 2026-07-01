// ============================================================
// 050. 乘法表中第k小的数
// ============================================================
// LeetCode 668. Kth Smallest Number in Multiplication Table
// m×n 乘法表中第 k 小的数。

// 方法1：二分查找值域
function findKthNumber(m: number, n: number, k: number): number {
  let left = 1;
  let right = m * n;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const count = countInMultiplicationTable(m, n, mid);
    if (count < k) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}

function countInMultiplicationTable(m: number, n: number, target: number): number {
  let count = 0;
  for (let i = 1; i <= m; i++) {
    count += Math.min(Math.floor(target / i), n);
  }
  return count;
}

// 方法2：对角线遍历计数（O(m)）
function findKthNumberDiagonal(m: number, n: number, k: number): number {
  let lo = 1;
  let hi = m * n;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let count = 0;
    // 从右上角开始
    let row = 1;
    let col = n;
    while (row <= m && col > 0) {
      if (row * col <= mid) {
        count += col;
        row++;
      } else {
        col--;
      }
    }
    if (count < k) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 050. 乘法表中第k小的数 =====");
console.log("二分 3,3,5:", findKthNumber(3, 3, 5)); // 3
console.log("二分 2,3,6:", findKthNumber(2, 3, 6)); // 6
console.log("对角线 3,3,5:", findKthNumberDiagonal(3, 3, 5)); // 3

export {};
