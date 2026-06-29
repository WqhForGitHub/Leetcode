// ============================================================
// 158. 最常见的单词
// ============================================================
// LeetCode 819. Most Common Word
// 给定段落 paragraph 和禁用词列表 banned，返回出现次数最多且未禁用的单词（不区分大小写）。
// 时间复杂度：O(n)；空间复杂度：O(n)

function mostCommonWord(paragraph: string, banned: string[]): string {
  // 哈希集合存禁用词（小写）
  const bannedSet = new Set(banned.map((w) => w.toLowerCase()));

  // 提取所有单词（小写）
  // 单词由字母组成，其他字符视为分隔符
  const words = paragraph
    .toLowerCase()
    .split(/[^a-zA-Z]+/)
    .filter((w) => w.length > 0);

  // 哈希表统计频率
  const count = new Map<string, number>();
  let maxCount = 0;
  let result = "";

  for (const w of words) {
    if (bannedSet.has(w)) continue;
    const c = (count.get(w) || 0) + 1;
    count.set(w, c);
    if (c > maxCount) {
      maxCount = c;
      result = w;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 158. 最常见的单词 =====");
console.log(mostCommonWord("Bob hit a ball, the hit BALL flew far after it was hit.", ["hit"])); // 期望: "ball"
console.log(mostCommonWord("a.", [])); // 期望: "a"

export {};
