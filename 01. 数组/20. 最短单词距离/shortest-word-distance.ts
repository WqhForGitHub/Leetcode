// ============================================================
// 20. 最短单词距离
// ============================================================
// LeetCode 243. Shortest Word Distance
// 给定字符串数组 wordsDict 和两个不同单词 word1、word2，返回它们在数组中最短的距离。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：一次遍历记录索引（推荐）
// 遍历时分别记录两个单词最近出现的位置，每次更新后计算距离取最小值
function shortestDistance(
  wordsDict: string[],
  word1: string,
  word2: string,
): number {
  let index1 = -1; // word1 最近出现的索引
  let index2 = -1; // word2 最近出现的索引
  let minDist = Infinity;

  for (let i = 0; i < wordsDict.length; i++) {
    const word = wordsDict[i];
    if (word === word1) {
      index1 = i;
    } else if (word === word2) {
      index2 = i;
    }

    // 两个单词都已出现过，计算距离
    if (index1 !== -1 && index2 !== -1) {
      minDist = Math.min(minDist, Math.abs(index1 - index2));
    }
  }

  return minDist;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 20. 最短单词距离 =====");
console.log(
  "描述:",
  shortestDistance(
    ["practice", "makes", "perfect", "coding", "makes"],
    "coding",
    "practice",
  ),
); // 期望结果: 3
console.log(
  "描述:",
  shortestDistance(
    ["practice", "makes", "perfect", "coding", "makes"],
    "makes",
    "coding",
  ),
); // 期望结果: 1
console.log(
  "描述:",
  shortestDistance(["a", "b", "c", "a", "b", "c"], "a", "c"),
); // 期望结果: 1

export {};
