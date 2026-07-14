// ============================================================
// 002. 无重复字符的最长子串
// ============================================================
// LeetCode 3. Longest Substring Without Repeating Characters
// 给定一个字符串 s，找出其中不含有重复字符的最长子串的长度。
// 滑动窗口 + 哈希表 O(n)。
// 时间复杂度：O(n)，空间复杂度：O(min(n, 字符集大小))

function lengthOfLongestSubstring(s: string): number {
  const charIndex = new Map<string, number>();
  let left = 0;
  let maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (charIndex.has(ch) && charIndex.get(ch)! >= left) {
      left = charIndex.get(ch)! + 1;
    }
    charIndex.set(ch, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 002. 无重复字符的最长子串 =====");
console.log("测试1:", lengthOfLongestSubstring("abcabcbb")); // 预期: 3
console.log("测试2:", lengthOfLongestSubstring("bbbbb")); // 预期: 1
console.log("测试3:", lengthOfLongestSubstring("pwwkew")); // 预期: 3
console.log("测试4:", lengthOfLongestSubstring("")); // 预期: 0

export {};
