// ============================================================
// 006. 串联所有单词的子串
// ============================================================
// LeetCode 30. Substring with Concatenation of All Words
// 在 s 中找所有子串，是 words 中所有单词的串联（每个单词恰好出现一次）。
// 滑动窗口 + 哈希表计数。
// 时间复杂度：O(n * m)，空间复杂度：O(m * k)

function findSubstring(s: string, words: string[]): number[] {
  const result: number[] = [];
  if (words.length === 0) return result;
  const wordLen = words[0].length;
  const wordCount = words.length;
  const totalLen = wordLen * wordCount;
  if (s.length < totalLen) return result;

  // 统计 words 中每个单词需要的数量
  const wordMap = new Map<string, number>();
  for (const word of words) {
    wordMap.set(word, (wordMap.get(word) ?? 0) + 1);
  }

  // 按起始位置模 wordLen 分组进行滑动窗口
  for (let start = 0; start < wordLen; start++) {
    let left = start;
    const seen = new Map<string, number>();
    let count = 0;
    for (let right = start; right + wordLen <= s.length; right += wordLen) {
      const word = s.slice(right, right + wordLen);
      if (wordMap.has(word)) {
        seen.set(word, (seen.get(word) ?? 0) + 1);
        count++;
        // 若当前单词数量超过需求，左边界右移
        while (seen.get(word)! > wordMap.get(word)!) {
          const leftWord = s.slice(left, left + wordLen);
          seen.set(leftWord, seen.get(leftWord)! - 1);
          count--;
          left += wordLen;
        }
        if (count === wordCount) {
          result.push(left);
          const leftWord = s.slice(left, left + wordLen);
          seen.set(leftWord, seen.get(leftWord)! - 1);
          count--;
          left += wordLen;
        }
      } else {
        // 遇到不在 words 中的单词，重置窗口
        seen.clear();
        count = 0;
        left = right + wordLen;
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 006. 串联所有单词的子串 =====");
console.log("测试1:", findSubstring("barfoothefoobarman", ["foo", "bar"])); // 预期: [0, 9]
console.log("测试2:", findSubstring("wordgoodgoodgoodbestword", ["word", "good", "best", "word"])); // 预期: []
console.log("测试3:", findSubstring("barfoofoobarthefoobarman", ["bar", "foo", "the"])); // 预期: [6, 9, 12]

export {};
