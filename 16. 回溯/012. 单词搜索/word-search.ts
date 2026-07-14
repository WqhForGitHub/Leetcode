// ============================================================
// 012. 单词搜索
// ============================================================
// LeetCode 79. Word Search
// 给定 m×n 字符矩阵 board 和单词 word，判断单词是否存在于网格中。
// 单词由相邻单元格（上下左右）的字母组成，同一单元格不能重复使用。
// 时间复杂度：O(m * n * 4^L)，L 为单词长度

// 方法1：DFS 回溯
// 从每个匹配首字母的位置开始 DFS，标记已访问格子
// 时间复杂度 O(m * n * 4^L)，空间复杂度 O(L) 递归栈
function exist(board: string[][], word: string): boolean {
  const m: number = board.length;
  const n: number = board[0].length;
  const wordArr: string[] = word.split("");
  const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));

  const dfs = (r: number, c: number, idx: number): boolean => {
    // 已匹配所有字符
    if (idx === wordArr.length) {
      return true;
    }
    // 越界或已访问或字符不匹配
    if (r < 0 || r >= m || c < 0 || c >= n || visited[r][c] || board[r][c] !== wordArr[idx]) {
      return false;
    }
    // 标记访问
    visited[r][c] = true;
    // 四个方向探索
    const found: boolean =
      dfs(r + 1, c, idx + 1) ||
      dfs(r - 1, c, idx + 1) ||
      dfs(r, c + 1, idx + 1) ||
      dfs(r, c - 1, idx + 1);
    // 回溯
    visited[r][c] = false;
    return found;
  };

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (dfs(r, c, 0)) {
        return true;
      }
    }
  }
  return false;
}

// 方法2：DFS 回溯 + 剪枝优化
// 1) 统计字符频率，若 board 中某字符不足则提前返回 false
// 2) 若 word 末字符在 board 中出现次数少于首字符，则反转 word 以减少分支
// 3) 原地标记代替 visited 数组，减少空间开销
// 时间复杂度 O(m * n * 4^L)，实际更快，空间复杂度 O(L) 递归栈
function existOptimized(board: string[][], word: string): boolean {
  const m: number = board.length;
  const n: number = board[0].length;
  let wordArr: string[] = word.split("");

  // 统计 board 中各字符频率
  const boardCount: Map<string, number> = new Map();
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      const ch: string = board[r][c];
      boardCount.set(ch, (boardCount.get(ch) ?? 0) + 1);
    }
  }
  // 统计 word 中各字符频率，若超出 board 频率则不可能
  const wordCount: Map<string, number> = new Map();
  for (const ch of wordArr) {
    wordCount.set(ch, (wordCount.get(ch) ?? 0) + 1);
  }
  for (const [ch, cnt] of wordCount) {
    if ((boardCount.get(ch) ?? 0) < cnt) {
      return false;
    }
  }
  // 剪枝：若末字符频率低于首字符，反转 word 减少搜索分支
  const firstCh: string = wordArr[0];
  const lastCh: string = wordArr[wordArr.length - 1];
  if ((boardCount.get(firstCh) ?? 0) > (boardCount.get(lastCh) ?? 0)) {
    wordArr = wordArr.slice().reverse();
  }

  const dfs = (r: number, c: number, idx: number): boolean => {
    if (idx === wordArr.length) {
      return true;
    }
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== wordArr[idx]) {
      return false;
    }
    // 原地标记：暂存字符，改为特殊标记
    const temp: string = board[r][c];
    board[r][c] = "#";
    const found: boolean =
      dfs(r + 1, c, idx + 1) ||
      dfs(r - 1, c, idx + 1) ||
      dfs(r, c + 1, idx + 1) ||
      dfs(r, c - 1, idx + 1);
    // 恢复
    board[r][c] = temp;
    return found;
  };

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (dfs(r, c, 0)) {
        return true;
      }
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 012. 单词搜索 =====");
console.log(
  exist(
    [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"],
    ],
    "ABCCED",
  ),
); // 期望结果: true
console.log(
  exist(
    [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"],
    ],
    "SEE",
  ),
); // 期望结果: true
console.log(
  exist(
    [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"],
    ],
    "ABCB",
  ),
); // 期望结果: false
console.log(
  existOptimized(
    [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"],
    ],
    "ABCCED",
  ),
); // 期望结果: true
console.log(
  existOptimized(
    [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"],
    ],
    "ABCB",
  ),
); // 期望结果: false

export {};
