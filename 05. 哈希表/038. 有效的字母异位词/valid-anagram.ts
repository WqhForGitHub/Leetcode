// ============================================================
// 038. 有效的字母异位词
// ============================================================
// LeetCode 242. Valid Anagram
// 判断两字符串是否是字母异位词。哈希表计数。
// 时间复杂度：O(n)，空间复杂度：O(1)（字符集大小固定为 26）

/**
 * 使用哈希表（对象）统计字符频次
 * 先对 s 中字符计数，再对 t 中字符减计数
 * 最后检查所有计数是否归零
 */
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const count: Record<string, number> = {};

  // 统计 s 中字符出现次数
  for (const ch of s) {
    count[ch] = (count[ch] ?? 0) + 1;
  }

  // 减去 t 中字符出现次数
  for (const ch of t) {
    if (!count[ch]) {
      return false;
    }
    count[ch]--;
  }

  // 检查所有计数是否归零
  for (const key in count) {
    if (count[key] !== 0) {
      return false;
    }
  }

  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 038. 有效的字母异位词 =====");
// 测试 1: 有效的字母异位词
console.log(isAnagram("anagram", "nagaram")); // 期望输出: true

// 测试 2: 非字母异位词
console.log(isAnagram("rat", "car")); // 期望输出: false

// 测试 3: 长度不同
console.log(isAnagram("ab", "a")); // 期望输出: false

// 测试 4: 空字符串
console.log(isAnagram("", "")); // 期望输出: true

export {};
