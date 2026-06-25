// ============================================================
// 前缀和面试题 - TypeScript 解题合集
// ============================================================

// ============================================================
// 1. 区间和
// LeetCode 303. Range Sum Query - Immutable
// 核心思路：预处理前缀和数组，任意区间 [left, right] 的和 = prefix[right+1] - prefix[left]
// 时间复杂度：初始化 O(n)，查询 O(1)
// 空间复杂度：O(n)
// ============================================================

// 方法1：前缀和数组（推荐）- 构造时多留一位避免边界判断
class NumArray {
  private prefix: number[];

  constructor(nums: number[]) {
    // prefix[i] 表示 nums[0..i-1] 的和，prefix[0] = 0
    this.prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
      this.prefix[i + 1] = this.prefix[i] + nums[i];
    }
  }

  sumRange(left: number, right: number): number {
    return this.prefix[right + 1] - this.prefix[left];
  }
}

// 方法2：前缀和数组（不补零）- 需要处理 left === 0 的边界
class NumArrayV2 {
  private prefix: number[];

  constructor(nums: number[]) {
    this.prefix = [...nums];
    for (let i = 1; i < nums.length; i++) {
      this.prefix[i] = this.prefix[i - 1] + nums[i];
    }
  }

  sumRange(left: number, right: number): number {
    if (left === 0) return this.prefix[right];
    return this.prefix[right] - this.prefix[left - 1];
  }
}

// 方法3：暴力计算 — 每次查询 O(n)，仅作对比
class NumArrayBruteForce {
  private nums: number[];

  constructor(nums: number[]) {
    this.nums = nums;
  }

  sumRange(left: number, right: number): number {
    let sum = 0;
    for (let i = left; i <= right; i++) {
      sum += this.nums[i];
    }
    return sum;
  }
}

// ============================================================
// 2. 子数组最大平均数
// LeetCode 643. Maximum Average Subarray I
// 核心思路：固定长度 k 的滑动窗口，利用前缀和 O(1) 计算窗口内元素和
// 时间复杂度：O(n)
// 空间复杂度：O(1)（方法1）/ O(n)（方法2 前缀和数组）
// ============================================================

// 方法1：滑动窗口（推荐）- 维护窗口和，右进左出
function findMaxAverage(nums: number[], k: number): number {
  let windowSum = 0;
  // 初始化第一个窗口
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }
  let maxSum = windowSum;

  // 滑动窗口
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k]; // 右边进入，左边离开
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum / k;
}

// 方法2：前缀和数组 — sumRange(i-k+1, i) 即为窗口和
function findMaxAveragePrefix(nums: number[], k: number): number {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  let maxSum = -Infinity;
  for (let i = k; i <= n; i++) {
    // 窗口 [i-k, i-1] 的和
    const windowSum = prefix[i] - prefix[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum / k;
}

// 方法3：暴力枚举 — O(n*k)，仅作对比
function findMaxAverageBruteForce(nums: number[], k: number): number {
  let maxAvg = -Infinity;
  for (let i = 0; i <= nums.length - k; i++) {
    let sum = 0;
    for (let j = i; j < i + k; j++) {
      sum += nums[j];
    }
    maxAvg = Math.max(maxAvg, sum / k);
  }
  return maxAvg;
}

// ============================================================
// 3. 二维区域和检索
// LeetCode 304. Range Sum Query 2D - Immutable
// 核心思路：二维前缀和，prefix[i+1][j+1] = 以 (0,0) 为左上角、(i,j) 为右下角的矩形和
// 区域和公式：sum(r1,c1,r2,c2) = prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1]
// 时间复杂度：初始化 O(m*n)，查询 O(1)
// 空间复杂度：O(m*n)
// ============================================================

// 方法1：二维前缀和（推荐）- 补零行零列，避免边界判断
class NumMatrix {
  private prefix: number[][];

  constructor(matrix: number[][]) {
    const m = matrix.length;
    const n = matrix[0].length;
    // prefix[i][j] 表示 matrix[0..i-1][0..j-1] 的和
    this.prefix = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        this.prefix[i + 1][j + 1] =
          this.prefix[i][j + 1] + // 上方矩形
          this.prefix[i + 1][j] - // 左方矩形
          this.prefix[i][j] + // 减去重复的左上角
          matrix[i][j]; // 当前元素
      }
    }
  }

  sumRegion(row1: number, col1: number, row2: number, col2: number): number {
    return (
      this.prefix[row2 + 1][col2 + 1] - // 整个大矩形
      this.prefix[row1][col2 + 1] - // 减去上方
      this.prefix[row2 + 1][col1] + // 减去左方
      this.prefix[row1][col1] // 加回重复减的左上角
    );
  }
}

