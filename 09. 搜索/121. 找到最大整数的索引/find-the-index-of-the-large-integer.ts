// ============================================================
// 121. 找到最大整数的索引
// ============================================================
// LeetCode 1533. Find the Index of the Large Integer
// 数组中只有一个最大整数，用 compareSub() 接口找其索引。

// 模拟接口
class ArrayReader1533 {
  private arr: number[];
  constructor(arr: number[]) {
    this.arr = arr;
  }
  length(): number {
    return this.arr.length;
  }
  compareSub(l: number, r: number, x: number, y: number): number {
    // 比较 arr[l..r] 和 arr[x..y] 的和
    let sum1 = 0;
    let sum2 = 0;
    for (let i = l; i <= r; i++) sum1 += this.arr[i];
    for (let i = x; i <= y; i++) sum2 += this.arr[i];
    return sum1 === sum2 ? 0 : sum1 > sum2 ? 1 : -1;
  }
}

// 方法1：二分查找
function getIndex(reader: ArrayReader1533): number {
  let left = 0;
  let right = reader.length() - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const isOdd = (right - left + 1) % 2 === 1;
    let compareResult: number;
    if (isOdd) {
      // 奇数个元素，跳过中间
      compareResult = reader.compareSub(left, mid - 1, mid + 1, right);
      if (compareResult === 0) return mid;
      if (compareResult > 0) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // 偶数个元素
      compareResult = reader.compareSub(left, mid, mid + 1, right);
      if (compareResult > 0) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
  }
  return left;
}

// 方法2：简化二分
function getIndexSimple(reader: ArrayReader1533): number {
  let lo = 0;
  let hi = reader.length() - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    const result = reader.compareSub(lo, mid, mid + (hi - lo) % 2, hi);
    if (result > 0) {
      hi = mid;
    } else if (result < 0) {
      lo = mid + (hi - lo) % 2 + 1 - (hi - lo) % 2;
    } else {
      return mid;
    }
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 121. 找到最大整数的索引 =====");
const reader1533 = new ArrayReader1533([7, 7, 7, 7, 10, 7, 7, 7]);
console.log("二分:", getIndex(reader1533)); // 4
const reader1533b = new ArrayReader1533([6, 6, 12]);
console.log("二分:", getIndex(reader1533b)); // 2

export {};
