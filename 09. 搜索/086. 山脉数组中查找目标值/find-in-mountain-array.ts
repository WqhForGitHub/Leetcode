// ============================================================
// 086. 山脉数组中查找目标值
// ============================================================
// LeetCode 1095. Find in Mountain Array
// 先增后减的山脉数组中查找目标值，O(log n)。

// 模拟 MountainArray
class MountainArray {
  private arr: number[];
  private calls = 0;
  constructor(arr: number[]) {
    this.arr = arr;
  }
  get(index: number): number {
    this.calls++;
    return this.arr[index];
  }
  length(): number {
    return this.arr.length;
  }
}

// 方法1：三步二分（找峰顶 + 左二分 + 右二分）
function findInMountainArray(target: number, mountainArr: MountainArray): number {
  const n = mountainArr.length();
  // 1. 找峰顶
  let lo = 0;
  let hi = n - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (mountainArr.get(mid) < mountainArr.get(mid + 1)) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  const peak = lo;
  // 2. 在左半部分（升序）二分
  const leftResult = binarySearchMountain(mountainArr, target, 0, peak, true);
  if (leftResult !== -1) return leftResult;
  // 3. 在右半部分（降序）二分
  return binarySearchMountain(mountainArr, target, peak + 1, n - 1, false);
}

function binarySearchMountain(
  arr: MountainArray,
  target: number,
  lo: number,
  hi: number,
  ascending: boolean
): number {
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const val = arr.get(mid);
    if (val === target) return mid;
    if (ascending) {
      if (val < target) lo = mid + 1;
      else hi = mid - 1;
    } else {
      if (val > target) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}

// 方法2：先找峰顶再分别二分（与方法1类似，更简洁）
function findInMountainArrayAlt(target: number, mountainArr: MountainArray): number {
  const n = mountainArr.length();
  // 找峰顶
  let l = 1;
  let r = n - 2;
  while (l < r) {
    const m = Math.floor((l + r) / 2);
    if (mountainArr.get(m) < mountainArr.get(m + 1)) l = m + 1;
    else r = m;
  }
  const peak = l;
  // 左边升序查找
  l = 0;
  r = peak;
  while (l <= r) {
    const m = Math.floor((l + r) / 2);
    const v = mountainArr.get(m);
    if (v === target) return m;
    if (v < target) l = m + 1;
    else r = m - 1;
  }
  // 右边降序查找
  l = peak + 1;
  r = n - 1;
  while (l <= r) {
    const m = Math.floor((l + r) / 2);
    const v = mountainArr.get(m);
    if (v === target) return m;
    if (v > target) l = m + 1;
    else r = m - 1;
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 086. 山脉数组中查找目标值 =====");
const ma = new MountainArray([1, 2, 3, 4, 5, 3, 1]);
console.log("三步二分 3:", findInMountainArray(3, ma)); // 2
const ma2 = new MountainArray([0, 1, 2, 4, 2, 1]);
console.log("三步二分 3:", findInMountainArray(3, ma2)); // -1

export {};
