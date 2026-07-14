// ============================================================
// 027. 单词规律 II
// ============================================================
// LeetCode 291. Word Pattern II
// 给定模式 pattern 和字符串 s，判断 s 是否遵循 pattern 的双射规律（pattern 字符到子串的双射）。
// 时间复杂度：O(N^M)，N 为 s 长度，M 为 pattern 长度，空间复杂度：O(M + N)

// 方法1：回溯 + 双映射表 (推荐)
// 使用两个映射表：pattern 字符 -> 子串，子串 -> pattern 字符
// 回溯尝试每个 pattern 字符对应不同长度的子串
// 时间复杂度 O(N^M), 空间复杂度 O(M + N)
function wordPatternMatch(pattern: string, s: string): boolean {
  // pattern 字符 -> 对应子串
  const charToWord: Map<string, string> = new Map();
  // 子串 -> pattern 字符
  const wordToChar: Map<string, string> = new Map();

  function backtrack(pIndex: number, sIndex: number): boolean {
    // pattern 已全部匹配
    if (pIndex === pattern.length) {
      return sIndex === s.length;
    }

    // s 已用完但 pattern 未匹配完
    if (sIndex === s.length) {
      return false;
    }

    const ch: string = pattern[pIndex];

    // 如果当前 pattern 字符已有映射
    if (charToWord.has(ch)) {
      const mappedWord: string = charToWord.get(ch)!;
      // 检查 s 从 sIndex 开始是否匹配映射的子串
      if (s.substring(sIndex, sIndex + mappedWord.length) === mappedWord) {
        return backtrack(pIndex + 1, sIndex + mappedWord.length);
      }
      return false;
    }

    // 尝试不同长度的子串
    for (let len = 1; len <= s.length - sIndex; len++) {
      const word: string = s.substring(sIndex, sIndex + len);

      // 如果子串已被其他 pattern 字符映射，跳过
      if (wordToChar.has(word)) {
        continue;
      }

      // 建立映射
      charToWord.set(ch, word);
      wordToChar.set(word, ch);

      if (backtrack(pIndex + 1, sIndex + len)) {
        return true;
      }

      // 回溯
      charToWord.delete(ch);
      wordToChar.delete(word);
    }

    return false;
  }

  return backtrack(0, 0);
}

// 方法2：回溯 + 剪枝
// 在方法1基础上增加剪枝：根据剩余 pattern 字符数和剩余字符串长度进行剪枝
// 时间复杂度 O(N^M) 但剪枝后更快, 空间复杂度 O(M + N)
function wordPatternMatch2(pattern: string, s: string): boolean {
  const charToWord: Map<string, string> = new Map();
  const wordToChar: Map<string, string> = new Map();

  // 记录每个 pattern 字符的出现次数（用于剪枝）
  const charCount: Map<string, number> = new Map();
  for (const ch of pattern) {
    charCount.set(ch, (charCount.get(ch) || 0) + 1);
  }

  function backtrack(pIndex: number, sIndex: number): boolean {
    // pattern 和 s 同时匹配完
    if (pIndex === pattern.length) {
      return sIndex === s.length;
    }

    // pattern 已匹配完但 s 未完
    if (pIndex === pattern.length) {
      return false;
    }

    // s 已用完但 pattern 未完
    if (sIndex === s.length) {
      return false;
    }

    // 剪枝：剩余 s 长度不足（每个未映射的 pattern 字符至少占 1 个字符）
    const remainingPattern: number = pattern.length - pIndex;
    if (s.length - sIndex < remainingPattern) {
      return false;
    }

    const ch: string = pattern[pIndex];

    // 如果当前 pattern 字符已有映射
    if (charToWord.has(ch)) {
      const mappedWord: string = charToWord.get(ch)!;
      if (s.substring(sIndex, sIndex + mappedWord.length) === mappedWord) {
        return backtrack(pIndex + 1, sIndex + mappedWord.length);
      }
      return false;
    }

    // 剪枝：计算剩余未映射的 pattern 字符数
    // 已映射的 pattern 字符占用固定长度，未映射的至少各占 1 个字符
    let remainingUnmapped: number = 0;
    for (let i = pIndex; i < pattern.length; i++) {
      if (!charToWord.has(pattern[i])) {
        remainingUnmapped++;
      }
    }

    // 尝试不同长度的子串（最大长度为剩余长度减去剩余未映射字符数 + 1）
    const maxLen: number = s.length - sIndex - remainingUnmapped + 1;
    for (let len = 1; len <= maxLen; len++) {
      const word: string = s.substring(sIndex, sIndex + len);

      // 如果子串已被其他 pattern 字符映射，跳过
      if (wordToChar.has(word)) {
        continue;
      }

      // 建立映射
      charToWord.set(ch, word);
      wordToChar.set(word, ch);

      if (backtrack(pIndex + 1, sIndex + len)) {
        return true;
      }

      // 回溯
      charToWord.delete(ch);
      wordToChar.delete(word);
    }

    return false;
  }

  return backtrack(0, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 027. 单词规律 II =====");
console.log(wordPatternMatch("abab", "redblueredblue")); // 期望结果: true
console.log(wordPatternMatch2("abab", "redblueredblue")); // 期望结果: true
console.log(wordPatternMatch("aaaa", "asdasdasdasd")); // 期望结果: true
console.log(wordPatternMatch2("aaaa", "asdasdasdasd")); // 期望结果: true
console.log(wordPatternMatch("aabb", "xyzabcxzyabc")); // 期望结果: false
console.log(wordPatternMatch2("aabb", "xyzabcxzyabc")); // 期望结果: false
console.log(wordPatternMatch("ab", "aa")); // 期望结果: false (双射要求 a->a, b->a 不行)
console.log(wordPatternMatch2("ab", "aa")); // 期望结果: false

export {};
