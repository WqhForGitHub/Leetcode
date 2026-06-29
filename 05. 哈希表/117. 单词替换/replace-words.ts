// ============================================================
// 117. 单词替换
// ============================================================
// LeetCode 648. Replace Words
// 给定词根字典 dictionary 和以空格分隔的句子，将句子中的词替换为其最短词根。
// 时间复杂度：O(N*L)，N 为单词数，L 为平均长度；空间复杂度：O(D)，D 为词根数

// 思路：哈希集合 + 前缀匹配
function replaceWords(dictionary: string[], sentence: string): string {
  // 将词根存入集合便于快速查找
  const rootSet = new Set(dictionary);

  const replaceWord = (word: string): string => {
    // 从短到长尝试所有前缀
    for (let i = 1; i <= word.length; i++) {
      const prefix = word.slice(0, i);
      if (rootSet.has(prefix)) {
        return prefix;
      }
    }
    return word;
  };

  return sentence.split(" ").map(replaceWord).join(" ");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 117. 单词替换 =====");
// 测试 1
console.log(replaceWords(["cat", "bat", "rat"], "the cattle was rattled by the battery")); // 期望: "the cat was rat by the bat"
// 测试 2
console.log(replaceWords(["a", "b", "c"], "aadsfasf absbs bbab cadsfafs")); // 期望: "a a b c"
// 测试 3: 无匹配词根
console.log(replaceWords(["xyz"], "hello world")); // 期望: "hello world"

export {};
