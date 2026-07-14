// ============================================================
// 077. 替换后的最长重复字符
// ============================================================
// LeetCode 424. Longest Repeating Character Replacement
// 最多替换 k 个字符，使最长重复子串尽可能长
// 思路：滑动窗口 + 哈希表计数，窗口内最多需替换 (窗口长度 - 最高频字符次数) 个字符
//       若超过 k 则收缩左端
// 时间复杂度：O(n)，空间复杂度：O(字母数)

function characterReplacement(s: string, k: number): number {
  const count: Record<string, number> = {};
  let left = 0;
  // 窗口内出现次数最多的字符次数
  let maxCount = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    count[c] = (count[c] || 0) + 1;
    maxCount = Math.max(maxCount, count[c]);

    // 窗口内需替换的字符数 = 窗口长度 - 最高频字符次数
    // 若超过 k，收缩左端
    while (right - left + 1 - maxCount > k) {
      count[s[left]]--;
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 077. 替换后的最长重复字符 =====");
console.log(characterReplacement("ABAB", 2)); // 期望输出: 4 (替换两个 A 或 B)
console.log(characterReplacement("AABABBA", 1)); // 期望输出: 4
console.log(characterReplacement("AAAA", 2)); // 期望输出: 4

export {};
