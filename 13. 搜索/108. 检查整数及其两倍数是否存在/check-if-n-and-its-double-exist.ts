// ============================================================
// 108. 检查整数及其两倍数是否存在
// ============================================================
// LeetCode 1346. Check If N and Its Double Exist
// 检查数组中是否存在 N 和 2*N（不同下标）。

// 方法1：排序 + 二分查找
function checkIfExist(arr: number[]): boolean {
  arr.sort((a, b) => a - b);
  for (let i = 0; i < arr.length; i++) {
    const target = arr[i] * 2;
    // 二分查找 target
    let lo = 0;
    let hi = arr.length - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] === target && mid !== i) return true;
      if (arr[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return false;
}

// 方法2：哈希集合
function checkIfExistHash(arr: number[]): boolean {
  const seen = new Set<number>();
  for (const num of arr) {
    if (seen.has(num * 2) || (num % 2 === 0 && seen.has(num / 2))) {
      return true;
    }
    seen.add(num);
  }
  return false;
}

// 方法3：两次遍历哈希
function checkIfExistTwoPass(arr: number[]): boolean {
  const count = new Map<number, number>();
  for (const num of arr) {
    count.set(num, (count.get(num) || 0) + 1);
  }
  for (const num of arr) {
    if (num === 0) {
      if ((count.get(0) || 0) >= 2) return true;
    } else if (count.has(num * 2)) {
      return true;
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 108. 检查整数及其两倍数是否存在 =====");
console.log("二分 [10,2,5,3]:", checkIfExist([10, 2, 5, 3])); // true
console.log("二分 [3,1,7,11]:", checkIfExist([3, 1, 7, 11])); // false
console.log("哈希 [7,1,14,11]:", checkIfExistHash([7, 1, 14, 11])); // true
console.log("哈希 [0,0]:", checkIfExistHash([0, 0])); // true

export {};
