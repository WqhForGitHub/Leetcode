// ============================================================
// 053. 最长特殊序列 II
// ============================================================
// LeetCode 522. Longest Uncommon Subsequence II
// 给定字符串数组，求最长特殊子序列的长度。
// 特殊子序列：某个字符串的子序列，且不是其他任何字符串的子序列。

// 方法1：按长度降序排序 + 逐个检查是否为其他串的子序列（推荐，O(n^2 * L) 时间）
// 按长度降序排序后，依次检查每个字符串是否不是其他字符串的子序列。
// 第一个满足条件的即为最长特殊子序列，直接返回其长度。
// 若某字符串重复出现，则它一定是另一个相同串的子序列，自动被排除。
function findLUSlength(strs: string[]): number {
  // 按长度降序排序，长度相同按字典序（便于跳过重复）
  strs.sort((a, b) => b.length - a.length || (a < b ? -1 : a > b ? 1 : 0));

  for (let i = 0; i < strs.length; i++) {
    // 跳过重复字符串：若与前一个完全相同，它不可能特殊
    if (i > 0 && strs[i] === strs[i - 1]) continue;
    let isUncommon = true;
    for (let j = 0; j < strs.length; j++) {
      if (i === j) continue;
      // 如果 strs[i] 与 strs[j] 相同（重复串），它必是子序列
      if (strs[i] === strs[j]) {
        isUncommon = false;
        break;
      }
      if (isSubsequence(strs[i], strs[j])) {
        isUncommon = false;
        break;
      }
    }
    if (isUncommon) return strs[i].length;
  }
  return -1;
}

// 判断 s 是否为 t 的子序列
function isSubsequence(s: string, t: string): boolean {
  if (s.length > t.length) return false;
  let i = 0;
  for (let j = 0; j < t.length && i < s.length; j++) {
    if (s[i] === t[j]) i++;
  }
  return i === s.length;
}

// 方法2：按长度降序 + 计数去重（O(n^2 * L) 时间）
// 先统计每个字符串出现次数，只考虑出现一次的字符串作为候选，
// 再按长度降序检查是否为其他串的子序列。
function findLUSlengthCount(strs: string[]): number {
  const count = new Map<string, number>();
  for (const s of strs) {
    count.set(s, (count.get(s) || 0) + 1);
  }
  // 候选：只出现一次的字符串
  const candidates = [...count.keys()].filter((s) => count.get(s) === 1);
  candidates.sort((a, b) => b.length - a.length);

  for (const cand of candidates) {
    let isUncommon = true;
    for (const s of strs) {
      if (s === cand) continue;
      if (isSubsequence(cand, s)) {
        isUncommon = false;
        break;
      }
    }
    if (isUncommon) return cand.length;
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 053. 最长特殊序列 II =====");
console.log("排序 [aba,cdc,eae]:", findLUSlength(["aba", "cdc", "eae"])); // 期望 3
console.log("排序 [aaa,aaa,aa]:", findLUSlength(["aaa", "aaa", "aa"])); // 期望 -1
console.log("排序 [aabbcc,abc,abc,bc]:", findLUSlength(["aabbcc", "abc", "abc", "bc"])); // 期望 6
console.log("计数 [aba,cdc,eae]:", findLUSlengthCount(["aba", "cdc", "eae"])); // 期望 3
console.log("计数 [aaa,aaa,aa]:", findLUSlengthCount(["aaa", "aaa", "aa"])); // 期望 -1
console.log("计数 [aabbcc,abc,abc,bc]:", findLUSlengthCount(["aabbcc", "abc", "abc", "bc"])); // 期望 6

export {};
