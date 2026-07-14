// ============================================================
// 018. 单词接龙 II
// ============================================================
// LeetCode 126. Word Ladder II
// 找出所有从 beginWord 到 endWord 的最短转换序列，每次只能改变一个字母，
// 且每个中间单词必须在 wordList 中。
// 时间复杂度：O(N * M^2)，N 为单词数，M 为单词长度，空间复杂度：O(N * M)

// 方法1：BFS + 回溯 (推荐)
// 先用 BFS 从 beginWord 出发构建图（邻接表），同时记录到每个单词的最短距离
// 然后从 endWord 回溯到 beginWord，收集所有最短路径
// 时间复杂度 O(N * M^2), 空间复杂度 O(N * M)
function findLadders(beginWord: string, endWord: string, wordList: string[]): string[][] {
  const result: string[][] = [];
  const wordSet: Set<string> = new Set(wordList);
  if (!wordSet.has(endWord)) return result;

  // BFS 构建邻接表（从 beginWord 出发）
  const neighbors: Map<string, string[]> = new Map();
  const distance: Map<string, number> = new Map();
  const queue: string[] = [beginWord];
  distance.set(beginWord, 0);
  let found: boolean = false;

  while (queue.length > 0 && !found) {
    const levelSize: number = queue.length;
    const visitedThisLevel: Set<string> = new Set();

    for (let i = 0; i < levelSize; i++) {
      const word: string = queue.shift()!;
      const dist: number = distance.get(word)!;
      const nextWords: string[] = getNextWords(word, wordSet);

      for (const next of nextWords) {
        // 记录邻接关系
        if (!neighbors.has(word)) {
          neighbors.set(word, []);
        }
        neighbors.get(word)!.push(next);

        // 如果该单词未被访问过，加入队列
        if (!distance.has(next)) {
          distance.set(next, dist + 1);
          if (next === endWord) {
            found = true;
          } else {
            queue.push(next);
            visitedThisLevel.add(next);
          }
        }
      }
    }
  }

  // 如果没有找到 endWord，返回空
  if (!distance.has(endWord)) return result;

  // 回溯收集所有路径（从 beginWord 到 endWord）
  const path: string[] = [beginWord];
  backtrack(beginWord, endWord, path, neighbors, distance, result);

  return result;
}

// 获取与 word 相差一个字母的所有单词
function getNextWords(word: string, wordSet: Set<string>): string[] {
  const result: string[] = [];
  const chars: string[] = word.split("");
  for (let i = 0; i < chars.length; i++) {
    const oldChar: string = chars[i];
    for (let c = 97; c <= 122; c++) {
      // a-z
      const newChar: string = String.fromCharCode(c);
      if (newChar === oldChar) continue;
      chars[i] = newChar;
      const newWord: string = chars.join("");
      if (wordSet.has(newWord)) {
        result.push(newWord);
      }
    }
    chars[i] = oldChar; // 恢复
  }
  return result;
}

// 回溯收集路径
function backtrack(
  current: string,
  endWord: string,
  path: string[],
  neighbors: Map<string, string[]>,
  distance: Map<string, number>,
  result: string[][],
): void {
  if (current === endWord) {
    result.push([...path]);
    return;
  }

  const nexts: string[] | undefined = neighbors.get(current);
  if (!nexts) return;

  const currentDist: number = distance.get(current)!;
  for (const next of nexts) {
    // 只走最短路径（距离比当前大 1）
    if (distance.get(next) === currentDist + 1) {
      path.push(next);
      backtrack(next, endWord, path, neighbors, distance, result);
      path.pop();
    }
  }
}

// 方法2：双向 BFS + 回溯
// 从 beginWord 和 endWord 同时进行 BFS，在中间相遇时构建路径
// 时间复杂度 O(N * M^2), 空间复杂度 O(N * M)
function findLadders2(beginWord: string, endWord: string, wordList: string[]): string[][] {
  const result: string[][] = [];
  const wordSet: Set<string> = new Set(wordList);
  if (!wordSet.has(endWord)) return result;
  wordSet.add(beginWord);

  // 前向和后向距离
  const forwardDist: Map<string, number> = new Map();
  const backwardDist: Map<string, number> = new Map();
  forwardDist.set(beginWord, 0);
  backwardDist.set(endWord, 0);

  // 前向和后向邻接表
  const forwardAdj: Map<string, string[]> = new Map();
  const backwardAdj: Map<string, string[]> = new Map();

  // 双向 BFS
  let forwardQueue: string[] = [beginWord];
  let backwardQueue: string[] = [endWord];
  let found: boolean = false;
  let meetDist: number = Infinity;

  while (forwardQueue.length > 0 && backwardQueue.length > 0 && !found) {
    // 从较小的队列扩展
    if (forwardQueue.length <= backwardQueue.length) {
      const newQueue: string[] = [];
      for (const word of forwardQueue) {
        const dist: number = forwardDist.get(word)!;
        if (dist >= meetDist) continue;
        const nextWords: string[] = getNextWords(word, wordSet);
        for (const next of nextWords) {
          if (!forwardDist.has(next)) {
            forwardDist.set(next, dist + 1);
            forwardAdj.set(word, forwardAdj.get(word) || []);
            forwardAdj.get(word)!.push(next);
            newQueue.push(next);
          } else if (forwardDist.get(next) === dist + 1) {
            forwardAdj.set(word, forwardAdj.get(word) || []);
            forwardAdj.get(word)!.push(next);
          }
          // 检查是否与后向相遇
          if (backwardDist.has(next)) {
            found = true;
            meetDist = Math.min(meetDist, dist + 1 + backwardDist.get(next)!);
          }
        }
      }
      forwardQueue = newQueue;
    } else {
      const newQueue: string[] = [];
      for (const word of backwardQueue) {
        const dist: number = backwardDist.get(word)!;
        if (dist >= meetDist) continue;
        const nextWords: string[] = getNextWords(word, wordSet);
        for (const next of nextWords) {
          if (!backwardDist.has(next)) {
            backwardDist.set(next, dist + 1);
            backwardAdj.set(next, backwardAdj.get(next) || []);
            backwardAdj.get(next)!.push(word);
            newQueue.push(next);
          } else if (backwardDist.get(next) === dist + 1) {
            backwardAdj.set(next, backwardAdj.get(next) || []);
            backwardAdj.get(next)!.push(word);
          }
          if (forwardDist.has(next)) {
            found = true;
            meetDist = Math.min(meetDist, forwardDist.get(next)! + dist + 1);
          }
        }
      }
      backwardQueue = newQueue;
    }
  }

  if (!found) return result;

  // 回溯收集路径
  const path: string[] = [beginWord];
  collectPaths(beginWord, endWord, path, forwardAdj, backwardAdj, result);
  return result;
}

// 收集所有路径
function collectPaths(
  current: string,
  endWord: string,
  path: string[],
  forwardAdj: Map<string, string[]>,
  backwardAdj: Map<string, string[]>,
  result: string[][],
): void {
  if (current === endWord) {
    result.push([...path]);
    return;
  }

  const nexts: string[] | undefined = forwardAdj.get(current);
  if (!nexts) return;

  for (const next of nexts) {
    path.push(next);
    collectPaths(next, endWord, path, forwardAdj, backwardAdj, result);
    path.pop();
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 018. 单词接龙 II =====");
console.log(findLadders("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]));
// 期望结果: [["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]
console.log(findLadders2("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]));
// 期望结果: [["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]
console.log(findLadders("hit", "cog", ["hot", "dot", "dog", "lot", "log"]));
// 期望结果: []

export {};
