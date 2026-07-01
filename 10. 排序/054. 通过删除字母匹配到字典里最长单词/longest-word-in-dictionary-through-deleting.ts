// ============================================================
// 054. 通过删除字母匹配到字典里最长单词
// ============================================================
// LeetCode 524. Longest Word in Dictionary through Deleting
// 给定字符串 s 和字典 dictionary，求通过删除 s 中若干字符能得到的最长字典单词；
// 若长度相同则返回字典序最小者。

// 方法1：排序字典 + 双指针子序列检查（推荐，O(n log n * L + |s|) 时间）
// 先对字典排序：按长度降序、长度相同按字典序升序。
// 依次检查每个单词是否为 s 的子序列，返回第一个匹配的即为答案。
function findLongestWord(s: string, dictionary: string[]): string {
  // 长度降序，长度相同字典序升序
  const sorted = [...dictionary].sort((a, b) => {
    if (a.length !== b.length) return b.length - a.length;
    return a < b ? -1 : a > b ? 1 : 0;
  });

  for (const word of sorted) {
    if (isSubsequence(word, s)) return word;
  }
  return "";
}

// 判断 short 是否为 long 的子序列（双指针）
function isSubsequence(short: string, long: string): boolean {
  if (short.length > long.length) return false;
  let i = 0;
  for (let j = 0; j < long.length && i < short.length; j++) {
    if (short[i] === long[j]) i++;
  }
  return i === short.length;
}

// 方法2：不排序，逐个检查并维护最优（O(n * (|s| + L)) 时间）
// 遍历字典中每个单词，检查是否为 s 的子序列，维护最长且字典序最小的结果。
function findLongestWordNoSort(s: string, dictionary: string[]): string {
  let best = "";
  for (const word of dictionary) {
    if (isSubsequence(word, s)) {
      if (
        word.length > best.length ||
        (word.length === best.length && word < best)
      ) {
        best = word;
      }
    }
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 054. 通过删除字母匹配到字典里最长单词 =====");
console.log("排序 s=abpcplea, dict=[ale,apple,monkey,plea]:",
  findLongestWord("abpcplea", ["ale", "apple", "monkey", "plea"])); // 期望 apple
console.log("排序 s=abpcplea, dict=[a,b,c]:",
  findLongestWord("abpcplea", ["a", "b", "c"])); // 期望 a
console.log("不排序 s=abpcplea, dict=[ale,apple,monkey,plea]:",
  findLongestWordNoSort("abpcplea", ["ale", "apple", "monkey", "plea"])); // 期望 apple
console.log("不排序 s=abpcplea, dict=[a,b,c]:",
  findLongestWordNoSort("abpcplea", ["a", "b", "c"])); // 期望 a

export {};
