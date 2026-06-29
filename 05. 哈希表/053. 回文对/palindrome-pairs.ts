// ============================================================
// 053. 回文对
// ============================================================
// LeetCode 336. Palindrome Pairs
// 给定一组唯一单词，找出所有索引对 (i, j)，使得 words[i] + words[j] 是回文串。
// 时间复杂度：O(n * k^2)，n 为单词数，k 为单词平均长度
// 空间复杂度：O(n * k)

// 哈希表存储单词 -> 索引，对每个单词尝试所有分割点
function palindromePairs(words: string[]): number[][] {
  // 哈希表：单词 -> 索引
  const wordIndexMap = new Map<string, number>();
  for (let i = 0; i < words.length; i++) {
    wordIndexMap.set(words[i], i);
  }

  const result: number[][] = [];
  const emptyIdx = wordIndexMap.get("");

  // 判断字符串是否为回文
  function isPalindrome(s: string, left: number, right: number): boolean {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  }

  // 翻转字符串
  function reverse(s: string): string {
    return s.split("").reverse().join("");
  }

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // 情况 1: 空字符串与任何回文单词可组成回文对
    if (word !== "" && emptyIdx !== undefined && isPalindrome(word, 0, word.length - 1)) {
      result.push([emptyIdx, i]);
      result.push([i, emptyIdx]);
    }

    // 情况 2: 当前单词的翻转存在于哈希表中（且不是自身）
    const reversedWord = reverse(word);
    if (reversedWord !== word) {
      const revIdx = wordIndexMap.get(reversedWord);
      if (revIdx !== undefined && revIdx !== i) {
        result.push([i, revIdx]);
      }
    }

    // 情况 3: 将单词分割为前后两部分
    // 若前缀是回文，查找后缀的翻转是否存在 -> [翻转, 前缀回文部分, 后缀]
    // 若后缀是回文，查找前缀的翻转是否存在 -> [前缀, 后缀回文部分, 翻转]
    for (let j = 1; j < word.length; j++) {
      // 前缀 word[0..j-1] 是回文，则查找 reverse(word[j..end])
      if (isPalindrome(word, 0, j - 1)) {
        const target = reverse(word.substring(j));
        const targetIdx = wordIndexMap.get(target);
        if (targetIdx !== undefined && targetIdx !== i) {
          result.push([targetIdx, i]);
        }
      }
      // 后缀 word[j..end] 是回文，则查找 reverse(word[0..j-1])
      if (isPalindrome(word, j, word.length - 1)) {
        const target = reverse(word.substring(0, j));
        const targetIdx = wordIndexMap.get(target);
        if (targetIdx !== undefined && targetIdx !== i) {
          result.push([i, targetIdx]);
        }
      }
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 053. 回文对 =====");

// 测试 1
console.log(palindromePairs(["abcd", "dcba", "lls", "s", "sssll"]));
// 期望: [[1,0],[0,1],[3,2],[2,4]]

// 测试 2
console.log(palindromePairs(["bat", "tab", "cat"]));
// 期望: [[1,0],[0,1]]

// 测试 3
console.log(palindromePairs(["a", ""]));
// 期望: [[1,0],[0,1]]

export {};
