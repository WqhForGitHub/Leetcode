// ============================================================
// 074. 最长回文串
// ============================================================
// LeetCode 409. Longest Palindrome
// 用给定字符构造能形成的最长回文串长度
// 思路：哈希表统计每个字符频次，偶数全用，奇数取偶数部分，最后可放一个奇数字符在中间
// 时间复杂度：O(n)，空间复杂度：O(字母数)

function longestPalindrome(s: string): number {
  // 统计字符频次
  const count: Record<string, number> = {};
  for (const c of s) {
    count[c] = (count[c] || 0) + 1;
  }

  let length = 0;
  let hasOdd = false;

  for (const key in count) {
    if (count[key] % 2 === 0) {
      // 偶数次全部成对使用
      length += count[key];
    } else {
      // 奇数次取偶数部分
      length += count[key] - 1;
      hasOdd = true;
    }
  }

  // 若存在奇数次字符，可取一个放正中间
  return hasOdd ? length + 1 : length;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 074. 最长回文串 =====");
console.log(longestPalindrome("abccccdd")); // 期望输出: 7 (如 dccaccd)
console.log(longestPalindrome("a")); // 期望输出: 1
console.log(longestPalindrome("bb")); // 期望输出: 2

export {};
