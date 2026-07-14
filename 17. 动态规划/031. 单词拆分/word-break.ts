// ============================================================
// 031. 单词拆分
// ============================================================
// LeetCode 139. Word Break
// 给定字符串 s 和字典 wordDict，判断 s 是否可以被拆分为字典中的单词
// 时间复杂度 O(n²·m)

// 方法1：动态规划（推荐）
// dp[i] 表示 s[0..i) 是否可以被拆分
// 状态转移：dp[i] = any(dp[j] && wordDict.includes(s[j..i])) for j in [0, i)
// 时间复杂度 O(n²·m)，空间复杂度 O(n)
function wordBreak(s: string, wordDict: string[]): boolean {
  const wordSet: Set<string> = new Set<string>(wordDict);
  const n: number = s.length;
  // dp[i] 表示 s[0..i) 能否被拆分
  const dp: boolean[] = new Array<boolean>(n + 1).fill(false);
  dp[0] = true; // 空字符串可以被拆分

  // 遍历每个结束位置
  for (let i: number = 1; i <= n; i++) {
    // 尝试所有分割点 j
    for (let j: number = 0; j < i; j++) {
      // 状态转移：s[0..j) 可拆分 且 s[j..i) 在字典中
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break; // 只要找到一个可行分割即可
      }
    }
  }
  return dp[n];
}

// 方法2：BFS广度优先搜索
// 将字符串看作图，节点为位置索引，若 s[j..i) 在字典中则 j->i 有边
// 从位置0开始BFS，看能否到达位置n
// 时间复杂度 O(n²·m)，空间复杂度 O(n)
function wordBreakBFS(s: string, wordDict: string[]): boolean {
  const wordSet: Set<string> = new Set<string>(wordDict);
  const n: number = s.length;
  const visited: boolean[] = new Array<boolean>(n + 1).fill(false);
  const queue: number[] = [0];
  visited[0] = true;

  while (queue.length > 0) {
    const start: number = queue.shift()!;
    // 如果已经到达末尾，返回true
    if (start === n) return true;
    // 尝试所有可能的结束位置
    for (let end: number = start + 1; end <= n; end++) {
      if (!visited[end] && wordSet.has(s.substring(start, end))) {
        visited[end] = true;
        queue.push(end);
      }
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 031. 单词拆分 =====");
console.log(wordBreak("leetcode", ["leet", "code"])); // 期望结果: true
console.log(wordBreak("applepenapple", ["apple", "pen"])); // 期望结果: true
console.log(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"])); // 期望结果: false
console.log(wordBreakBFS("leetcode", ["leet", "code"])); // 期望结果: true
console.log(wordBreak("cars", ["car", "ca", "rs"])); // 期望结果: true

export {};
