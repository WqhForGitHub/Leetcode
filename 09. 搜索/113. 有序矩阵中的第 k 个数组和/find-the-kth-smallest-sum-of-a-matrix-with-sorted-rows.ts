// ============================================================
// 113. 有序矩阵中的第 k 个数组和
// ============================================================
// LeetCode 1439. Find the Kth Smallest Sum of a Matrix With Sorted Rows
// 每行选一个元素，所有可能的和中第 k 小的。

// 方法1：最小堆 + 去重
function kthSmallest1439(mat: number[][], k: number): number {
  let result = [0]; // 初始和为 0
  for (const row of mat) {
    const nextResult: number[] = [];
    for (const prevSum of result) {
      for (const val of row) {
        nextResult.push(prevSum + val);
      }
    }
    nextResult.sort((a, b) => a - b);
    result = nextResult.slice(0, k); // 只保留前 k 小
  }
  return result[k - 1];
}

// 方法2：二分查找（值域二分）
function kthSmallest1439Binary(mat: number[][], k: number): number {
  const m = mat.length;
  const n = mat[0].length;
  let lo = 0;
  let hi = 0;
  for (const row of mat) {
    lo += row[0];
    hi += row[n - 1];
  }
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    const count = countLessEqual(mat, mid, 0, 0, new Map());
    if (count >= k) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return lo;
}

function countLessEqual(
  mat: number[][],
  target: number,
  row: number,
  sum: number,
  memo: Map<string, number>,
): number {
  if (row === mat.length) return sum <= target ? 1 : 0;
  const key = `${row},${sum}`;
  if (memo.has(key)) return memo.get(key)!;
  let count = 0;
  for (const val of mat[row]) {
    if (sum + val > target) break;
    count += countLessEqual(mat, target, row + 1, sum + val, memo);
    if (count >= 200) break; // 剪枝
  }
  memo.set(key, count);
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 113. 有序矩阵中的第 k 个数组和 =====");
console.log(
  "堆 [[1,3,11],[2,4,6]],5:",
  kthSmallest1439(
    [
      [1, 3, 11],
      [2, 4, 6],
    ],
    5,
  ),
); // 7
console.log(
  "堆 [[1,3,11],[2,4,6]],9:",
  kthSmallest1439(
    [
      [1, 3, 11],
      [2, 4, 6],
    ],
    9,
  ),
); // 17
console.log(
  "堆 [[1,10,10],[1,4,5],[2,3,6]],7:",
  kthSmallest1439(
    [
      [1, 10, 10],
      [1, 4, 5],
      [2, 3, 6],
    ],
    7,
  ),
); // 9

export {};
