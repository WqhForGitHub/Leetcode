// ============================================================
// 056. 设计井字棋
// ============================================================
// LeetCode 348. Design Tic-Tac-Toe
// 设计一个 n x n 的井字棋游戏，在 O(1) 时间内判断玩家是否获胜。
// 时间复杂度：每次 move 为 O(1)，空间复杂度：O(n)

// 哈希表记录每行/列/对角线的计数
// 玩家 1 落子 +1，玩家 2 落子 -1
// 当某行/列/对角线计数绝对值达到 n 时，该玩家获胜
class TicTacToe {
  private n: number;
  // rows[i] 表示第 i 行的计数
  private rows: number[];
  // cols[j] 表示第 j 列的计数
  private cols: number[];
  // 主对角线计数
  private diagonal: number;
  // 副对角线计数
  private antiDiagonal: number;

  constructor(n: number) {
    this.n = n;
    this.rows = new Array(n).fill(0);
    this.cols = new Array(n).fill(0);
    this.diagonal = 0;
    this.antiDiagonal = 0;
  }

  // 玩家 player 在 (row, col) 落子
  // 返回获胜玩家编号，若无人获胜返回 0
  move(row: number, col: number, player: number): number {
    // 玩家 1 加 1，玩家 2 减 1
    const toAdd = player === 1 ? 1 : -1;

    // 更新行计数
    this.rows[row] += toAdd;
    if (Math.abs(this.rows[row]) === this.n) return player;

    // 更新列计数
    this.cols[col] += toAdd;
    if (Math.abs(this.cols[col]) === this.n) return player;

    // 更新主对角线（行号等于列号）
    if (row === col) {
      this.diagonal += toAdd;
      if (Math.abs(this.diagonal) === this.n) return player;
    }

    // 更新副对角线（行号 + 列号 = n - 1）
    if (row + col === this.n - 1) {
      this.antiDiagonal += toAdd;
      if (Math.abs(this.antiDiagonal) === this.n) return player;
    }

    return 0;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 056. 设计井字棋 =====");

// 测试 1: 玩家 1 水平获胜
const game1 = new TicTacToe(3);
console.log(game1.move(0, 0, 1)); // 期望: 0
console.log(game1.move(0, 1, 2)); // 期望: 0
console.log(game1.move(1, 0, 1)); // 期望: 0
console.log(game1.move(1, 1, 2)); // 期望: 0
console.log(game1.move(2, 0, 1)); // 期望: 1 (第 0 列三个 1)

// 测试 2: 玩家 2 对角线获胜
const game2 = new TicTacToe(3);
console.log(game2.move(0, 0, 1)); // 期望: 0
console.log(game2.move(0, 2, 2)); // 期望: 0
console.log(game2.move(1, 0, 1)); // 期望: 0
console.log(game2.move(1, 1, 2)); // 期望: 0
console.log(game2.move(2, 2, 1)); // 期望: 0
console.log(game2.move(2, 0, 2)); // 期望: 2 (副对角线)

// 测试 3: 玩家 1 主对角线获胜
const game3 = new TicTacToe(2);
console.log(game3.move(0, 0, 1)); // 期望: 0
console.log(game3.move(0, 1, 2)); // 期望: 0
console.log(game3.move(1, 1, 1)); // 期望: 1 (主对角线)

export {};
