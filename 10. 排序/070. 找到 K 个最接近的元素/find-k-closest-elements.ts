// ============================================================
// 070. 找到 K 个最接近的元素
// ============================================================
// LeetCode 658. Find K Closest Elements
// 给定升序数组 arr 和整数 k、x，找出最接近 x 的 k 个元素，
// 结果按升序返回。距离定义为 |a - x|；距离相等时取较小的元素。

// 方法1：二分查找左边界（推荐，O(log(n-k) + k) 时间，O(k) 空间用于结果）
// 长度为 k 的窗口 [left, left+k) 的最优左边界 left ∈ [0, n-k]。
// 二分：对 mid 比较 arr[mid] 与 arr[mid+k] 谁离 x 更近：
//   若 x - arr[mid] > arr[mid+k] - x，说明右端 arr[mid+k] 更近，窗口应右移：left = mid+1；
//   否则窗口不应右移：right = mid。
// 注意：距离相等时取较小元素，所以相等情况下不应右移，与 else 分支一致。
function findClosestElements(arr: number[], k: number, x: number): number[] {
  const n = arr.length;
  let lo = 0;
  let hi = n - k;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (x - arr[mid] > arr[mid + k] - x) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return arr.slice(lo, lo + k);
}

// 方法2：双指针从两端收缩（O(n) 时间，O(k) 空间用于结果）
// 左右指针分别从数组两端出发，每次比较 arr[lo] 与 arr[hi] 谁离 x 更远，
// 把更远的指针向内收缩。距离相等时收缩右指针（保留较小元素）。
// 当窗口长度为 k 时停止。
function findClosestElements_twoPointers(arr: number[], k: number, x: number): number[] {
  let lo = 0;
  let hi = arr.length - 1;
  while (hi - lo + 1 > k) {
    const distL = Math.abs(arr[lo] - x);
    const distR = Math.abs(arr[hi] - x);
    // 距离相等时移除右端（保留较小元素）
    if (distL <= distR) {
      hi--;
    } else {
      lo++;
    }
  }
  return arr.slice(lo, hi + 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 070. 找到 K 个最接近的元素 =====");
console.log("二分 arr=[1,2,3,4,5],k=4,x=3:",
  findClosestElements([1, 2, 3, 4, 5], 4, 3)); // 期望 [1,2,3,4]
console.log("二分 arr=[1,2,3,4,5],k=4,x=-1:",
  findClosestElements([1, 2, 3, 4, 5], 4, -1)); // 期望 [1,2,3,4]
console.log("二分 arr=[1,1,1,10,10,10],k=1,x=9:",
  findClosestElements([1, 1, 1, 10, 10, 10], 1, 9)); // 期望 [10]
console.log("双指针 arr=[1,2,3,4,5],k=4,x=3:",
  findClosestElements_twoPointers([1, 2, 3, 4, 5], 4, 3)); // 期望 [1,2,3,4]
console.log("双指针 arr=[1,2,3,4,5],k=4,x=-1:",
  findClosestElements_twoPointers([1, 2, 3, 4, 5], 4, -1)); // 期望 [1,2,3,4]
console.log("双指针 arr=[1,1,1,10,10,10],k=1,x=9:",
  findClosestElements_twoPointers([1, 1, 1, 10, 10, 10], 1, 9)); // 期望 [10]

export {};
