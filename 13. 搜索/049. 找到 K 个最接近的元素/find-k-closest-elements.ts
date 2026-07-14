// ============================================================
// 049. 找到 K 个最接近的元素
// ============================================================
// LeetCode 658. Find K Closest Elements
// 有序数组中找到最接近 x 的 k 个元素，结果升序。

// 方法1：二分查找 + 双指针收缩
function findClosestElements(arr: number[], k: number, x: number): number[] {
  let left = 0;
  let right = arr.length - 1;
  // 收缩到 k 个元素
  while (right - left >= k) {
    if (Math.abs(arr[left] - x) <= Math.abs(arr[right] - x)) {
      right--;
    } else {
      left++;
    }
  }
  return arr.slice(left, right + 1);
}

// 方法2：二分查找左边界
function findClosestElementsBinary(arr: number[], k: number, x: number): number[] {
  // 二分找窗口左边界 [left, left+k-1]
  let lo = 0;
  let hi = arr.length - k;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    // 比较 x 到 mid 和 mid+k 的距离
    if (x - arr[mid] > arr[mid + k] - x) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return arr.slice(lo, lo + k);
}

// 方法3：排序（按距离）
function findClosestElementsSort(arr: number[], k: number, x: number): number[] {
  const sorted = [...arr].sort((a, b) => {
    const diff = Math.abs(a - x) - Math.abs(b - x);
    if (diff !== 0) return diff;
    return a - b;
  });
  return sorted.slice(0, k).sort((a, b) => a - b);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 049. 找到 K 个最接近的元素 =====");
console.log("双指针 [1,2,3,4,5],4,3:", findClosestElements([1, 2, 3, 4, 5], 4, 3)); // [1,2,3,4]
console.log("二分 [1,2,3,4,5],4,-1:", findClosestElementsBinary([1, 2, 3, 4, 5], 4, -1)); // [1,2,3,4]
console.log("排序 [1,1,1,10,10,10],1,9:", findClosestElementsSort([1, 1, 1, 10, 10, 10], 1, 9)); // [10]

export {};
