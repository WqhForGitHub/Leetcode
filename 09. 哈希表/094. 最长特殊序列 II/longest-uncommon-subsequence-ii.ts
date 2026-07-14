// ============================================================
// 094. 最长特殊序列 II
// ============================================================
// LeetCode 522. Longest Uncommon Subsequence II
// 给定字符串数组，返回其中最长的特殊序列长度。
// 特殊序列：某个字符串的子序列，且不是其他任何字符串的子序列。
// 时间复杂度：O(n^2 * L)，空间复杂度：O(1)

// 判断 s 是否为 t 的子序列
function isSubsequence(s: string, t: string): boolean {
  if (s.length > t.length) return false;
  let i = 0;
  for (let j = 0; j < t.length && i < s.length; j++) {
    if (s[i] === t[j]) i++;
  }
  return i === s.length;
}

function findLUSlength(strs: string[]): number {
  let result = -1;
  const n = strs.length;
  // 对每个字符串，检查它是否不是其他字符串的子序列
  for (let i = 0; i < n; i++) {
    let isUncommon = true;
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      // 如果 strs[i] 是 strs[j] 的子序列，则 strs[i] 不是特殊序列
      if (isSubsequence(strs[i], strs[j])) {
        isUncommon = false;
        break;
      }
    }
    if (isUncommon) {
      result = Math.max(result, strs[i].length);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 094. 最长特殊序列 II =====");
// 测试 1: ["aba","cdc","eae"] -> 3
console.log(findLUSlength(["aba", "cdc", "eae"]));
// 期望: 3
// 测试 2: ["aaa","aaa","aa"] -> -1
console.log(findLUSlength(["aaa", "aaa", "aa"]));
// 期望: -1
// 测试 3: ["aabbcc","aabbcc","c"] -> -1
console.log(findLUSlength(["aabbcc", "aabbcc", "c"]));
// 期望: -1
// 测试 4: ["aba","cdc","eae","eff"] -> 3
console.log(findLUSlength(["aba", "cdc", "eae", "eff"]));
// 期望: 3

export {};
