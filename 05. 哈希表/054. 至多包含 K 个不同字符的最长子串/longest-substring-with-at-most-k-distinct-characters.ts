// ============================================================
// 054. 至多包含 K 个不同字符的最长子串
// ============================================================
// LeetCode 340. Longest Substring with At Most K Distinct Characters
// 给定字符串 s 和整数 k，找到至多包含 k 个不同字符的最长子串长度。
// 时间复杂度：O(n)，空间复杂度：O(k)

// 滑动窗口 + 哈希表
// 哈希表记录窗口内每个字符的出现次数
function lengthOfLongestSubstringKDistinct(s: string, k: number): number {
  if (k === 0 || s.length === 0) return 0;

  // 哈希表：字符 -> 窗口内出现次数
  const charCount = new Map<string, number>();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    // 右指针字符加入窗口
    charCount.set(s[right], (charCount.get(s[right]) || 0) + 1);

    // 当不同字符数超过 k 时，收缩左指针
    while (charCount.size > k) {
      const leftChar = s[left];
      const count = charCount.get(leftChar)!;
      if (count === 1) {
        charCount.delete(leftChar);
      } else {
        charCount.set(leftChar, count - 1);
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
console.log("===== 054. 至多包含 K 个不同字符的最长子串 =====");

// 测试 1
console.log(lengthOfLongestSubstringKDistinct("eceba", 2)); // 期望: 3 ("ece")

// 测试 2
console.log(lengthOfLongestSubstringKDistinct("aa", 1)); // 期望: 2 ("aa")

// 测试 3: 所有字符都不同，最多 3 个不同字符时最长为 3
console.log(lengthOfLongestSubstringKDistinct("a@b#c$d%e", 3)); // 期望: 3

// 测试 4
console.log(lengthOfLongestSubstringKDistinct("abcabcabc", 3)); // 期望: 9

export {};
