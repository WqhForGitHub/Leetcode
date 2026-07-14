// ============================================================
// 019. 分割回文串
// ============================================================
// LeetCode 131. Palindrome Partitioning
// 给定字符串 s，将其分割为若干子串，使每个子串都是回文串。返回所有可能的分割方案。
// 时间复杂度：O(N * 2^N)，空间复杂度：O(N^2)

// 方法1：回溯 + 中心扩展判断回文 (推荐)
// 回溯枚举所有分割位置，用中心扩展法判断子串是否为回文
// 时间复杂度 O(N * 2^N), 空间复杂度 O(N) 递归栈
function partition(s: string): string[][] {
  const result: string[][] = [];
  const path: string[] = [];

  function backtrack(start: number): void {
    // 如果已经处理到字符串末尾，收集结果
    if (start === s.length) {
      result.push([...path]);
      return;
    }

    // 尝试在 start..i 之间切分
    for (let end = start; end < s.length; end++) {
      if (isPalindrome(s, start, end)) {
        path.push(s.substring(start, end + 1));
        backtrack(end + 1);
        path.pop();
      }
    }
  }

  backtrack(0);
  return result;
}

// 中心扩展法判断 s[left..right] 是否为回文
function isPalindrome(s: string, left: number, right: number): boolean {
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

// 方法2：回溯 + DP 预处理回文表
// 先用动态规划预处理出所有子串是否为回文，dp[i][j] 表示 s[i..j] 是否为回文
// 时间复杂度 O(N^2 + 2^N) = O(N * 2^N), 空间复杂度 O(N^2)
function partition2(s: string): string[][] {
  const n: number = s.length;
  const result: string[][] = [];
  const path: string[] = [];

  // DP 预处理回文表
  // dp[i][j] = true 表示 s[i..j] 是回文
  const dp: boolean[][] = new Array(n).fill(null).map(() => new Array(n).fill(false));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      if (s[i] === s[j] && (j - i <= 2 || dp[i + 1][j - 1])) {
        dp[i][j] = true;
      }
    }
  }

  function backtrack(start: number): void {
    if (start === n) {
      result.push([...path]);
      return;
    }
    for (let end = start; end < n; end++) {
      if (dp[start][end]) {
        path.push(s.substring(start, end + 1));
        backtrack(end + 1);
        path.pop();
      }
    }
  }

  backtrack(0);
  return result;
}

// 方法3：回溯 + Manacher 预处理回文表
// 使用 Manacher 算法预处理所有回文子串，然后回溯
// 时间复杂度 O(N + 2^N), 空间复杂度 O(N^2)
function partition3(s: string): string[][] {
  const n: number = s.length;
  const result: string[][] = [];
  const path: string[] = [];

  // 使用 Manacher 算法求出以每个位置为中心的最长回文半径
  // 然后构建回文判断表
  const isPalin: boolean[][] = new Array(n).fill(null).map(() => new Array(n).fill(false));

  // 对每个中心位置进行扩展（包括奇数和偶数长度）
  for (let center = 0; center < n; center++) {
    // 奇数长度回文
    let left: number = center,
      right: number = center;
    while (left >= 0 && right < n && s[left] === s[right]) {
      isPalin[left][right] = true;
      left--;
      right++;
    }
    // 偶数长度回文
    left = center;
    right = center + 1;
    while (left >= 0 && right < n && s[left] === s[right]) {
      isPalin[left][right] = true;
      left--;
      right++;
    }
  }

  function backtrack(start: number): void {
    if (start === n) {
      result.push([...path]);
      return;
    }
    for (let end = start; end < n; end++) {
      if (isPalin[start][end]) {
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
console.log("===== 019. 分割回文串 =====");
console.log(partition("aab")); // 期望结果: [["a","a","b"],["aa","b"]]
console.log(partition2("aab")); // 期望结果: [["a","a","b"],["aa","b"]]
console.log(partition3("aab")); // 期望结果: [["a","a","b"],["aa","b"]]
console.log(partition("a")); // 期望结果: [["a"]]
console.log(partition("racecar")); // 期望结果包含 ["r","a","c","e","c","a","r"] 和 ["r","aceca","r"] 和 ["racecar"] 等

export {};
