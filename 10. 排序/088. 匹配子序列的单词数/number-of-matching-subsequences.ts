// ============================================================
// 088. 匹配子序列的单词数
// ============================================================
// LeetCode 792. Number of Matching Subsequences
// 给定字符串 s 和单词数组 words，统计 words 中是 s 的子序列的单词个数。

// 方法1：桶分组 + 遍历 s（推荐，O(n + sum(word长度))）
// 思路：将每个单词按其当前待匹配的下一个字符分桶。遍历 s 时，
//       取出对应字符的桶，将每个单词的匹配位置前移，放入下一个字符对应的桶。
//       当匹配位置到达单词末尾时，计入结果。
function numMatchingSubseq(s: string, words: string[]): number {
  // 桶：Map<字符, [单词, 当前匹配位置]数组>
  const buckets: Map<string, [string, number][]> = new Map();

  // 初始化：每个单词按首字符分桶
  for (const word of words) {
    const firstChar = word[0];
    if (!buckets.has(firstChar)) {
      buckets.set(firstChar, []);
    }
    buckets.get(firstChar)!.push([word, 0]);
  }

  let count = 0;

  // 遍历 s 的每个字符
  for (const c of s) {
    if (!buckets.has(c)) continue;

    // 取出当前字符对应的桶
    const oldBucket = buckets.get(c)!;
    buckets.set(c, []); // 清空当前桶

    for (const [word, idx] of oldBucket) {
      const nextIdx = idx + 1;
      if (nextIdx === word.length) {
        // 单词全部匹配完成
        count++;
      } else {
        // 放入下一个待匹配字符对应的桶
        const nextChar = word[nextIdx];
        if (!buckets.has(nextChar)) {
          buckets.set(nextChar, []);
        }
        buckets.get(nextChar)!.push([word, nextIdx]);
      }
    }
  }

  return count;
}

// 方法2：预处理字符位置 + 二分搜索（O(sum(word长度 * log n))）
// 思路：预处理 s 中每个字符出现的所有位置索引。对每个单词，
//       用二分搜索在字符位置列表中找到大于当前位置的下一个匹配位置。
function numMatchingSubseq2(s: string, words: string[]): number {
  // 预处理：每个字符在 s 中出现的所有位置索引（有序）
  const charIndices: Map<string, number[]> = new Map();
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (!charIndices.has(c)) {
      charIndices.set(c, []);
    }
    charIndices.get(c)!.push(i);
  }

  // 二分查找：在有序数组中找第一个 > target 的元素
  const upperBound = (arr: number[], target: number): number => {
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] > target) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return lo < arr.length ? arr[lo] : -1;
  };

  // 判断 word 是否为 s 的子序列
  const isSubsequence = (word: string): boolean => {
    let pos = -1; // 当前在 s 中的匹配位置
    for (const c of word) {
      if (!charIndices.has(c)) return false;
      const indices = charIndices.get(c)!;
      const nextPos = upperBound(indices, pos);
      if (nextPos === -1) return false;
      pos = nextPos;
    }
    return true;
  };

  let count = 0;
  for (const word of words) {
    if (isSubsequence(word)) count++;
  }

  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 088. 匹配子序列的单词数 =====");

console.log("测试1:", numMatchingSubseq("abcde", ["a", "bb", "acd", "ace"])); // 期望: 3
console.log(
  "测试2:",
  numMatchingSubseq("dsahjpjauf", ["ahjpjau", "ja", "ahbwzgqnuk", "tnmlanowax"]),
); // 期望: 2
console.log("测试3:", numMatchingSubseq("bbb", ["b", "bb", "bbb", "bbbb"])); // 期望: 3

console.log("方法2测试1:", numMatchingSubseq2("abcde", ["a", "bb", "acd", "ace"])); // 期望: 3
console.log(
  "方法2测试2:",
  numMatchingSubseq2("dsahjpjauf", ["ahjpjau", "ja", "ahbwzgqnuk", "tnmlanowax"]),
); // 期望: 2
console.log("方法2测试3:", numMatchingSubseq2("bbb", ["b", "bb", "bbb", "bbbb"])); // 期望: 3

export {};
