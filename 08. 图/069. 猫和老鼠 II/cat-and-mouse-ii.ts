// ============================================================
// 069. 猫和老鼠 II
// ============================================================
// LeetCode 1728. Cat and Mouse II
// grid 网格（'#' 墙, '.' 空, 'C' 猫, 'M' 鼠, 'F' 食物）。猫最多跳 catJump，
// 鼠最多跳 mouseJump，4 方向，可中途停下。猫吃鼠或猫先到食物猫赢，
// 鼠先到食物鼠赢，鼠无法取胜或 1000 步内未分胜负判平局（鼠输）。
// 返回鼠是否能赢。状态 = (鼠位, 猫位, 轮次)。
// 时间复杂度：O((m*n)^2 * (mouseJump+catJump))，空间复杂度：O((m*n)^2)

// 通用：生成某点一步可达的所有格子（含原地不动）
function buildMoves1728(grid: string[], rows: number, cols: number, maxJump: number): number[][] {
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const C = rows * cols;
  const moves: number[][] = new Array(C);
  for (let pos = 0; pos < C; pos++) {
    const r = Math.floor(pos / cols);
    const c = pos % cols;
    const list: number[] = [pos]; // 原地不动
    for (const [dr, dc] of dirs) {
      for (let step = 1; step <= maxJump; step++) {
        const nr = r + dr * step;
        const nc = c + dc * step;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) break;
        if (grid[nr][nc] === "#") break;
        list.push(nr * cols + nc);
      }
    }
    moves[pos] = list;
  }
  return moves;
}

function parseGrid(grid: string[], cols: number) {
  let mouseStart = -1;
  let catStart = -1;
  let food = -1;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < cols; j++) {
      const ch = grid[i][j];
      const idx = i * cols + j;
      if (ch === "M") mouseStart = idx;
      else if (ch === "C") catStart = idx;
      else if (ch === "F") food = idx;
    }
  }
  return { mouseStart, catStart, food };
}

// ============================================================
// 方法1：BFS 逆推染色（拓扑，可证明正确，推荐）
// ============================================================
function canMouseWin1(grid: string[], catJump: number, mouseJump: number): boolean {
  const rows = grid.length;
  const cols = grid[0].length;
  const C = rows * cols;
  const { mouseStart, catStart, food } = parseGrid(grid, cols);
  const mouseMoves = buildMoves1728(grid, rows, cols, mouseJump);
  const catMoves = buildMoves1728(grid, rows, cols, catJump);

  const idx = (m: number, c: number, turn: number): number => (m * C + c) * 2 + turn;
  const total = C * C * 2;
  const result = new Int8Array(total); // 0=平局, 1=鼠赢, 2=猫赢
  const degree = new Int32Array(total);

  for (let m = 0; m < C; m++) {
    for (let c = 0; c < C; c++) {
      degree[idx(m, c, 0)] = mouseMoves[m].length;
      degree[idx(m, c, 1)] = catMoves[c].length;
    }
  }

  const queue: number[] = [];
  // 终止状态：鼠到食物=鼠赢；猫到食物或猫抓到鼠=猫赢
  for (let m = 0; m < C; m++) {
    for (let c = 0; c < C; c++) {
      let res = 0;
      if (m === food) res = 1;
      else if (c === food) res = 2;
      else if (m === c) res = 2;
      if (res !== 0) {
        for (const turn of [0, 1]) {
          const s = idx(m, c, turn);
          result[s] = res;
          queue.push(s);
        }
      }
    }
  }

  // 前驱：cur 由对方上一步移动得到
  const getPreds = (m: number, c: number, turn: number): number[] => {
    const preds: number[] = [];
    if (turn === 0) {
      // 当前轮到鼠 => 上一步是猫走的，猫从 cPrev 到 c
      for (const cPrev of catMoves[c]) preds.push(idx(m, cPrev, 1));
    } else {
      // 当前轮到猫 => 上一步是鼠走的，鼠从 mPrev 到 m
      for (const mPrev of mouseMoves[m]) preds.push(idx(mPrev, c, 0));
    }
    return preds;
  };

  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    const curRes = result[cur];
    const turn = cur % 2;
    const rest = (cur - turn) / 2;
    const c = rest % C;
    const m = Math.floor(rest / C);
    for (const p of getPreds(m, c, turn)) {
      if (result[p] !== 0) continue;
      const pTurn = p % 2;
      // 若 p 的行动方等于 cur 的胜方，则 p 可直接走到该胜局
      if ((curRes === 1 && pTurn === 0) || (curRes === 2 && pTurn === 1)) {
        result[p] = curRes;
        queue.push(p);
      } else {
        degree[p]--;
        if (degree[p] === 0) {
          // 所有走法都导向对手胜 => 对手胜
          result[p] = curRes;
          queue.push(p);
        }
      }
    }
  }
  return result[idx(mouseStart, catStart, 0)] === 1;
}