// 方法2：行前缀和 — 每行独立维护前缀和，查询时逐行累加
class NumMatrixRowPrefix {
  private rowPrefix: number[][];

  constructor(matrix: number[][]) {
    const m = matrix.length;
    const n = matrix[0].length;
    this.rowPrefix = Array.from({ length: m }, () => new Array(n + 1).fill(0));

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        this.rowPrefix[i][j + 1] = this.rowPrefix[i][j] + matrix[i][j];
      }
    }
  }

  sumRegion(row1: number, col1: number, row2: number, col2: number): number {
    let sum = 0;
    for (let i = row1; i <= row2; i++) {
      sum += this.rowPrefix[i][col2 + 1] - this.rowPrefix[i][col1];
    }
    return sum;
  }
}

// 方法3：暴力计算 — O(m*n) 每次查询，仅作对比
class NumMatrixBruteForce {
  private matrix: number[][];

  constructor(matrix: number[][]) {
    this.matrix = matrix;
  }

  sumRegion(row1: number, col1: number, row2: number, col2: number): number {
    let sum = 0;
    for (let i = row1; i <= row2; i++) {
      for (let j = col1; j <= col2; j++) {
        sum += this.matrix[i][j];
      }
    }
    return sum;
  }
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 区间和 =====");

// 方法1：前缀和（补零）
const numArray = new NumArray([-2, 0, 3, -5, 2, -1]);
console.log(numArray.sumRange(0, 2)); // 1  (-2 + 0 + 3)
console.log(numArray.sumRange(2, 5)); // -1 (3 + -5 + 2 + -1)
console.log(numArray.sumRange(0, 5)); // -3

// 方法2：前缀和（不补零）
const numArrayV2 = new NumArrayV2([-2, 0, 3, -5, 2, -1]);
console.log(numArrayV2.sumRange(0, 2)); // 1
console.log(numArrayV2.sumRange(2, 5)); // -1
console.log(numArrayV2.sumRange(0, 5)); // -3

console.log("\n===== 2. 子数组最大平均数 =====");

console.log(findMaxAverage([1, 12, -5, -6, 50, 3], 4)); // 12.75 ((12-5-6+50)/4)
console.log(findMaxAverage([5], 1)); // 5
console.log(findMaxAverage([0, 1, 2, 3, 4, 5], 3)); // 4 ((3+4+5)/3)

console.log(findMaxAveragePrefix([1, 12, -5, -6, 50, 3], 4)); // 12.75
console.log(findMaxAveragePrefix([5], 1)); // 5

console.log(findMaxAverageBruteForce([1, 12, -5, -6, 50, 3], 4)); // 12.75

console.log("\n===== 3. 二维区域和检索 =====");

const matrix = [
  [3, 0, 1, 4, 2],
  [5, 6, 3, 2, 1],
  [1, 2, 0, 1, 5],
  [4, 1, 0, 1, 7],
  [1, 0, 3, 0, 5],
];

// 方法1：二维前缀和
const numMatrix = new NumMatrix(matrix);
console.log(numMatrix.sumRegion(2, 1, 4, 3)); // 8
console.log(numMatrix.sumRegion(1, 1, 2, 2)); // 11
console.log(numMatrix.sumRegion(1, 2, 2, 4)); // 12

// 方法2：行前缀和
const numMatrixRow = new NumMatrixRowPrefix(matrix);
console.log(numMatrixRow.sumRegion(2, 1, 4, 3)); // 8
console.log(numMatrixRow.sumRegion(1, 1, 2, 2)); // 11
console.log(numMatrixRow.sumRegion(1, 2, 2, 4)); // 12

// 方法3：暴力
const numMatrixBrute = new NumMatrixBruteForce(matrix);
console.log(numMatrixBrute.sumRegion(2, 1, 4, 3)); // 8

export {};
