// ============================================================
// 016. 单词接龙
// ============================================================
// LeetCode 127. Word Ladder
// 给定 beginWord、endWord 和字典 wordList，返回从 beginWord 转换到 endWord 的最短转换序列长度。
// 每次转换只能改变一个字母，中间单词必须在字典中。若不存在返回 0。
// 使用 BFS + 哈希集合。
// 时间复杂度：O(N * L^2)，空间复杂度：O(N)，N 为单词数，L 为单词长度

function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;

  // BFS：队列存 [当前单词, 当前步数]
  const queue: Array<[string, number]> = [[beginWord, 1]];
  const visited = new Set<string>([beginWord]);

  while (queue.length > 0) {
    const [word, steps] = queue.shift()!;

    if (word === endWord) return steps;

    // 逐位替换字符
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const ch = String.fromCharCode(c);
        if (ch === word[i]) continue;
        const next = word.substring(0, i) + ch + word.substring(i + 1);

        if (wordSet.has(next) && !visited.has(next)) {
          visited.add(next);
          queue.push([next, steps + 1]);
        }
      }
    }
  }

  return 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 016. 单词接龙 =====");
console.log(ladderLength("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"])); // 5
console.log(ladderLength("hit", "cog", ["hot", "dot", "dog", "lot", "log"])); // 0
console.log(ladderLength("a", "c", ["a", "b", "c"])); // 2
console.log(ladderLength("hot", "dog", ["hot", "dog"])); // 0

export {};
