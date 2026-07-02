// ============================================================
// 171. 两个数组间的距离值
// ============================================================
// LeetCode 1385. Find the Distance Value Between Two Arrays
// 距离值 = arr1 中满足 "不存在 arr2[j] 使 |arr1[i]-arr2[j]| <= d" 的元素个数。

// 方法1：暴力双重循环（O(n*m)）
function findTheDistanceValue1(arr1: number[], arr2: number[], d: number): number {
  let count = 0;
  for (const a of arr1) {
    let ok = true;
    for (const b of arr2) {
      if (Math.abs(a - b) <= d) {
        ok = false;
        break;
      }
    }
    if (ok) count++;
  }
  return count;
}

// 方法2：排序 arr2 + 二分查找（O((n+m) log m)）
function findTheDistanceValue2(arr1: number[], arr2: number[], d: number): number {
  const sorted = [...arr2].sort((a, b) => a - b);
  let count = 0;
  for (const a of arr1) {
    // 在 sorted 中查找是否存在元素落在 [a-d, a+d]
    let lo = 0;
    let hi = sorted.length - 1;
    let found = false;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] < a - d) {
        lo = mid + 1;
      } else if (sorted[mid] > a + d) {
        hi = mid - 1;
      } else {
        found = true;
        break;
      }
    }
    if (!found) count++;
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 171. 两个数组间的距离值 =====");
console.log("方法1:", findTheDistanceValue1([4, 5, 8], [10, 9, 1, 8], 2)); // 2
console.log("方法2:", findTheDistanceValue2([4, 5, 8], [10, 9, 1, 8], 2)); // 2
console.log("方法1:", findTheDistanceValue1([1, 4, 2, 3], [-4, -3, 6, 10, 20, 30], 3)); // 2
console.log("方法2:", findTheDistanceValue2([1, 4, 2, 3], [-4, -3, 6, 10, 20, 30], 3)); // 2
console.log("方法1:", findTheDistanceValue1([2, 1, 100, 3], [-5, -2, 10, -3, 7], 6)); // 1
console.log("方法2:", findTheDistanceValue2([2, 1, 100, 3], [-5, -2, 10, -3, 7], 6)); // 1

export {};
