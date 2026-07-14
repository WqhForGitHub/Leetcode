// ============================================================
// 163. 检查整数及其两倍数是否存在
// ============================================================
// LeetCode 1346. Check If N and Its Double Exist
// 给定数组 arr，判断是否存在 i != j 使得 arr[i] == 2 * arr[j]。

// 方法1：哈希集合（O(n)）
function checkIfExist1(arr: number[]): boolean {
  const seen = new Set<number>();
  for (const v of arr) {
    // 当前 v 作为较小数：检查 2*v 是否已在集合中
    // 当前 v 作为较大数：检查 v/2 是否已在集合中（v 须为偶数）
    if (seen.has(2 * v) || (v % 2 === 0 && seen.has(v / 2))) return true;
    seen.add(v);
  }
  return false;
}

// 方法2：排序 + 二分查找（O(n log n)）
function checkIfExist2(arr: number[]): boolean {
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  for (let i = 0; i < n; i++) {
    const target = 2 * sorted[i];
    let lo = 0;
    let hi = n - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] === target) {
        if (mid !== i) return true;
        // 命中自身时检查相邻是否存在相同值
        if (mid - 1 >= 0 && sorted[mid - 1] === target) return true;
        if (mid + 1 < n && sorted[mid + 1] === target) return true;
        break;
      } else if (sorted[mid] < target) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 163. 检查整数及其两倍数是否存在 =====");
console.log("方法1 [10,2,5,3]:", checkIfExist1([10, 2, 5, 3])); // true
console.log("方法2 [10,2,5,3]:", checkIfExist2([10, 2, 5, 3])); // true
console.log("方法1 [3,1,7,11]:", checkIfExist1([3, 1, 7, 11])); // false
console.log("方法2 [3,1,7,11]:", checkIfExist2([3, 1, 7, 11])); // false
console.log("方法1 [0,0]:", checkIfExist1([0, 0])); // true
console.log("方法2 [0,0]:", checkIfExist2([0, 0])); // true

export {};
