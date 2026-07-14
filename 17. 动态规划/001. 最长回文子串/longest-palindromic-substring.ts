// ============================================================
// 001. 最长回文子串
// ============================================================
// LeetCode 5. Longest Palindromic Substring
// 给定字符串 s，找到 s 中最长的回文子串
// 时间复杂度 O(n²)

// 方法1：动态规划（推荐）
// dp[i][j] 表示 s[i..j] 是否为回文串
// 状态转移：dp[i][j] = (s[i]==s[j]) && (j-i<2 || dp[i+1][j-1])
// 时间复杂度 O(n²)，空间复杂度 O(n²)
function longestPalindrome(s: string): string {
  const n: number = s.length;
  if (n < 2) return s;
  // dp[i][j] 表示 s[i..j] 是否为回文
  const dp: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  let start: number = 0;
  let maxLen: number = 1;
  // 单个字符都是回文
  for (let i: number = 0; i < n; i++) {
    dp[i][i] = true;
  }
  // 按子串长度递增枚举
  for (let len: number = 2; len <= n; len++) {
    for (let i: number = 0; i <= n - len; i++) {
      const j: number = i + len - 1;
      if (s[i] === s[j]) {
        if (len === 2 || dp[i + 1][j - 1]) {
          dp[i][j] = true;
          if (len > maxLen) {
            maxLen = len;
            start = i;
          }
        }
      }
    }
  }
  return s.substring(start, start + maxLen);
}

// 方法2：中心扩展法（可选第二种解法）
// 从每个中心（字符或字符间隙）向两边扩展，寻找最长回文
// 时间复杂度 O(n²)，空间复杂度 O(1)
function longestPalindrome2(s: string): string {
  const n: number = s.length;
  if (n < 2) return s;
  let start: number = 0;
  let maxLen: number = 1;
  // 从中心向两边扩展
  const expand: (left: number, right: number) => void = (left: number, right: number): void => {
    while (left >= 0 && right < n && s[left] === s[right]) {
      left--;
      right++;
    }
    // 此时 [left+1, right-1] 为回文
    const len: number = right - left - 1;
    if (len > maxLen) {
      maxLen = len;
      start = left + 1;
    }
  };
  for (let i: number = 0; i < n; i++) {
    expand(i, i); // 奇数长度回文
    expand(i, i + 1); // 偶数长度回文
  }
  return s.substring(start, start + maxLen);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 001. 最长回文子串 =====");
console.log(longestPalindrome("babad")); // 期望结果: "bab" (或 "aba")
console.log(longestPalindrome("cbbd")); // 期望结果: "bb"
console.log(longestPalindrome("a")); // 期望结果: "a"
console.log(longestPalindrome("ac")); // 期望结果: "a" (或 "c")
console.log(longestPalindrome2("babad")); // 期望结果: "bab" (或 "aba")

export {};
