// ============================================================
// 047. 单词规律 II
// ============================================================
// LeetCode 291. Word Pattern II
// 判断字符串 s 是否能匹配模式 pattern（pattern 中每个字符可映射到任意非空子串，
// 需双向一一对应）。通过回溯 + 哈希映射求解。
// 时间复杂度：O(n^m)，n 为 s 长度，m 为 pattern 长度
// 空间复杂度：O(m + n)

function wordPatternMatch(pattern: string, s: string): boolean {
  // 双向哈希映射
  const charToStr = new Map<string, string>();
  const strToChar = new Map<string, string>();

  const backtrack = (pIdx: number, sIdx: number): boolean => {
    // pattern 已全部匹配
    if (pIdx === pattern.length && sIdx === s.length) return true;
    // 只有一边到头说明不匹配
    if (pIdx === pattern.length || sIdx === s.length) return false;

    const ch = pattern[pIdx];

    // 若当前字符已有映射
    if (charToStr.has(ch)) {
      const mapped = charToStr.get(ch)!;
      // 检查 s 中从 sIdx 开始是否匹配该映射
      if (s.startsWith(mapped, sIdx)) {
        return backtrack(pIdx + 1, sIdx + mapped.length);
      }
      return false;
    }

    // 尝试为当前字符分配一个非空子串
    for (let len = 1; len <= s.length - sIdx; len++) {
      const sub = s.substring(sIdx, sIdx + len);
      // 该子串已被其他字符映射，跳过
      if (strToChar.has(sub)) continue;

      // 建立双向映射
      charToStr.set(ch, sub);
      strToChar.set(sub, ch);

      if (backtrack(pIdx + 1, sIdx + len)) return true;

      // 回溯
      charToStr.delete(ch);
      strToChar.delete(sub);
    }
    return false;
  };

  return backtrack(0, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 047. 单词规律 II =====");
console.log(wordPatternMatch("abab", "redblueredblue")); // true
console.log(wordPatternMatch("aaaa", "asdasdasdasd")); // true
console.log(wordPatternMatch("aabb", "xyzabcxzyabc")); // false
console.log(wordPatternMatch("ab", "aa")); // false

export {};