// ============================================================
// 方法2：minimax + 记忆化（以步数 step 为记忆键，超阈值判平局=鼠输）
// 说明：记忆键包含步数 step，因此同一 (鼠位,猫位,轮次) 在不同剩余深度
// 下不会互相污染，缓存是可靠的；步数超过阈值仍未分胜负视为平局。
// ============================================================
function canMouseWin2(grid: string[], catJump: number, mouseJump: number): boolean {
  const rows = grid.length;
  const cols = grid[0].length;
  const C = rows * cols;
  const { mouseStart, catStart, food } = parseGrid(grid, cols);
  const mouseMoves = buildMoves1728(grid, rows, cols, mouseJump);
  const catMoves = buildMoves1728(grid, rows, cols, catJump);

  // 阈值：状态 (鼠位,猫位,轮次) 共 2*C*C 个，鸽笼原理下超过该数必出现
  // 重复状态即平局；实践中用 2*C 亦足够（LeetCode 常用界）。
  const limit = 2 * C;
  // 记忆键：把 step 也编入，避免不同剩余深度相互污染
  const memo = new Map<number, boolean>();
  const keyOf = (m: number, c: number, step: number): number => (m * C + c) * (limit + 1) + step;

  const solve = (m: number, c: number, step: number): boolean => {
    if (m === food) return true; // 鼠到食物
    if (c === food) return false; // 猫到食物
    if (m === c) return false; // 猫抓到鼠
    if (step >= limit) return false; // 超阈值未分胜负 => 平局 => 鼠输
    const key = keyOf(m, c, step);
    if (memo.has(key)) return memo.get(key)!;
    let res: boolean;
    if (step % 2 === 0) {
      // 鼠的回合：存在一种走法使鼠赢则鼠赢
      res = false;
      for (const mn of mouseMoves[m]) {
        if (solve(mn, c, step + 1)) {
          res = true;
          break;
        }
      }
    } else {
      // 猫的回合：存在一种走法使鼠不赢则鼠输
      res = true;
      for (const cn of catMoves[c]) {
        if (!solve(m, cn, step + 1)) {
          res = false;
          break;
        }
      }
    }
    memo.set(key, res);
    return res;
  };

  return solve(mouseStart, catStart, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 069. 猫和老鼠 II =====");
console.log(canMouseWin1([".....", "M...F", ".....", ".....", "C...."], 1, 1));
// 期望: true （鼠离食物近且先手，猫追不上也来不及到食物）
console.log(canMouseWin1(["M..FC", ".....", "....."], 1, 1));
// 期望: false （猫与食物相邻，鼠先手后猫一步到食物，猫赢）
console.log(canMouseWin2([".....", "M...F", ".....", ".....", "C...."], 1, 1));
// 期望: true
console.log(canMouseWin2(["M..FC", ".....", "....."], 1, 1));
// 期望: false

export {};
