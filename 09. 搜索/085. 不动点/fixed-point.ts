// ============================================================
// 085. 不动点
// ============================================================
// LeetCode 1064. Fixed Point
// 升序数组中找 arr[i] === i 的最小索引，不存在返回 -1。

// 方法1：二分查找
function fixedPoint(arr: number[]): number {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === mid) {
      result = mid;
      right = mid - 1; // 找更小的
    } else if (arr[mid] < mid) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return result;
}

// 方法2：线性扫描
function fixedPointLinear(arr: number[]): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === i) return i;
    if (arr[i] > i) break; // 升序，后面不可能
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 085. 不动点 =====");
console.log("二分 [-10,-5,0,3,7]:", fixedPoint([-10, -5, 0, 3, 7])); // 3
console.log("二分 [0,2,5,8,17]:", fixedPoint([0, 2, 5, 8, 17])); // 0
console.log("二分 [-10,-5,2,3,7]:", fixedPoint([-10, -5, 2, 3, 7])); // -1
console.log("线性 [-10,-5,0,3,7]:", fixedPointLinear([-10, -5, 0, 3, 7])); // 3

export {};
