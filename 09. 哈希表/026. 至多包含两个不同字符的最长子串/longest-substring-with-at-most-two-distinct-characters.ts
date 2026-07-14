// ============================================================
// 026. 至多包含两个不同字符的最长子串
// ============================================================
// LeetCode 159. Longest Substring with At Most Two Distinct Characters
// 给定字符串 s，找出至多包含两个不同字符的最长子串长度。
// 滑动窗口 + 哈希表（记录窗口内各字符出现次数）。
// 时间复杂度：O(n)，空间复杂度：O(1)（字符集有限）

function lengthOfLongestSubstringTwoDistinct(s: string): number {
  const n = s.length;
  if (n <= 2) {
    return n;
  }

  // 哈希表：字符 -> 窗口内出现次数
  const charCount: Map<string, number> = new Map();
  let left = 0;
  let maxLen = 0;

  // 右指针扩展窗口
  for (let right = 0; right < n; right++) {
    const ch = s[right];
    charCount.set(ch, (charCount.get(ch) || 0) + 1);

    // 当窗口内不同字符超过 2 时，收缩左边界
    while (charCount.size > 2) {
      const leftCh = s[left];
      const cnt = charCount.get(leftCh)! - 1;
      if (cnt === 0) {
        charCount.delete(leftCh);
      } else {
        charCount.set(leftCh, cnt);
      }
      left++;
    }

    // 更新最大长度
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 026. 至多包含两个不同字符的最长子串 =====");
console.log(lengthOfLongestSubstringTwoDistinct("eceba")); // 3 ("ece")
console.log(lengthOfLongestSubstringTwoDistinct("ccaabbb")); // 5 ("aabbb")
console.log(lengthOfLongestSubstringTwoDistinct("a")); // 1
console.log(lengthOfLongestSubstringTwoDistinct("abcabcabc")); // 2

export {};
