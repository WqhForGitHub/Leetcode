// ============================================================
// 138. 单词转换
// ============================================================
// 面试金典 CCI 17.22. 单词转换器
// 给定起始词、目标词和字典，每次只改变一个字母且新词须在字典中，
// 求最短转换路径。返回路径或空数组。
// 时间复杂度：O(N * L * 26), 空间复杂度：O(N*L)，N 为字典大小，L 为单词长度

// 方法1：BFS+回溯 (推荐)
// 广度优先搜索构建父节点映射，再从终点回溯重建路径。
// 时间复杂度 O(N*L*26), 空间复杂度 O(N*L)
function findLadders(beginWord: string, endWord: string, wordList: string[]): string[] {
  const dict: Set<string> = new Set(wordList);
  if (!dict.has(endWord)) {
    return [];
  }
  if (beginWord === endWord) {
    return [beginWord];
  }
  const L: number = beginWord.length;
  // 生成与 word 只差一个字母且在字典中的邻居
  const getNeighbors = (word: string): string[] => {
    const neighbors: string[] = [];
    const arr: string[] = word.split("");
    for (let i: number = 0; i < L; i++) {
      const orig: string = arr[i];
      for (let c: number = 97; c <= 122; c++) {
        const ch: string = String.fromCharCode(c);
        if (ch === orig) continue;
        arr[i] = ch;
        const next: string = arr.join("");
        if (dict.has(next)) {
          neighbors.push(next);
        }
      }
      arr[i] = orig;
    }
    return neighbors;
  };

  const visited: Set<string> = new Set([beginWord]);
  const parent: Map<string, string> = new Map();
  const queue: string[] = [beginWord];
  let found: boolean = false;

  while (queue.length > 0 && !found) {
    const size: number = queue.length;
    for (let k: number = 0; k < size; k++) {
      const word: string = queue.shift() as string;
      if (word === endWord) {
        found = true;
        break;
      }
      for (const next of getNeighbors(word)) {
        if (!visited.has(next)) {
          visited.add(next);
          parent.set(next, word);
          queue.push(next);
        }
      }
    }
  }

  // endWord 未被到达则无解
  if (!parent.has(endWord)) {
    return [];
  }
  // 回溯重建路径（beginWord 无父节点，循环自然终止）
  const path: string[] = [];
  let cur: string | undefined = endWord;
  while (cur !== undefined) {
    path.push(cur);
    cur = parent.get(cur);
  }
  path.reverse();
  return path;
}

// 方法2：双向BFS+回溯
// 从起点和终点同时搜索，扩展较小的一端，相遇时回溯重建路径。
// 时间复杂度 O(N*L*26), 空间复杂度 O(N*L)
function findLaddersBidir(beginWord: string, endWord: string, wordList: string[]): string[] {
  const dict: Set<string> = new Set(wordList);
  if (!dict.has(endWord)) {
    return [];
  }
  if (beginWord === endWord) {
    return [beginWord];
  }
  const L: number = beginWord.length;
  const getNeighbors = (word: string): string[] => {
    const neighbors: string[] = [];
    const arr: string[] = word.split("");
    for (let i: number = 0; i < L; i++) {
      const orig: string = arr[i];
      for (let c: number = 97; c <= 122; c++) {
        const ch: string = String.fromCharCode(c);
        if (ch === orig) continue;
        arr[i] = ch;
        const next: string = arr.join("");
        if (dict.has(next)) neighbors.push(next);
      }
      arr[i] = orig;
    }
    return neighbors;
  };

  // 两端各自的访问集合与父节点映射
  const visitedBegin: Set<string> = new Set([beginWord]);
  const visitedEnd: Set<string> = new Set([endWord]);
  const parentBegin: Map<string, string> = new Map();
  const parentEnd: Map<string, string> = new Map();
  let queueBegin: string[] = [beginWord];
  let queueEnd: string[] = [endWord];
  let meet: string | null = null;

  while (queueBegin.length > 0 && queueEnd.length > 0 && meet === null) {
    // 始终扩展较小的一端
    if (queueBegin.length <= queueEnd.length) {
      const nextQueue: string[] = [];
      for (const word of queueBegin) {
        for (const next of getNeighbors(word)) {
          if (visitedBegin.has(next)) continue;
          visitedBegin.add(next);
          parentBegin.set(next, word);
          if (visitedEnd.has(next)) {
            meet = next;
            break;
          }
          nextQueue.push(next);
        }
        if (meet !== null) break;
      }
      queueBegin = nextQueue;
    } else {
      const nextQueue: string[] = [];
      for (const word of queueEnd) {
        for (const next of getNeighbors(word)) {
          if (visitedEnd.has(next)) continue;
          visitedEnd.add(next);
          parentEnd.set(next, word);
          if (visitedBegin.has(next)) {
            meet = next;
            break;
          }
          nextQueue.push(next);
        }
        if (meet !== null) break;
      }
      queueEnd = nextQueue;
    }
  }

  if (meet === null) {
    return [];
  }
  // 回溯重建：beginWord -> meet -> endWord
  const left: string[] = [];
  let cur: string | undefined = meet;
  while (cur !== undefined && cur !== beginWord) {
    left.push(cur);
    cur = parentBegin.get(cur);
  }
  left.push(beginWord);
  left.reverse();

  const right: string[] = [];
  cur = parentEnd.get(meet);
  while (cur !== undefined) {
    right.push(cur);
    if (cur === endWord) break;
    cur = parentEnd.get(cur);
  }
  return [...left, ...right];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 138. 单词转换 =====");
console.log(findLadders("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]));
// 期望结果: ["hit","hot","dot","dog","cog"] (或其它最短路径)
console.log(findLaddersBidir("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]));
console.log(findLadders("hit", "cog", ["hot", "dot", "dog", "lot", "log"]));
// 期望结果: [] (cog 不在字典中)
console.log(findLaddersBidir("hit", "cog", ["hot", "dot", "dog", "lot", "log"]));
console.log(findLadders("a", "c", ["a", "b", "c"]));
// 期望结果: ["a","c"]

export {};
