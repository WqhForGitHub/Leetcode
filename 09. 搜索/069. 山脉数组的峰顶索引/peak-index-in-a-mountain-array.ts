// ============================================================
// 069. 山脉数组的峰顶索引
// ============================================================
// LeetCode 852. Peak Index in a Mountain Array
// 山脉数组先增后减，返回峰顶索引。O(log n)。

// 方法1：二分查找
function peakIndexInMountainArray(arr: number[]): number {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < arr[mid + 1]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}

// 方法2：三分查找
function peakIndexInMountainArrayTernary(arr: number[]): number {
  let left = 0;
  let right = arr.length - 1;
  while (right - left > 2) {
    const mid1 = left + Math.floor((right - left) / 3);
    const mid2 = right - Math.floor((right - left) / 3);
    if (arr[mid1] < arr[mid2]) {
      left = mid1 + 1;
    } else {
      right = mid2 - 1;
    }
  }
  // 在剩余范围内找最大值
  let maxIdx = left;
  for (let i = left + 1; i <= right; i++) {
    if (arr[i] > arr[maxIdx]) maxIdx = i;
  }
  return maxIdx;
}

// 方法3：线性扫描（O(n)）
function peakIndexInMountainArrayLinear(arr: number[]): number {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[i + 1]) return i;
  }
  return arr.length - 1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 069. 山脉数组的峰顶索引 =====");
console.log("二分 [0,1,0]:", peakIndexInMountainArray([0, 1, 0])); // 1
console.log("二分 [0,2,1,0]:", peakIndexInMountainArray([0, 2, 1, 0])); // 1
console.log("二分 [0,10,5,2]:", peakIndexInMountainArray([0, 10, 5, 2])); // 1
console.log("三分 [24,69,100,99,79,78,67,36,26,19]:",
  peakIndexInMountainArrayTernary([24, 69, 100, 99, 79, 78, 67, 36, 26, 19])); // 2

export {};
