// ============================================================
// 152. 可移除字符的最大数目
// ============================================================
// LeetCode 1898. Maximum Number of Removable Characters
// 从 s 中移除 removable 前 k 个字符后，p 仍是 s 的子序列，求最大 k。

// 方法1：二分查找 + 子序列检查
function maximumRemovals(s: string, p: string, removable: number[]): number {
  let left = 0;
  let right = removable.length;
  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2);
    if (isSubseq(s, p, removable, mid)) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }
  return left;
}

function isSubseq(s: string, p: string, removable: number[], k: number): boolean {
  const removed = new Set<number>();
  for (let i = 0; i < k; i++) {
    removed.add(removable[i]);
  }
  let j = 0;
  for (let i = 0; i < s.length && j < p.length; i++) {
    if (removed.has(i)) continue;
    if (s[i] === p[j]) j++;
  }
  return j === p.length;
}

// 方法2：二分查找 + 字符串构建
function maximumRemovalsAlt(s: string, p: string, removable: number[]): number {
  let lo = 0;
  let hi = removable.length;
  const sArr = s.split("");
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    const removed = new Set<number>();
    for (let i = 0; i < mid; i++) {
      removed.add(removable[i]);
    }
    let j = 0;
    for (let i = 0; i < s.length; i++) {
      if (removed.has(i)) continue;
      if (sArr[i] === p[j]) {
        j++;
        if (j === p.length) break;
      }
    }
    if (j === p.length) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 152. 可移除字符的最大数目 =====");
console.log("二分 'abcacb','ab',[3,1,0]:", maximumRemovals("abcacb", "ab", [3, 1, 0])); // 2
console.log(
  "二分 'abcbddddd','abcd',[3,2,1,4,5,6]:",
  maximumRemovals("abcbddddd", "abcd", [3, 2, 1, 4, 5, 6]),
); // 1
console.log("二分 'abcab','abc',[0,1,2,3,4]:", maximumRemovals("abcab", "abc", [0, 1, 2, 3, 4])); // 0

export {};
