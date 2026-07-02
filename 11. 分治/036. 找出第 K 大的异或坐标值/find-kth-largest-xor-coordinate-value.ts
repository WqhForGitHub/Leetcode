// ============================================================
// 036. 找出第 K 大的异或坐标值
// ============================================================
// LeetCode 1738. Find Kth Largest XOR Coordinate Value
// 给定 m x n 矩阵 matrix，坐标 (i, j) 的异或前缀为
// matrix[0..i][0..j] 范围内所有元素的异或值。
// 返回所有坐标异或值中第 k 大的值。
// 时间复杂度：O(mn log(mn)), 空间复杂度：O(mn)

// 方法1：计算异或前缀 + 排序（推荐）
// 二维异或前缀和：xor[i][j] = matrix[i][j] ^ xor[i-1][j] ^ xor[i][j-1] ^ xor[i-1][j-1]
// 收集所有坐标的异或值，排序后取第 k 大。
// 时间复杂度 O(mn log(mn))，空间复杂度 O(mn)
function kthLargestValue(matrix: number[][], k: number): number {
  const m: number = matrix.length;
  const n: number = matrix[0].length;
  const xorPrefix: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  const values: number[] = [];

  for (let i: number = 0; i < m; i++) {
    for (let j: number = 0; j < n; j++) {
      const top: number = i > 0 ? xorPrefix[i - 1][j] : 0;
      const left: number = j > 0 ? xorPrefix[i][j - 1] : 0;
      const topLeft: number = i > 0 && j > 0 ? xorPrefix[i - 1][j - 1] : 0;
      xorPrefix[i][j] = top ^ left ^ topLeft ^ matrix[i][j];
      values.push(xorPrefix[i][j]);
    }
  }

  values.sort((a: number, b: number) => b - a); // 降序
  return values[k - 1];
}

// 方法2：计算异或前缀 + 快速选择
// 用快速选择在 O(mn) 平均时间内找到第 k 大的值
// 时间复杂度 O(mn) 平均，空间复杂度 O(mn)
function kthLargestValueQuickSelect(matrix: number[][], k: number): number {
  const m: number = matrix.length;
  const n: number = matrix[0].length;
  const xorPrefix: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  const values: number[] = [];

  for (let i: number = 0; i < m; i++) {
    for (let j: number = 0; j < n; j++) {
      const top: number = i > 0 ? xorPrefix[i - 1][j] : 0;
      const left: number = j > 0 ? xorPrefix[i][j - 1] : 0;
      const topLeft: number = i > 0 && j > 0 ? xorPrefix[i - 1][j - 1] : 0;
      xorPrefix[i][j] = top ^ left ^ topLeft ^ matrix[i][j];
      values.push(xorPrefix[i][j]);
    }
  }

  // 快速选择找第 k 大（降序第 k-1 个位置）
  function quickSelect(left: number, right: number, kIdx: number): number {
    if (left === right) return values[left];
    const pivotIdx: number = left + Math.floor(Math.random() * (right - left + 1));
    const pivot: number = values[pivotIdx];
    // 三路划分（降序）
    let lt: number = left;
    let gt: number = right;
    let i: number = left;
    [values[pivotIdx], values[left]] = [values[left], values[pivotIdx]];
    while (i <= gt) {
      if (values[i] > pivot) {
        [values[lt], values[i]] = [values[i], values[lt]];
        lt++;
        i++;
      } else if (values[i] < pivot) {
        [values[i], values[gt]] = [values[gt], values[i]];
        gt--;
      } else {
        i++;
      }
    }
    if (kIdx < lt) return quickSelect(left, lt - 1, kIdx);
    if (kIdx > gt) return quickSelect(gt + 1, right, kIdx);
    return pivot;
  }

  return quickSelect(0, values.length - 1, k - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 036. 找出第 K 大的异或坐标值 =====");
console.log(
  kthLargestValue(
    [
      [5, 2],
      [1, 6],
    ],
    1,
  ),
); // 期望结果: 7
console.log(
  kthLargestValue(
    [
      [5, 2],
      [1, 6],
    ],
    2,
  ),
); // 期望结果: 5
console.log(
  kthLargestValue(
    [
      [5, 2],
      [1, 6],
    ],
    3,
  ),
); // 期望结果: 4
console.log(
  kthLargestValue(
    [
      [5, 2],
      [1, 6],
    ],
    4,
  ),
); // 期望结果: 0
console.log("--- 方法2测试 ---");
console.log(
  kthLargestValueQuickSelect(
    [
      [5, 2],
      [1, 6],
    ],
    1,
  ),
); // 期望结果: 7
console.log(
  kthLargestValueQuickSelect(
    [
      [5, 2],
      [1, 6],
    ],
    2,
  ),
); // 期望结果: 5
console.log(
  kthLargestValueQuickSelect(
    [
      [5, 2],
      [1, 6],
    ],
    3,
  ),
); // 期望结果: 4
console.log(
  kthLargestValueQuickSelect(
    [
      [5, 2],
      [1, 6],
    ],
    4,
  ),
); // 期望结果: 0

export {};
