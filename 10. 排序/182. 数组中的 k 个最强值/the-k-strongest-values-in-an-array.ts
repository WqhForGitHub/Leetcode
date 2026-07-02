// ============================================================
// 182. 数组中的 k 个最强值
// ============================================================
// LeetCode 1471. The k Strongest Values in an Array
// 中位数 m = arr 排序后下标 (n-1)/2 处的值。
// 强度 = |arr[i] - m|。返回强度最大的 k 个值，
// 强度相同取数值更大的。返回顺序不限。

// 方法1：排序 + 双指针（O(n log n)）
// 排序后找中位数，两端双指针，谁更远取谁，相同取右端。
function getStrongest(arr: number[], k: number): number[] {
  arr.sort((a, b) => a - b);
  const n = arr.length;
  const median = arr[Math.floor((n - 1) / 2)];
  const result: number[] = [];
  let left = 0;
  let right = n - 1;
  while (result.length < k) {
    const dl = Math.abs(arr[left] - median);
    const dr = Math.abs(arr[right] - median);
    if (dr >= dl) {
      result.push(arr[right]);
      right--;
    } else {
      result.push(arr[left]);
      left++;
    }
  }
  return result;
}

// 方法2：排序 + 按强度排序（O(n log n)）
// 排序找中位数后，再按 (强度降序, 值降序) 排序，取前 k。
function getStrongest2(arr: number[], k: number): number[] {
  arr.sort((a, b) => a - b);
  const n = arr.length;
  const median = arr[Math.floor((n - 1) / 2)];
  const sorted = arr
    .map((x) => x)
    .sort((a, b) => {
      const da = Math.abs(a - median);
      const db = Math.abs(b - median);
      if (da !== db) return db - da;
      return b - a;
    });
  return sorted.slice(0, k);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 182. 数组中的 k 个最强值 =====");
console.log("方法1 arr=[1,2,3,4,5] k=2:", JSON.stringify(getStrongest([1, 2, 3, 4, 5], 2))); // [5,1]
console.log("方法1 arr=[1,1,3,5,5] k=2:", JSON.stringify(getStrongest([1, 1, 3, 5, 5], 2))); // [5,5]
console.log("方法1 arr=[6,7,11,7,6,8] k=5:", JSON.stringify(getStrongest([6, 7, 11, 7, 6, 8], 5))); // [11,8,6,6,7]
console.log("方法2 arr=[1,2,3,4,5] k=2:", JSON.stringify(getStrongest2([1, 2, 3, 4, 5], 2))); // [5,1]
console.log("方法2 arr=[1,1,3,5,5] k=2:", JSON.stringify(getStrongest2([1, 1, 3, 5, 5], 2))); // [5,5]
console.log("方法2 arr=[6,7,11,7,6,8] k=5:", JSON.stringify(getStrongest2([6, 7, 11, 7, 6, 8], 5))); // [11,8,6,6,7]

export {};
