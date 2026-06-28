// ============================================================
// 133. 词典中最长的单词
// ============================================================
// LeetCode 720. Longest Word in Dictionary
// 给定字符串数组 words，找出可通过每次添加一个字母构成的最长单词（中间单词都需在词典中）。
// 若有多个长度相同，返回字典序最小的。
// 时间复杂度：O(n*L)，L 为平均长度；空间复杂度：O(n*L)

function longestWord(words: string[]): string {
  // 哈希集合存所有单词
  const wordSet = new Set(words);

  let best = "";
  // 按长度降序、字典序升序排序，便于第一个满足条件者即为答案
  const sorted = [...words].sort((a, b) => {
    if (a.length !== b.length) return b.length - a.length;
    return a < b ? -1 : a > b ? 1 : 0;
  });

  for (const w of sorted) {
    if (w.length < best.length) break;
    // 检查所有前缀是否都在词典中
    let ok = true;
    for (let i = 1; i < w.length; i++) {
      if (!wordSet.has(w.slice(0, i))) {
        ok = false;
        break;
      }
    }
    if (ok) {
      best = w;
      break;
    }
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 133. 词典中最长的单词 =====");
// 测试 1
console.log(longestWord(["w", "wo", "wor", "worl", "world"])); // 期望: "world"
// 测试 2
console.log(longestWord(["a", "banana", "app", "appl", "ap", "apply", "apple"])); // 期望: "apple"
// 测试 3: 字典序比较
console.log(longestWord(["a", "ab", "abc", "abcd", "abcde"])); // 期望: "abcde"

export {};
