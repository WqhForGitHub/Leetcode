// ============================================================
// 020. 单词拆分
// ============================================================
// LeetCode 139. Word Break
// 给定字符串 s 和单词字典 wordDict，判断 s 是否可以被拆分为一个或多个字典中的单词。
// 使用动态规划 + 哈希集合。
// 时间复杂度：O(n^2 * L)，n 为字符串长度，L 为单词平均长度
// 空间复杂度：O(n + m*wordLen)，m 为单词数

function wordBreak(s: string, wordDict: string[]): boolean {
  // 将字典存入哈希集合，便于 O(1) 查询
  const wordSet = new Set<string>(wordDict);

  // dp[i] 表示 s[0..i-1] 能否被拆分
  const dp: boolean[] = new Array(s.length + 1).fill(false);
  dp[0] = true; // 空串可以拆分

  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      // 若 s[0..j-1] 可拆分，且 s[j..i-1] 在字典中，则 s[0..i-1] 可拆分
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[s.length];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 020. 单词拆分 =====");
console.log(wordBreak("leetcode", ["leet", "code"])); // true
console.log(wordBreak("applepenapple", ["apple", "pen"])); // true
console.log(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"])); // false
console.log(wordBreak("aaaaaaa", ["aaaa", "aaa"])); // true

export {};
