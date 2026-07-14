// ============================================================
// 020. 单词拆分 II
// ============================================================
// LeetCode 140. Word Break II
// 给定字符串 s 和单词字典 wordDict，在 s 中添加空格构成句子，使每个词在字典中。返回所有可能句子。
// 时间复杂度：O(2^N * N)，空间复杂度：O(N^2)

// 方法1：回溯 + 记忆化 (推荐)
// 用 DFS 回溯枚举所有切分点，使用记忆化缓存中间结果避免重复计算
// 时间复杂度 O(2^N * N), 空间复杂度 O(N^2)
function wordBreak(s: string, wordDict: string[]): string[] {
  const wordSet: Set<string> = new Set(wordDict);
  const memo: Map<number, string[]> = new Map();

  function dfs(start: number): string[] {
    // 如果已经计算过，直接返回
    if (memo.has(start)) {
      return memo.get(start)!;
    }

    const result: string[] = [];

    // 如果到达字符串末尾，返回空字符串作为标记
    if (start === s.length) {
      result.push("");
      return result;
    }

    // 尝试每个可能的结束位置
    for (let end = start + 1; end <= s.length; end++) {
      const word: string = s.substring(start, end);
      if (wordSet.has(word)) {
        // 递归处理剩余部分
        const subSentences: string[] = dfs(end);
        for (const sub of subSentences) {
          if (sub === "") {
            result.push(word);
          } else {
            result.push(word + " " + sub);
          }
        }
      }
    }

    memo.set(start, result);
    return result;
  }

  return dfs(0);
}

// 方法2：回溯（无记忆化）
// 纯回溯枚举所有切分点，不使用记忆化（可能超时，但适用于小规模输入）
// 时间复杂度 O(2^N * N), 空间复杂度 O(N) 递归栈
function wordBreak2(s: string, wordDict: string[]): string[] {
  const wordSet: Set<string> = new Set(wordDict);
  const result: string[] = [];
  const path: string[] = [];

  function backtrack(start: number): void {
    // 到达末尾，收集结果
    if (start === s.length) {
      result.push(path.join(" "));
      return;
    }

    // 尝试每个可能的单词
    for (let end = start + 1; end <= s.length; end++) {
      const word: string = s.substring(start, end);
      if (wordSet.has(word)) {
        path.push(word);
        backtrack(end);
        path.pop();
      }
    }
  }

  backtrack(0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 020. 单词拆分 II =====");
console.log(wordBreak("catsanddog", ["cat", "cats", "and", "sand", "dog"]));
// 期望结果: ["cats and dog","cat sand dog"]
console.log(wordBreak2("catsanddog", ["cat", "cats", "and", "sand", "dog"]));
// 期望结果: ["cats and dog","cat sand dog"]
console.log(wordBreak("pineapplepenapple", ["apple", "pen", "applepen", "pine", "pineapple"]));
// 期望结果: ["pine apple pen apple","pine applepen apple","pineapple pen apple"]
console.log(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"]));
// 期望结果: []

export {};
