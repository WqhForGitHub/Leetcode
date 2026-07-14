// ============================================================
// 203. 删除某些元素后的数组均值
// ============================================================
// LeetCode 1619. Mean of Array After Removing Some Elements
// 给定数组 arr，删除最小的 5% 和最大的 5% 元素后，返回剩余元素的均值。

// 方法1：排序 + 截取中间90% + 求均值（O(n log n)）
function trimMean(arr: number[]): number {
  arr.sort((a, b) => a - b);
  const n = arr.length;
  const remove = Math.floor(n * 0.05);
  const trimmed = arr.slice(remove, n - remove);
  const sum = trimmed.reduce((a, b) => a + b, 0);
  return sum / trimmed.length;
}

// 方法2：排序 + 直接求中间元素之和（O(n log n)）
// 不创建新数组，直接遍历中间部分累加
function trimMean2(arr: number[]): number {
  arr.sort((a, b) => a - b);
  const n = arr.length;
  const remove = Math.floor(n * 0.05);
  let sum = 0;
  let count = 0;
  for (let i = remove; i < n - remove; i++) {
    sum += arr[i];
    count++;
  }
  return sum / count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 203. 删除某些元素后的数组均值 =====");
console.log(
  "方法1 [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3]:",
  trimMean([1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3]),
);
console.log(
  "方法2 [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3]:",
  trimMean2([1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3]),
);
console.log(
  "方法1 [6,2,7,5,1,2,0,3,10,2,5,0,5,5,0,8,7,6,8,0]:",
  trimMean([6, 2, 7, 5, 1, 2, 0, 3, 10, 2, 5, 0, 5, 5, 0, 8, 7, 6, 8, 0]),
);
console.log(
  "方法2 [6,2,7,5,1,2,0,3,10,2,5,0,5,5,0,8,7,6,8,0]:",
  trimMean2([6, 2, 7, 5, 1, 2, 0, 3, 10, 2, 5, 0, 5, 5, 0, 8, 7, 6, 8, 0]),
);

export {};
