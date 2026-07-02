// ============================================================
// 220. 找出第 K 大的异或坐标值
// ============================================================
// LeetCode 1738. Find Kth Largest XOR Coordinate Value
// 给定 m x n 矩阵 matrix，定义异或前缀 pref[i][j] =
//   matrix[i][j] ^ pref[i-1][j] ^ pref[i][j-1] ^ pref[i-1][j-1]
// 求所有坐标 (i,j) 的 pref 值中第 k 大的值。

// 方法1：二维异或前缀 + 展开排序取第 K 大（O(mn log(mn))）
// 先递推计算每个坐标的异或前缀值，收集到一维数组，
// 降序排序后取第 k-1 个即为第 k 大。
function kthLargestValue1(matrix: number[][], k: number): number {
  const m = matrix.length;
  const n = matrix[0].length;
  const pref: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  const values: number[] = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let v = matrix[i][j];
      if (i > 0) v ^= pref[i - 1][j];
      if (j > 0) v ^= pref[i][j - 1];
      if (i > 0 && j > 0) v ^= pref[i - 1][j - 1];
      pref[i][j] = v;
      values.push(v);
    }
  }
  values.sort((a, b) => b - a);
  return values[k - 1];
}

// 方法2：二维异或前缀 + 大小为 k 的最小堆（O(mn log k)）
// 维护一个大小为 k 的最小堆保存当前最大的 k 个值，
// 堆顶即为第 k 大。空间更省。
class MinHeap {
  private arr: number[] = [];

  size(): number {
    return this.arr.length;
  }

  peek(): number {
    return this.arr[0];
  }

  private up(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.arr[p] <= this.arr[i]) break;
      const tmp = this.arr[p];
      this.arr[p] = this.arr[i];
      this.arr[i] = tmp;
      i = p;
    }
  }

  private down(i: number): void {
    const n = this.arr.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let smallest = i;
      if (l < n && this.arr[l] < this.arr[smallest]) smallest = l;
      if (r < n && this.arr[r] < this.arr[smallest]) smallest = r;
      if (smallest === i) break;
      const tmp = this.arr[smallest];
      this.arr[smallest] = this.arr[i];
      this.arr[i] = tmp;
      i = smallest;
    }
  }

  push(val: number): void {
    this.arr.push(val);
    this.up(this.arr.length - 1);
  }

  pop(): number {
    const top = this.arr[0];
    const last = this.arr.pop() as number;
    if (this.arr.length > 0) {
      this.arr[0] = last;
      this.down(0);
    }
    return top;
  }
}

function kthLargestValue2(matrix: number[][], k: number): number {
  const m = matrix.length;
  const n = matrix[0].length;
  const pref: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  const heap = new MinHeap();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let v = matrix[i][j];
      if (i > 0) v ^= pref[i - 1][j];
      if (j > 0) v ^= pref[i][j - 1];
      if (i > 0 && j > 0) v ^= pref[i - 1][j - 1];
      pref[i][j] = v;
      if (heap.size() < k) {
        heap.push(v);
      } else if (v > heap.peek()) {
        heap.pop();
        heap.push(v);
      }
    }
  }
  return heap.peek();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 220. 找出第 K 大的异或坐标值 =====");
const mat1 = [
  [5, 2],
  [1, 6],
];
console.log("方法1 k=1:", kthLargestValue1(mat1, 1)); // 7
console.log("方法2 k=1:", kthLargestValue2(mat1, 1)); // 7
console.log("方法1 k=2:", kthLargestValue1(mat1, 2)); // 5
console.log("方法2 k=2:", kthLargestValue2(mat1, 2)); // 5
console.log("方法1 k=3:", kthLargestValue1(mat1, 3)); // 4
console.log("方法2 k=3:", kthLargestValue2(mat1, 3)); // 4

export {};
