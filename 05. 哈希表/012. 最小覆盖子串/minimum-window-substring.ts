// ============================================================
// 012. 最小覆盖子串
// ============================================================
// LeetCode 76. Minimum Window Substring
// 给定字符串 s 和 t，返回 s 中涵盖 t 所有字符的最小子串。如果不存在返回空串。
// 使用滑动窗口 + 哈希表（计数数组）。
// 时间复杂度：O(m+n)，空间复杂度：O(字符集大小)

function minWindow(s: string, t: string): string {
  if (s.length < t.length) return "";

  // 用哈希表记录 t 中每个字符的需求量
  const need = new Map<string, number>();
  for (const ch of t) {
    need.set(ch, (need.get(ch) || 0) + 1);
  }

  // 滑动窗口
  const window = new Map<string, number>();
  let left = 0;
  let right = 0;
  let valid = 0; // 窗口中满足需求的字符种类数

  let start = 0;
  let minLen = Infinity;

  while (right < s.length) {
    const c = s[right];
    right++;

    if (need.has(c)) {
      window.set(c, (window.get(c) || 0) + 1);
      if (window.get(c) === need.get(c)) {
        valid++;
      }
    }

    // 当窗口满足所有需求时，尝试收缩左边界
    while (valid === need.size) {
      // 更新最小子串
      if (right - left < minLen) {
        start = left;
        minLen = right - left;
      }

      const d = s[left];
      left++;

      if (need.has(d)) {
        if (window.get(d) === need.get(d)) {
          valid--;
        }
        window.set(d, window.get(d)! - 1);
      }
    }
  }

  return minLen === Infinity ? "" : s.substring(start, start + minLen);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 012. 最小覆盖子串 =====");
console.log(minWindow("ADOBECODEBANC", "ABC")); // "BANC"
console.log(minWindow("a", "a")); // "a"
console.log(minWindow("a", "aa")); // ""
console.log(minWindow("aa", "aa")); // "aa"

export {};
