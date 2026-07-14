// ============================================================
// 105. 元素和小于等于阈值的正方形的最大边长
// ============================================================
// LeetCode 1292. Maximum Side Length of a Square with Sum Less than or Equal to Threshold
// 矩阵中边长不超过阈值和的正方形的最大边长。

// 方法1：前缀和 + 二分查找
function maxSideLength(mat: number[][], threshold: number): number {
  const m = mat.length;
  const n = mat[0].length;
  // 二维前缀和
  const prefix = new Array(m + 1);
  for (let i = 0; i <= m; i++) {
    prefix[i] = new Array(n + 1).fill(0);
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      prefix[i][j] = mat[i - 1][j - 1] + prefix[i - 1][j] + prefix[i][j - 1] - prefix[i - 1][j - 1];
    }
  }
  // 二分查找最大边长
  let lo = 0;
  let hi = Math.min(m, n);
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (hasSquareWithSum(mid, prefix, m, n, threshold)) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return lo;
}

function hasSquareWithSum(
  k: number,
  prefix: number[][],
  m: number,
  n: number,
  threshold: number,
): boolean {
  for (let i = k; i <= m; i++) {
    for (let j = k; j <= n; j++) {
      const sum = prefix[i][j] - prefix[i - k][j] - prefix[i][j - k] + prefix[i - k][j - k];
      if (sum <= threshold) return true;
    }
  }
  return false;
}

// 方法2：前缀和 + 线性扫描（O(mn)）
function maxSideLengthLinear(mat: number[][], threshold: number): number {
  const m = mat.length;
  const n = mat[0].length;
  const prefix = new Array(m + 1);
  for (let i = 0; i <= m; i++) {
    prefix[i] = new Array(n + 1).fill(0);
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      prefix[i][j] = mat[i - 1][j - 1] + prefix[i - 1][j] + prefix[i][j - 1] - prefix[i - 1][j - 1];
    }
  }
  let result = 0;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const len = result + 1;
      if (
        i >= len &&
        j >= len &&
        prefix[i][j] - prefix[i - len][j] - prefix[i][j - len] + prefix[i - len][j - len] <=
          threshold
      ) {
        result = len;
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 105. 元素和小于等于阈值的正方形的最大边长 =====");
console.log(
  "二分 [[1,1,3,2,4,3,2],[1,1,3,2,4,3,2],[1,1,3,2,4,3,2]],4:",
  maxSideLength(
    [
      [1, 1, 3, 2, 4, 3, 2],
      [1, 1, 3, 2, 4, 3, 2],
      [1, 1, 3, 2, 4, 3, 2],
    ],
    4,
  ),
); // 2
console.log(
  "线性 [[2,2,2,2,2],[2,2,2,2,2],[2,2,2,2,2],[2,2,2,2,2],[2,2,2,2,2]],1:",
  maxSideLengthLinear(
    [
      [2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2],
    ],
    1,
  ),
); // 0

export {};
