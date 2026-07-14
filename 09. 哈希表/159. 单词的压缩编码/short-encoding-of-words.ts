// ============================================================
// 159. 单词的压缩编码
// ============================================================
// LeetCode 820. Short Encoding of Words
// 给定单词数组，将其编码为索引数组。若某单词是另一单词的后缀，则不需额外编码。
// 求最小编码长度（每个单词编码后加 '#' 终止符）。
// 时间复杂度：O(N*L^2)，L 为单词长度；空间复杂度：O(N*L)

// 思路：若某单词是另一单词的后缀，则可共享编码
// 用哈希集合存所有单词，删除是其他单词后缀的单词
function minimumLengthEncoding(words: string[]): number {
  // 去重
  const wordSet = new Set(words);

  // 对每个单词，删除其所有后缀（除去自身）若存在于集合中
  for (const w of wordSet) {
    for (let i = 1; i < w.length; i++) {
      const suffix = w.slice(i);
      if (wordSet.has(suffix)) {
        wordSet.delete(suffix);
      }
    }
  }

  // 剩余单词长度 + 1（每个加 '#'）
  let total = 0;
  for (const w of wordSet) {
    total += w.length + 1;
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 159. 单词的压缩编码 =====");
console.log(minimumLengthEncoding(["me", "time"])); // 期望: 5 ("time#")
console.log(minimumLengthEncoding(["t"])); // 期望: 2 ("t#")
console.log(minimumLengthEncoding(["time", "me", "bell"])); // 期望: 10 ("time#bell#")

export {};
