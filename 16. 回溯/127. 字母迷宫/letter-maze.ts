// ============================================================
// 127. 字母迷宫
// ============================================================
// 面试金典 / LeetCode 79. 单词搜索
// 给定一个二维字符网格和一个单词，判断该单词是否存在于网格中。
// 单词可以按字母顺序相邻的单元格（上下左右）构成，同一单元格不能重复使用。
// 时间复杂度：O(M*N*4^L)，空间复杂度：O(L)，其中 L 为单词长度

// 方法1：DFS回溯 (推荐)
// 遍历每个单元格作为起点，若与首字符匹配则进行深度优先搜索。
// 搜索时将当前字符临时修改为标记字符以避免重复访问，回溯时恢复。
// 时间复杂度 O(M*N*4^L), 空间复杂度 O(L)
function existInMaze(board: string[][], word: string): boolean {
  const rows: number = board.length;
  const cols: number = board[0].length;

  // 从 (r, c) 出发，匹配 word[index] 及之后的字符
  const dfs = (r: number, c: number, index: number): boolean => {
    // 匹配完成
    if (index === word.length) {
      return true;
    }
    // 越界或字符不匹配
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== word[index]) {
      return false;
    }
    // 标记已访问
    const temp: string = board[r][c];
    board[r][c] = "#";
    // 四个方向搜索
    const found: boolean =
      dfs(r + 1, c, index + 1) ||
      dfs(r - 1, c, index + 1) ||
      dfs(r, c + 1, index + 1) ||
      dfs(r, c - 1, index + 1);
    // 回溯恢复
    board[r][c] = temp;
    return found;
  };

  for (let i: number = 0; i < rows; i++) {
    for (let j: number = 0; j < cols; j++) {
      if (dfs(i, j, 0)) {
        return true;
      }
    }
  }
  return false;
}

// 方法2：DFS+剪枝
// 在方法1基础上增加剪枝：先统计棋盘和单词的字符频率，
// 若棋盘缺乏某字符或单词中某字符频率超过棋盘，直接返回 false。
// 另外若单词首字符在棋盘中出现次数多于尾字符，则反向搜索以减少分支。
// 时间复杂度 O(M*N*4^L), 空间复杂度 O(L)
function existInMazePrune(board: string[][], word: string): boolean {
  const rows: number = board.length;
  const cols: number = board[0].length;

  // 统计棋盘字符频率
  const boardCount: Map<string, number> = new Map();
  for (let i: number = 0; i < rows; i++) {
    for (let j: number = 0; j < cols; j++) {
      const ch: string = board[i][j];
      boardCount.set(ch, (boardCount.get(ch) ?? 0) + 1);
    }
  }
  // 统计单词字符频率并剪枝
  const wordCount: Map<string, number> = new Map();
  for (const ch of word) {
    wordCount.set(ch, (wordCount.get(ch) ?? 0) + 1);
  }
  for (const [ch, cnt] of wordCount) {
    if ((boardCount.get(ch) ?? 0) < cnt) {
      return false;
    }
  }

  // 若首字符出现次数多于尾字符，反向搜索减少分支
  let searchWord: string = word;
  if ((boardCount.get(word[0]) ?? 0) > (boardCount.get(word[word.length - 1]) ?? 0)) {
    searchWord = word.split("").reverse().join("");
  }

  const dfs = (r: number, c: number, index: number): boolean => {
    if (index === searchWord.length) {
      return true;
    }
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== searchWord[index]) {
      return false;
    }
    const temp: string = board[r][c];
    board[r][c] = "#";
    const found: boolean =
      dfs(r + 1, c, index + 1) ||
      dfs(r - 1, c, index + 1) ||
      dfs(r, c + 1, index + 1) ||
      dfs(r, c - 1, index + 1);
    board[r][c] = temp;
    return found;
  };

  for (let i: number = 0; i < rows; i++) {
    for (let j: number = 0; j < cols; j++) {
      if (dfs(i, j, 0)) {
        return true;
      }
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 127. 字母迷宫 =====");
const board1: string[][] = [
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
];
console.log(existInMaze(board1, "ABCCED")); // 期望结果: true
console.log(existInMaze(board1, "SEE")); // 期望结果: true
console.log(existInMaze(board1, "ABCB")); // 期望结果: false
console.log(existInMazePrune(board1, "ABCCED")); // 期望结果: true
console.log(existInMazePrune(board1, "SEE")); // 期望结果: true
console.log(existInMazePrune(board1, "ABCB")); // 期望结果: false

export {};
