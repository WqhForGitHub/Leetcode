// ============================================================
// 123. 最长字符串链
// ============================================================
// LeetCode 1048. Longest String Chain
// 单词链：后一个单词比前一个多一个字母（前驱是后继删除一个字母所得）。
// 返回最长单词链长度。

// 方法1：按长度排序 + 哈希表 DP（推荐，时间 O(n log n + n*L^2)，空间 O(n*L)）
// 对每个单词 word，尝试删除每个位置上的字符得到前驱 prev，
// dp[word] = max(dp[prev] + 1)，初值 1。
function longestStrChain(words: string[]): number {
  // 按长度升序，保证处理 word 时其前驱已计算
  words.sort((a, b) => a.length - b.length);
  const dp = new Map<string, number>();
  let result = 0;
  for (const word of words) {
    let best = 1;
    for (let i = 0; i < word.length; i++) {
      const prev = word.substring(0, i) + word.substring(i + 1);
      const val = dp.get(prev);
      if (val !== undefined) {
        best = Math.max(best, val + 1);
      }
    }
    dp.set(word, best);
    result = Math.max(result, best);
  }
  return result;
}

// 方法2：DFS + 记忆化（时间 O(n*L^2)，空间 O(n*L)）
// 以每个单词为终点向前搜索其前驱，记忆化避免重复计算。
function longestStrChain2(words: string[]): number {
  const wordSet = new Set(words);
  const memo = new Map<string, number>();

  const dfs = (word: string): number => {
    const cached = memo.get(word);
    if (cached !== undefined) return cached;
    let best = 1;
    for (let i = 0; i < word.length; i++) {
      const prev = word.substring(0, i) + word.substring(i + 1);
      if (wordSet.has(prev)) {
        best = Math.max(best, dfs(prev) + 1);
      }
    }
    memo.set(word, best);
    return best;
  };

  let result = 0;
  for (const word of words) {
    result = Math.max(result, dfs(word));
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 123. 最长字符串链 =====");
console.log("方法1:", longestStrChain(["a", "b", "ba", "bca", "bda", "bdca"])); // 期望: 4
console.log("方法1:", longestStrChain(["xbc", "pcxbcf", "xb", "cxbc", "pcxbc"])); // 期望: 5
console.log("方法1:", longestStrChain(["abcd", "dbqca"])); // 期望: 1
console.log("方法2:", longestStrChain2(["a", "b", "ba", "bca", "bda", "bdca"])); // 期望: 4
console.log("方法2:", longestStrChain2(["xbc", "pcxbcf", "xb", "cxbc", "pcxbc"])); // 期望: 5

export {};
