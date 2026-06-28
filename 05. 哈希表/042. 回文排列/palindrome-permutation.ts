// ============================================================
// 042. 回文排列
// ============================================================
// LeetCode 266. Palindrome Permutation
// 判断给定字符串是否能排列成一个回文串。
// 时间复杂度：O(n)，空间复杂度：O(k)，k 为字符集大小

function canPermutePalindrome(s: string): boolean {
  // 哈希表统计每个字符的出现次数
  const count = new Map<string, number>();
  for (const ch of s) {
    count.set(ch, (count.get(ch) ?? 0) + 1);
  }

  // 回文串中至多有一个字符出现奇数次
  let oddCount = 0;
  for (const v of count.values()) {
    if (v % 2 !== 0) oddCount++;
    if (oddCount > 1) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 042. 回文排列 =====");
console.log(canPermutePalindrome("code")); // false
console.log(canPermutePalindrome("aab")); // true
console.log(canPermutePalindrome("carerac")); // true
console.log(canPermutePalindrome("aabbcc")); // true

export {};
