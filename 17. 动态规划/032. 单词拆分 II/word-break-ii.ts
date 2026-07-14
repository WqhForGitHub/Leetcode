// ============================================================
// 032. 单词拆分 II
// ============================================================
// LeetCode 140. Word Break II
// 给定字符串 s 和字典 wordDict，返回所有可能的拆分方案
// 时间复杂度 O(n²·2^n)

// 方法1：DP + 回溯（推荐）
// 先用DP判断可行性，再回溯收集所有方案
// 时间复杂度 O(n²·2^n)，空间复杂度 O(n)
function wordBreak(s: string, wordDict: string[]): string[] {
  const wordSet: Set<string> = new Set<string>(wordDict);
  const n: number = s.length;
  // dp[i] 表示 s[0..i) 能否被拆分
  const dp: boolean[] = new Array<boolean>(n + 1).fill(false);
  dp[0] = true;
  for (let i: number = 1; i <= n; i++) {
    for (let j: number = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }

  const result: string[][] = [];
  const path: string[] = [];

  // 回溯收集所有方案
  function backtrack(start: number): void {
    if (start === n) {
      result.push([...path]);
      return;
    }
    for (let end: number = start + 1; end <= n; end++) {
      // 剪枝：只有剩余部分可拆分才继续
      if (dp[end] && wordSet.has(s.substring(start, end))) {
        path.push(s.substring(start, end));
        backtrack(end);
        path.pop();
      }
    }
  }

  if (dp[n]) {
    backtrack(0);
  }
  return result.map((words: string[]): string => words.join(" "));
}

// 方法2：记忆化递归
// memo[i] 存储从位置i开始的所有拆分方案
// 时间复杂度 O(n²·2^n)，空间复杂度 O(n²)
function wordBreakMemo(s: string, wordDict: string[]): string[] {
  const wordSet: Set<string> = new Set<string>(wordDict);
  const n: number = s.length;
  const memo: Map<number, string[]> = new Map<number, string[]>();

  function dfs(start: number): string[] {
    if (start === n) return [""];
    if (memo.has(start)) return memo.get(start)!;

    const result: string[] = [];
    for (let end: number = start + 1; end <= n; end++) {
      const word: string = s.substring(start, end);
      if (wordSet.has(word)) {
        const subResults: string[] = dfs(end);
        for (const sub of subResults) {
          result.push(sub === "" ? word : word + " " + sub);
        }
      }
    }
    memo.set(start, result);
    return result;
  }

  return dfs(0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 032. 单词拆分 II =====");
console.log(wordBreak("catsanddog", ["cat", "cats", "and", "sand", "dog"])); // 期望结果: ["cats and dog","cat sand dog"]
console.log(wordBreak("pineapplepenapple", ["apple", "pen", "applepen", "pine", "pineapple"])); // 期望结果: ["pine apple pen apple","pineapple pen apple","pine applepen apple"]
console.log(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"])); // 期望结果: []
console.log(wordBreakMemo("catsanddog", ["cat", "cats", "and", "sand", "dog"])); // 期望结果: ["cats and dog","cat sand dog"]
console.log(wordBreakMemo("pineapplepenapple", ["apple", "pen", "applepen", "pine", "pineapple"])); // 期望结果: ["pine apple pen apple","pineapple pen apple","pine applepen apple"]

export {};
