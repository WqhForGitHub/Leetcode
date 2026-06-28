// ============================================================
// 021. 单词拆分 II
// ============================================================
// LeetCode 140. Word Break II
// 给定字符串 s 和单词字典 wordDict，返回所有可以将 s 拆分成字典中单词的方案。
// 回溯 + 记忆化 + 哈希集合。
// 时间复杂度：O(2^n) 最坏情况，记忆化后大幅优化；空间复杂度：O(n^2)

function wordBreak(s: string, wordDict: string[]): string[] {
  // 用哈希集合存储字典，O(1) 判断单词是否存在
  const wordSet: Set<string> = new Set(wordDict);
  // 记忆化：从某个索引开始的所有拆分方案
  const memo: Map<number, string[]> = new Map();

  // 回溯：返回从索引 start 开始的所有拆分方案
  function backtrack(start: number): string[] {
    // 如果已经计算过，直接返回
    if (memo.has(start)) {
      return memo.get(start)!;
    }
    const result: string[] = [];
    // 走到字符串末尾，加入一个空串作为占位
    if (start === s.length) {
      result.push("");
      return result;
    }
    // 枚举结束位置
    for (let end = start + 1; end <= s.length; end++) {
      const word = s.substring(start, end);
      if (wordSet.has(word)) {
        // 递归求后续拆分方案
        const subList = backtrack(end);
        for (const sub of subList) {
          // 拼接当前单词和后续方案
          result.push(sub === "" ? word : word + " " + sub);
        }
      }
    }
    // 记忆化保存
    memo.set(start, result);
    return result;
  }

  return backtrack(0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 021. 单词拆分 II =====");
console.log(wordBreak("catsanddog", ["cat", "cats", "and", "sand", "dog"]));
// ["cats and dog","cat sand dog"]
console.log(
  wordBreak("pineapplepenapple", [
    "apple",
    "pen",
    "applepen",
    "pine",
    "pineapple",
  ]),
);
// ["pine apple pen apple","pineapple pen apple","pine applepen apple"]
console.log(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"]));
// []
console.log(wordBreak("aaaaa", ["a", "aa", "aaa", "aaaa", "aaaaa"]));
// 多种组合

export {};
