// ============================================================
// 029. 分割回文串
// ============================================================
// LeetCode 131. Palindrome Partitioning
// 给定字符串 s，返回所有可能的回文分割方案。
// 时间复杂度 O(n * 2^n)，空间复杂度 O(n²)

// 方法1：DP预处理 + 回溯（推荐）
// 先用 DP 预处理 dp[i][j] 表示 s[i..j] 是否为回文
// 再用回溯收集所有分割方案
// 时间复杂度 O(n * 2^n)，空间复杂度 O(n²)
function partition(s: string): string[][] {
  const n: number = s.length;
  // dp[i][j] 表示 s[i..j] 是否为回文
  const dp: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));

  // 预处理回文判断
  for (let i: number = n - 1; i >= 0; i--) {
    for (let j: number = i; j < n; j++) {
      if (s[i] === s[j] && (j - i <= 1 || dp[i + 1][j - 1])) {
        dp[i][j] = true;
      }
    }
  }

  const result: string[][] = [];
  const path: string[] = [];

  // 回溯搜索所有分割方案
  function backtrack(start: number): void {
    if (start === n) {
      // 已经分割完整个字符串
      result.push([...path]);
      return;
    }
    for (let end: number = start; end < n; end++) {
      if (dp[start][end]) {
        // s[start..end] 是回文，加入当前路径
        path.push(s.substring(start, end + 1));
        backtrack(end + 1);
        path.pop(); // 回溯
      }
    }
  }

  backtrack(0);
  return result;
}

// 方法2：回溯 + 记忆化
// 直接在回溯中判断回文，使用记忆化加速
// 时间复杂度 O(n * 2^n)，空间复杂度 O(n²)
function partition2(s: string): string[][] {
  const n: number = s.length;
  const memo: Map<string, boolean> = new Map();

  // 记忆化判断回文
  function isPalindrome(left: number, right: number): boolean {
    const key: string = `${left},${right}`;
    if (memo.has(key)) return memo.get(key)!;
    let result: boolean;
    if (left >= right) {
      result = true;
    } else if (s[left] !== s[right]) {
      result = false;
    } else {
      result = isPalindrome(left + 1, right - 1);
    }
    memo.set(key, result);
    return result;
  }

  const result: string[][] = [];
  const path: string[] = [];

  function backtrack(start: number): void {
    if (start === n) {
      result.push([...path]);
      return;
    }
    for (let end: number = start; end < n; end++) {
      if (isPalindrome(start, end)) {
        path.push(s.substring(start, end + 1));
        backtrack(end + 1);
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
console.log("===== 029. 分割回文串 =====");
console.log(partition("aab")); // 期望结果: [["a","a","b"],["aa","b"]]
console.log(partition("a")); // 期望结果: [["a"]]
console.log(partition2("aab")); // 期望结果: [["a","a","b"],["aa","b"]]
console.log(partition2("a")); // 期望结果: [["a"]]
console.log(partition("racecar")); // 期望结果: 含 ["r","a","c","e","c","a","r"] 和 ["r","aceca","r"] 和 ["racecar"] 等

export {};
