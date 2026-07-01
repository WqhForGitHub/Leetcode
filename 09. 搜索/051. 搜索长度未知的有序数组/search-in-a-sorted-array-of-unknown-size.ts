// ============================================================
// 051. 搜索长度未知的有序数组
// ============================================================
// LeetCode 702. Search in a Sorted Array of Unknown Size
// 给定 ArrayReader 接口（数组长度未知但有序），查找目标值。

// 模拟 ArrayReader
class ArrayReader {
  private arr: number[];
  constructor(arr: number[]) {
    this.arr = arr;
  }
  get(index: number): number {
    if (index >= this.arr.length) return Number.MAX_SAFE_INTEGER;
    return this.arr[index];
  }
}

// 方法1：倍增法确定右边界 + 二分查找
function searchUnknownSize(reader: ArrayReader, target: number): number {
  // 先确定范围
  let right = 1;
  while (reader.get(right) < target) {
    right *= 2;
  }
  let left = Math.floor(right / 2);
  // 二分查找
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const val = reader.get(mid);
    if (val === target) return mid;
    if (val < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

// 方法2：倍增法 + 递归二分
function searchUnknownSizeRecursive(reader: ArrayReader, target: number): number {
  function findBounds(lo: number, hi: number): number {
    if (reader.get(hi) >= target) {
      return binarySearch(reader, lo, hi, target);
    }
    return findBounds(hi, hi * 2);
  }
  return findBounds(0, 1);
}

function binarySearch(reader: ArrayReader, lo: number, hi: number, target: number): number {
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const val = reader.get(mid);
    if (val === target) return mid;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 051. 搜索长度未知的有序数组 =====");
const reader = new ArrayReader([-1, 0, 3, 5, 9, 12]);
console.log("倍增 9:", searchUnknownSize(reader, 9)); // 4
console.log("倍增 2:", searchUnknownSize(reader, 2)); // -1
console.log("递归 9:", searchUnknownSizeRecursive(reader, 9)); // 4

export {};
