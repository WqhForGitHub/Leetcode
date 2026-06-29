// ============================================================
// 126. 前K个高频单词
// ============================================================
// LeetCode 692. Top K Frequent Words
// 给定单词列表，返回前 k 个出现次数最多的单词，频率相同按字典序升序排列。
// 时间复杂度：O(n log k)，空间复杂度：O(n)

function topKFrequent(words: string[], k: number): string[] {
  // 哈希表统计频率
  const freq = new Map<string, number>();
  for (const w of words) {
    freq.set(w, (freq.get(w) || 0) + 1);
  }

  // 取出所有单词
  const uniqueWords = Array.from(freq.keys());

  // 排序：频率降序，相同频率按字典序升序
  uniqueWords.sort((a, b) => {
    const fa = freq.get(a)!;
    const fb = freq.get(b)!;
    if (fa !== fb) return fb - fa; // 频率降序
    return a < b ? -1 : a > b ? 1 : 0; // 字典序升序
  });

  return uniqueWords.slice(0, k);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 126. 前K个高频单词 =====");
// 测试 1
console.log(topKFrequent(["i", "love", "leetcode", "i", "love", "coding"], 2)); // 期望: ["i", "love"]
// 测试 2
console.log(
  topKFrequent(["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], 4),
); // 期望: ["the", "is", "sunny", "day"]
// 测试 3: 频率相同按字典序
console.log(topKFrequent(["a", "b", "c", "a", "b", "c"], 3)); // 期望: ["a","b","c"]

export {};
