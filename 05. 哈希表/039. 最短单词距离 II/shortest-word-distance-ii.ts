// ============================================================
// 039. 最短单词距离 II
// ============================================================
// LeetCode 244. Shortest Word Distance II
// 设计支持多次查询两单词最短距离的结构。哈希表存单词所有索引。
// 时间复杂度：预处理 O(n)，每次查询 O(m + k)，m、k 为两单词出现次数
// 空间复杂度：O(n)

/**
 * 设计一个支持多次查询最短单词距离的结构
 * 预处理时用哈希表存储每个单词出现的所有索引（已按升序排列）
 * 查询时使用双指针法找到两有序索引列表的最小差值
 */
class WordDistance {
  private wordIndices: Map<string, number[]>;

  constructor(wordsDict: string[]) {
    this.wordIndices = new Map();
    // 遍历一次，记录每个单词的所有索引
    for (let i = 0; i < wordsDict.length; i++) {
      const word = wordsDict[i];
      if (!this.wordIndices.has(word)) {
        this.wordIndices.set(word, []);
      }
      this.wordIndices.get(word)!.push(i);
    }
  }

  /**
   * 查询两单词的最短距离
   * 使用双指针遍历两个有序索引列表
   */
  shortest(word1: string, word2: string): number {
    const indices1 = this.wordIndices.get(word1)!;
    const indices2 = this.wordIndices.get(word2)!;

    let i = 0;
    let j = 0;
    let minDist = Infinity;

    // 双指针法求两有序数组元素的最小差值
    while (i < indices1.length && j < indices2.length) {
      const diff = Math.abs(indices1[i] - indices2[j]);
      minDist = Math.min(minDist, diff);

      // 移动指向较小值的指针，尝试缩小差值
      if (indices1[i] < indices2[j]) {
        i++;
      } else {
        j++;
      }
    }

    return minDist;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 039. 最短单词距离 II =====");
// 测试 1: 基本查询
const wd1 = new WordDistance([
  "practice",
  "makes",
  "perfect",
  "coding",
  "makes",
]);
console.log(wd1.shortest("coding", "practice")); // 期望输出: 3
console.log(wd1.shortest("makes", "coding")); // 期望输出: 1

// 测试 2: 同一单词多次出现
const wd2 = new WordDistance(["a", "b", "c", "a", "d", "b"]);
console.log(wd2.shortest("a", "b")); // 期望输出: 1

// 测试 3: 两个单词各出现一次
const wd3 = new WordDistance(["hello", "world"]);
console.log(wd3.shortest("hello", "world")); // 期望输出: 1

// 测试 4: 相邻位置
const wd4 = new WordDistance(["x", "y", "x", "y", "x"]);
console.log(wd4.shortest("x", "y")); // 期望输出: 1

export {};
