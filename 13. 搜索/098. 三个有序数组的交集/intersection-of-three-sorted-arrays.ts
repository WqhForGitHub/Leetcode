// ============================================================
// 098. 三个有序数组的交集
// ============================================================
// LeetCode 1213. Intersection of Three Sorted Arrays
// 三个升序数组的交集（共同元素）。

// 方法1：三指针法
function arraysIntersection(arr1: number[], arr2: number[], arr3: number[]): number[] {
  let i = 0;
  let j = 0;
  let k = 0;
  const result: number[] = [];
  while (i < arr1.length && j < arr2.length && k < arr3.length) {
    if (arr1[i] === arr2[j] && arr2[j] === arr3[k]) {
      result.push(arr1[i]);
      i++;
      j++;
      k++;
    } else {
      const minVal = Math.min(arr1[i], arr2[j], arr3[k]);
      if (arr1[i] === minVal) i++;
      if (arr2[j] === minVal) j++;
      if (arr3[k] === minVal) k++;
    }
  }
  return result;
}

// 方法2：二分查找（以一个数组为基准）
function arraysIntersectionBinary(arr1: number[], arr2: number[], arr3: number[]): number[] {
  const result: number[] = [];
  for (const val of arr1) {
    if (binarySearch98(arr2, val) && binarySearch98(arr3, val)) {
      result.push(val);
    }
  }
  return result;
}

function binarySearch98(arr: number[], target: number): boolean {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return true;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}

// 方法3：哈希集合计数
function arraysIntersectionHash(arr1: number[], arr2: number[], arr3: number[]): number[] {
  const count = new Map<number, number>();
  for (const v of arr1) count.set(v, (count.get(v) || 0) + 1);
  for (const v of arr2) count.set(v, (count.get(v) || 0) + 1);
  for (const v of arr3) count.set(v, (count.get(v) || 0) + 1);
  const result: number[] = [];
  for (const [val, c] of count) {
    if (c === 3) result.push(val);
  }
  return result.sort((a, b) => a - b);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 098. 三个有序数组的交集 =====");
console.log(
  "三指针 [1,2,3,4,5],[1,2,5,7,9],[1,3,4,5,8]:",
  arraysIntersection([1, 2, 3, 4, 5], [1, 2, 5, 7, 9], [1, 3, 4, 5, 8]),
); // [1,5]
console.log(
  "二分 [1,2,3,4,5],[1,2,5,7,9],[1,3,4,5,8]:",
  arraysIntersectionBinary([1, 2, 3, 4, 5], [1, 2, 5, 7, 9], [1, 3, 4, 5, 8]),
); // [1,5]

export {};
