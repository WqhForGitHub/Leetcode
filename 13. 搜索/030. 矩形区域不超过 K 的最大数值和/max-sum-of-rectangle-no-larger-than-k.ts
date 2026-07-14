// ============================================================
// 030. 矩形区域不超过 K 的最大数值和
// ============================================================
// LeetCode 363. Max Sum of Rectangle No Larger Than K
// 给定 m×n 矩阵和整数 k，返回矩阵内矩形区域不超过 k 的最大数值和。

// 方法1：固定左右列 + 前缀和 + 有序集合二分（O(m² n log n)）
function maxSumSubmatrix(matrix: number[][], k: number): number {
  const m = matrix.length;
  const n = matrix[0].length;
  let result = -Infinity;
  // 枚举左右边界
  for (let left = 0; left < n; left++) {
    const rowSum = new Array(m).fill(0);
    for (let right = left; right < n; right++) {
      for (let i = 0; i < m; i++) {
        rowSum[i] += matrix[i][right];
      }
      // 在 rowSum 中找不超过 k 的最大子数组和
      result = Math.max(result, maxSumNoLargerThanK(rowSum, k));
    }
  }
  return result;
}

function maxSumNoLargerThanK(arr: number[], k: number): number {
  const prefixSet: number[] = [0];
  let prefixSum = 0;
  let result = -Infinity;
  for (const num of arr) {
    prefixSum += num;
    // 找 prefixSum - x <= k => x >= prefixSum - k
    const target = prefixSum - k;
    let left = 0;
    let right = prefixSet.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (prefixSet[mid] < target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    if (left < prefixSet.length) {
      result = Math.max(result, prefixSum - prefixSet[left]);
    }
    // 插入 prefixSum 保持有序
    let insertIdx = 0;
    while (insertIdx < prefixSet.length && prefixSet[insertIdx] < prefixSum) {
      insertIdx++;
    }
    prefixSet.splice(insertIdx, 0, prefixSum);
  }
  return result;
}

// 方法2：固定上下行 + 前缀和 + 暴力（O(m² n²)，适合小数据）
function maxSumSubmatrixBrute(matrix: number[][], k: number): number {
  const m = matrix.length;
  const n = matrix[0].length;
  let result = -Infinity;
  for (let top = 0; top < m; top++) {
    const colSum = new Array(n).fill(0);
    for (let bottom = top; bottom < m; bottom++) {
      for (let j = 0; j < n; j++) {
        colSum[j] += matrix[bottom][j];
      }
      for (let start = 0; start < n; start++) {
        let sum = 0;
        for (let end = start; end < n; end++) {
          sum += colSum[end];
          if (sum <= k && sum > result) {
            result = sum;
          }
        }
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 030. 矩形区域不超过 K 的最大数值和 =====");
console.log(
  "有序集合 [[1,0,1],[0,-2,3]],2:",
  maxSumSubmatrix(
    [
      [1, 0, 1],
      [0, -2, 3],
    ],
    2,
  ),
); // 2
console.log(
  "暴力 [[1,0,1],[0,-2,3]],2:",
  maxSumSubmatrixBrute(
    [
      [1, 0, 1],
      [0, -2, 3],
    ],
    2,
  ),
); // 2

export {};
