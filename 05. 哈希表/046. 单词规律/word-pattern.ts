// ============================================================
// 046. 单词规律
// ============================================================
// LeetCode 290. Word Pattern
// 给定一种规律 pattern 和一个字符串 s，判断 s 是否遵循相同的规律。
// 即 pattern 中每个字符与 s 中每个单词双向一一对应。
// 时间复杂度：O(n)，空间复杂度：O(n)

function wordPattern(pattern: string, s: string): boolean {
  const words = s.split(" ");
  // 长度不等直接不匹配
  if (words.length !== pattern.length) return false;

  // 双向哈希映射：char -> word 和 word -> char
  const charToWord = new Map<string, string>();
  const wordToChar = new Map<string, string>();

  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    const word = words[i];

    // 检查 char -> word 映射
    if (charToWord.has(ch)) {
      if (charToWord.get(ch) !== word) return false;
    } else {
      charToWord.set(ch, word);
    }

    // 检查 word -> char 映射
    if (wordToChar.has(word)) {
      if (wordToChar.get(word) !== ch) return false;
    } else {
      wordToChar.set(word, ch);
    }
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 046. 单词规律 =====");
console.log(wordPattern("abba", "dog cat cat dog")); // true
console.log(wordPattern("abba", "dog cat cat fish")); // false
console.log(wordPattern("aaaa", "dog cat cat dog")); // false
console.log(wordPattern("abba", "dog dog dog dog")); // false

export {};
