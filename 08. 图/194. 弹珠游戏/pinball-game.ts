// ============================================================
// 194. 弹珠游戏
// ============================================================
// 自定义题：m×n 网格弹珠机，球从顶部某列放入（向下初速度），
// 碰挡板 '/' 或 '\' 改变方向，'.' 为空格直行。
// 求最终落出网格的边界位置；若进入循环则返回 [-1, -1]。
// 思路：模拟 / BFS（状态 = 位置 + 方向）。
// 时间复杂度：O(m·n·4)

// 方向编码：0=上, 1=右, 2=下, 3=左
const DR = [-1, 0, 1, 0];
const DC = [0, 1, 0, -1];

interface PinballResult {
  row: number;
  col: number;
  loop: boolean;
}

// 方法1：状态模拟（推荐）
function pinballSimulate(grid: string[], startCol: number): PinballResult {
  const m = grid.length;
  const n = grid[0].length;
  // 初始：顶部第 startCol 列，方向向下(2)
  let r = 0;
  let c = startCol;
  let d = 2;
  const visited: Set<string> = new Set();

  while (true) {
    // 越界即落出
    if (r < 0 || r >= m || c < 0 || c >= n) {
      // 回退一步得到出口位置
      const er = r - DR[d];
      const ec = c - DC[d];
      return { row: er, col: ec, loop: false };
    }
    const key = `${r},${c},${d}`;
    if (visited.has(key)) return { row: -1, col: -1, loop: true };
    visited.add(key);

    const cell = grid[r][c];
    let nd = d;
    if (cell === "/") {
      // 上<->右, 下<->左
      // 0(上)->1(右), 1(右)->0(上), 2(下)->3(左), 3(左)->2(下)
      nd = d ^ 1;
    } else if (cell === "\\") {
      // 上<->左, 下<->右
      // 0(上)->3(左), 3(左)->0(上), 1(右)->2(下), 2(下)->1(右)
      nd = 3 - d;
    }
    d = nd;
    r += DR[d];
    c += DC[d];
  }
}

// 方法2：BFS 状态搜索（同样状态机，仅实现形式不同）
function pinballBFS(grid: string[], startCol: number): PinballResult {
  const m = grid.length;
  const n = grid[0].length;
  const visited: boolean[][][] = Array.from({ length: m }, () =>
    Array.from({ length: n }, () => new Array(4).fill(false)),
  );

  let r = 0;
  let c = startCol;
  let d = 2;

  while (true) {
    if (r < 0 || r >= m || c < 0 || c >= n) {
      return {
        row: r - DR[d],
        col: c - DC[d],
        loop: false,
      };
    }
    if (visited[r][c][d]) return { row: -1, col: -1, loop: true };
    visited[r][c][d] = true;

    const cell = grid[r][c];
    let nd = d;
    if (cell === "/") nd = d ^ 1;
    else if (cell === "\\") nd = 3 - d;
    d = nd;
    r += DR[d];
    c += DC[d];
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 194. 弹珠游戏 =====");

// 简单 1x1 空格，球从顶 0 列进入，直接从底落出
console.log(pinballSimulate(["."], 0)); // { row: 0, col: 0, loop: false }
console.log(pinballBFS(["."], 0)); // { row: 0, col: 0, loop: false }

// 2x2，全 '/'：球进入 (0,0) 向下 -> '/' -> 方向变左(3) -> 越界左
// 出口回退：(0,0) 左侧 => (0, -1)
console.log(pinballSimulate(["//", "//"], 0)); // { row: 0, col: -1, loop: false }
console.log(pinballBFS(["//", "//"], 0)); // { row: 0, col: -1, loop: false }

// 循环场景：2x2 全 '\'，球从顶 0 列向下进入
// (0,0) 下 -> '\' -> 右(1) -> (0,1) -> '\' -> 下(2) -> (1,1) -> '\' -> 左(3) -> (1,0) -> '\' -> 上(0) -> (0,0) 向下... 循环
console.log(pinballSimulate(["\\\\", "\\\\"], 0)); // { row: -1, col: -1, loop: true }
console.log(pinballBFS(["\\\\", "\\\\"], 0)); // { row: -1, col: -1, loop: true }

export {};
