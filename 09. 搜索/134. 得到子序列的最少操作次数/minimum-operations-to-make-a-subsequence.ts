// ============================================================
// 134. 得到子序列的最少操作次数
// ============================================================
// LeetCode 1713. Minimum Operations to Make a Subsequence
// 使 target 成为 arr 的子序列，最少需要往 arr 中插入多少元素。

// 方法1：LCS 转换为 LIS（二分查找）
function minOperations1713(target: number[], arr: number[]): number {
  // 将 target 中的值映射为索引
  const indexMap = new Map<number, number>();
  for (let i = 0; i < target.length; i++) {
    indexMap.set(target[i], i);
  }
  // 将 arr 中存在于 target 的值转换为索引序列
  const indices: number[] = [];
  for (const val of arr) {
    if (indexMap.has(val)) {
      indices.push(indexMap.get(val)!);
    }
  }
  // 求 indices 的最长递增子序列
  const tails: number[] = [];
  for (const idx of indices) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (tails[mid] < idx) lo = mid + 1;
      else hi = mid;
    }
    if (lo === tails.length) tails.push(idx);
    else tails[lo] = idx;
  }
  return target.length - tails.length;
}

// 方法2：树状数组求 LIS
function minOperations1713BIT(target: number[], arr: number[]): number {
  const indexMap = new Map<number, number>();
  for (let i = 0; i < target.length; i++) {
    indexMap.set(target[i], i);
  }
  const indices: number[] = [];
  for (const val of arr) {
    if (indexMap.has(val)) indices.push(indexMap.get(val)!);
  }
  if (indices.length === 0) return target.length;
  const n = target.length;
  const bit = new Array(n + 1).fill(0);
  function update(i: number, val: number): void {
    i++;
    while (i <= n) {
      bit[i] = Math.max(bit[i], val);
      i += i & -i;
    }
  }
  function query(i: number): number {
    i++;
    let result = 0;
    while (i > 0) {
      result = Math.max(result, bit[i]);
      i -= i & -i;
    }
    return result;
  }
  let maxLIS = 0;
  for (const idx of indices) {
    const len = query(idx - 1) + 1;
    maxLIS = Math.max(maxLIS, len);
    update(idx, len);
  }
  return target.length - maxLIS;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 134. 得到子序列的最少操作次数 =====");
console.log("LIS [5,1,3],[9,4,2,3,4]:", minOperations1713([5, 1, 3], [9, 4, 2, 3, 4])); // 2
console.log("LIS [6,4,8,1,3,2],[4,7,6,2,3,8,6,1]:", minOperations1713([6, 4, 8, 1, 3, 2], [4, 7, 6, 2, 3, 8, 6, 1])); // 3

export {};
