// ============================================================
// 178. 重新排列句子中的单词
// ============================================================
// LeetCode 1451. Rearrange Words in a Sentence
// 给定句子 text（首字母大写，单词以单空格分隔）。
// 按单词长度升序重排，长度相同保持原顺序（稳定排序），
// 重排后首字母大写，其余小写。

// 方法1：稳定排序按长度（O(n log n)）
// 现代规范 Array.sort 是稳定的，仅按长度比较即可。
function arrangeWords(text: string): string {
  const words = text.split(" ");
  words[0] = words[0].toLowerCase();
  words.sort((a, b) => a.length - b.length);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ");
}

// 方法2：拆分 + 索引映射 + 排序（O(n log n)）
// 显式带上原索引，按 (长度, 索引) 排序，保证稳定。
function arrangeWords2(text: string): string {
  const words = text.toLowerCase().split(" ");
  const indexed = words.map((w, i) => ({ word: w, idx: i }));
  indexed.sort((a, b) => {
    if (a.word.length !== b.word.length) return a.word.length - b.word.length;
    return a.idx - b.idx;
  });
  const sorted = indexed.map((x) => x.word);
  sorted[0] = sorted[0].charAt(0).toUpperCase() + sorted[0].slice(1);
  return sorted.join(" ");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 178. 重新排列句子中的单词 =====");
console.log("方法1 Leetcode is cool:", arrangeWords("Leetcode is cool")); // "Is cool leetcode"
console.log("方法1 Keep calm and code on:", arrangeWords("Keep calm and code on")); // "On and keep calm code"
console.log("方法1 To be or not to be:", arrangeWords("To be or not to be")); // "To be or to be not"
console.log("方法2 Leetcode is cool:", arrangeWords2("Leetcode is cool")); // "Is cool leetcode"
console.log("方法2 Keep calm and code on:", arrangeWords2("Keep calm and code on")); // "On and keep calm code"
console.log("方法2 To be or not to be:", arrangeWords2("To be or not to be")); // "To be or to be not"

export {};
