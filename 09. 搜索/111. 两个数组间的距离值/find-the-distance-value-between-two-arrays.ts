// ============================================================
// 111. 两个数组间的距离值
// ============================================================
// LeetCode 1385. Find the Distance Value Between Two Arrays
// arr1 中满足 |arr1[i]-arr2[j]| > d 对所有 j 的元素个数。

// 方法1：排序 + 二分查找
function findTheDistanceValue(
  arr1: number[],
  arr2: number[],
  d: number
): number {
  arr2.sort((a, b) => a - b);
  let count = 0;
  for (const num of arr1) {
    // 检查 arr2 中是否有元素在 [num-d, num+d] 范围内
    let lo = 0;
    let hi = arr2.length - 1;
    let found = false;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (Math.abs(arr2[mid] - num) <= d) {
        found = true;
        break;
      }
      if (arr2[mid] < num - d) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (!found) count++;
  }
  return count;
}

// 方法2：暴力双重循环
function findTheDistanceValueBrute(
  arr1: number[],
  arr2: number[],
  d: number
): number {
  let count = 0;
  for (const a of arr1) {
    let valid = true;
    for (const b of arr2) {
      if (Math.abs(a - b) <= d) {
        valid = false;
        break;
      }
    }
    if (valid) count++;
  }
  return count;
}

// 方法3：排序 + 双指针
function findTheDistanceValueSort(
  arr1: number[],
  arr2: number[],
  d: number
): number {
  arr1.sort((a, b) => a - b);
  arr2.sort((a, b) => a - b);
  let count = 0;
  let j = 0;
  for (const num of arr1) {
    // 找 arr2 中最接近 num 的元素
    while (j < arr2.length && arr2[j] < num) j++;
    let minDist = Infinity;
    if (j < arr2.length) minDist = Math.min(minDist, Math.abs(arr2[j] - num));
    if (j > 0) minDist = Math.min(minDist, Math.abs(arr2[j - 1] - num));
    if (minDist > d) count++;
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 111. 两个数组间的距离值 =====");
console.log("二分 [4,5,8],[10,9,1,8],2:", findTheDistanceValue([4, 5, 8], [10, 9, 1, 8], 2)); // 2
console.log("二分 [1,4,2,3],[-4,-3,6,10,20,30],3:", findTheDistanceValue([1, 4, 2, 3], [-4, -3, 6, 10, 20, 30], 3)); // 2
console.log("暴力 [4,5,8],[10,9,1,8],2:", findTheDistanceValueBrute([4, 5, 8], [10, 9, 1, 8], 2)); // 2

export {};
