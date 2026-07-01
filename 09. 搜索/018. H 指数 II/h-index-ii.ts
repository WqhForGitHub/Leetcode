// ============================================================
// 018. H 指数 II
// ============================================================
// LeetCode 275. H-Index II
// 给定升序排列的引用次数数组，返回研究者的 h 指数。
// h 指数：至少有 h 篇论文被引用至少 h 次。

// 方法1：二分查找（推荐，O(log n)）
function hIndexII(citations: number[]): number {
  const n = citations.length;
  let left = 0;
  let right = n - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    // citations[mid] 篇论文引用至少 citations[mid] 次
    if (citations[mid] >= n - mid) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return n - left;
}

// 方法2：线性扫描（O(n)）
function hIndexIILinear(citations: number[]): number {
  const n = citations.length;
  for (let i = 0; i < n; i++) {
    if (citations[i] >= n - i) {
      return n - i;
    }
  }
  return 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 018. H 指数 II =====");
console.log("二分 [0,1,3,5,6]:", hIndexII([0, 1, 3, 5, 6])); // 3
console.log("二分 [1,1,3]:", hIndexII([1, 1, 3])); // 1
console.log("线性 [0,1,3,5,6]:", hIndexIILinear([0, 1, 3, 5, 6])); // 3

export {};
