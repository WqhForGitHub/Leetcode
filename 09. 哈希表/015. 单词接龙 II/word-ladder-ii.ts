// ============================================================
// 015. 单词接龙 II
// ============================================================
// LeetCode 126. Word Ladder II
// 给定 beginWord、endWord 和字典 wordList，找出所有从 beginWord 到 endWord 的最短转换序列。
// 每次转换只能改变一个字母，中间单词必须在字典中。
// 使用 BFS 建立路径图，再 DFS 回溯输出所有最短路径。
// 时间复杂度：O(N * L^2)，空间复杂度：O(N * L)，N 为单词数，L 为单词长度

function findLadders(beginWord: string, endWord: string, wordList: string[]): string[][] {
  const wordSet = new Set(wordList);
  const result: string[][] = [];
  if (!wordSet.has(endWord)) return result;

  // BFS：记录每个单词的父节点列表
  const parents = new Map<string, string[]>();
  const currentLevel = new Set<string>([beginWord]);
  let found = false;

  while (currentLevel.size > 0 && !found) {
    // 本层访问过的单词从字典中移除，避免重复访问
    for (const w of currentLevel) {
      wordSet.delete(w);
    }

    const nextLevel = new Set<string>();

    for (const word of currentLevel) {
      // 尝试逐位替换字符
      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const ch = String.fromCharCode(c);
          if (ch === word[i]) continue;
          const next = word.substring(0, i) + ch + word.substring(i + 1);

          if (!wordSet.has(next)) continue;

          if (!parents.has(next)) {
            parents.set(next, []);
          }
          parents.get(next)!.push(word);
          nextLevel.add(next);

          if (next === endWord) found = true;
        }
      }
    }

    // 清空当前层，进入下一层
    currentLevel.clear();
    for (const w of nextLevel) {
      currentLevel.add(w);
    }
  }

  if (!found) return result;

  // DFS 回溯：从 endWord 反向构建路径
  const path: string[] = [endWord];
  const backtrack = (word: string) => {
    if (word === beginWord) {
      result.push([beginWord, ...path.slice(1).reverse()]);
      return;
    }
    const ps = parents.get(word) || [];
    for (const p of ps) {
      path.push(p);
      backtrack(p);
      path.pop();
    }
  };
  backtrack(endWord);

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 015. 单词接龙 II =====");
console.log(findLadders("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]));
// [["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]

console.log(findLadders("hit", "cog", ["hot", "dot", "dog", "lot", "log"]));
// []

console.log(findLadders("a", "c", ["a", "b", "c"]));
// [["a","c"]]

export {};
