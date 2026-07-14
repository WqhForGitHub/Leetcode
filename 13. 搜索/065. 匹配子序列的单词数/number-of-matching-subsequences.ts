// ============================================================
// 065. 匹配子序列的单词数
// ============================================================
// LeetCode 792. Number of Matching Subsequences
// 给定字符串 S 和单词列表，统计是 S 的子序列的单词个数。

// 方法1：预处理 + 二分查找
function numMatchingSubseq(s: string, words: string[]): number {
  // pos[c] = 字符 c 在 s 中出现的所有位置（升序）
  const pos: Map<string, number[]> = new Map();
  for (let i = 0; i < s.length; i++) {
    if (!pos.has(s[i])) pos.set(s[i], []);
    pos.get(s[i])!.push(i);
  }
  let count = 0;
  for (const word of words) {
    if (isSubseq(word, pos)) count++;
  }
  return count;
}

function isSubseq(word: string, pos: Map<string, number[]>): boolean {
  let curr = -1; // 上一个字符匹配的位置
  for (const ch of word) {
    if (!pos.has(ch)) return false;
    const arr = pos.get(ch)!;
    // 二分找第一个大于 curr 的位置
    let lo = 0;
    let hi = arr.length - 1;
    let found = -1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] > curr) {
        found = arr[mid];
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }
    if (found === -1) return false;
    curr = found;
  }
  return true;
}

// 方法2：分组指针（等待队列）
function numMatchingSubseqGroup(s: string, words: string[]): number {
  // heads[c] = 等待匹配字符 c 的单词列表
  const heads: string[][][] = new Array(26).fill(null).map(() => []);
  for (const word of words) {
    if (word.length > 0) {
      heads[word.charCodeAt(0) - 97].push([word, "0"]);
    }
  }
  let count = 0;
  for (const ch of s) {
    const bucket = heads[ch.charCodeAt(0) - 97];
    heads[ch.charCodeAt(0) - 97] = [];
    for (const [word, idxStr] of bucket) {
      const idx = parseInt(idxStr) + 1;
      if (idx === word.length) {
        count++;
      } else {
        heads[word.charCodeAt(idx) - 97].push([word, String(idx)]);
      }
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 065. 匹配子序列的单词数 =====");
console.log(
  "二分 'abcde',['a','bb','acd','ace']:",
  numMatchingSubseq("abcde", ["a", "bb", "acd", "ace"]),
); // 3
console.log(
  "二分 'dsahjpjauf',['ahjpjau','ja','ahbwzgqnuk','tnmlanowax']:",
  numMatchingSubseq("dsahjpjauf", ["ahjpjau", "ja", "ahbwzgqnuk", "tnmlanowax"]),
); // 2

export {};
