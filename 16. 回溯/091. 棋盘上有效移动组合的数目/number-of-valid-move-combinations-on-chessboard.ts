// ============================================================
// 091. 棋盘上有效移动组合的数目
// ============================================================
// LeetCode 2056. Number of Valid Move Combinations on Chessboard
// 给定棋子类型 (rook/bishop/queen) 和初始位置，所有棋子同时按直线移动，
// 可在任意步停下后保持不动。求合法的移动组合数：
// 任意时刻两棋子不能同处一格，且不能互换位置（穿越）。
// 时间复杂度：O(28^n * n * 8), 空间复杂度：O(n * 8)

// 方法1：回溯 (枚举每步移动)
// 为每个棋子预先生成所有可能的"路径"（长度为 8 的位置数组，对应 t=0..7），
// 然后回溯地为每个棋子选路径，校验与前序棋子的碰撞。
// 时间复杂度 O((28)^n * 8 * n), 空间复杂度 O(n * 8)
function countCombinations(pieces: string[], positions: number[][]): number {
  const n: number = pieces.length;

  // 不同棋子可走的方向
  const directionsFor = (piece: string): number[][] => {
    if (piece === "rook")
      return [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ];
    if (piece === "bishop")
      return [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ];
    // queen: rook + bishop
    return [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
  };

  // 为每个棋子生成所有候选路径：path[t] = 棋子在 t 时刻所在格 [r, c]
  const allMoves: number[][][][] = [];
  for (let i = 0; i < n; i++) {
    const r: number = positions[i][0];
    const c: number = positions[i][1];
    const moves: number[][][] = [];
    // 距离 0：原地不动
    const stayPath: number[][] = [];
    for (let t = 0; t < 8; t++) stayPath.push([r, c]);
    moves.push(stayPath);
    // 各方向各距离
    for (const [dr, dc] of directionsFor(pieces[i])) {
      for (let d = 1; d <= 7; d++) {
        const fr: number = r + dr * d;
        const fc: number = c + dc * d;
        if (fr < 1 || fr > 8 || fc < 1 || fc > 8) break;
        const path: number[][] = [];
        for (let t = 0; t < 8; t++) {
          if (t <= d) path.push([r + dr * t, c + dc * t]);
          else path.push([fr, fc]);
        }
        moves.push(path);
      }
    }
    allMoves.push(moves);
  }

  // 检查新路径 path 是否与已选路径集合 prev 冲突
  const check = (path: number[][], prev: number[][][]): boolean => {
    for (const other of prev) {
      for (let t = 0; t < 8; t++) {
        // 任意时刻同格
        if (path[t][0] === other[t][0] && path[t][1] === other[t][1]) return false;
        // 同一步内互换位置（穿越）
        if (t + 1 < 8) {
          if (
            path[t][0] === other[t + 1][0] &&
            path[t][1] === other[t + 1][1] &&
            path[t + 1][0] === other[t][0] &&
            path[t + 1][1] === other[t][1]
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  let count: number = 0;
  const backtrack = (idx: number, prev: number[][][]): void => {
    if (idx === n) {
      count++;
      return;
    }
    for (const move of allMoves[idx]) {
      if (check(move, prev)) {
        prev.push(move);
        backtrack(idx + 1, prev);
        prev.pop();
      }
    }
  };

  backtrack(0, []);
  return count;
}

// 方法2：回溯+碰撞检测 (优化版)
// 思路一致，将 check 内联，并按方向向量即时构造路径以节省内存。
// 时间复杂度 O(28^n * 8 * n), 空间复杂度 O(n)
function countCombinations2(pieces: string[], positions: number[][]): number {
  const n: number = pieces.length;
  const dirsFor = (p: string): number[][] => {
    if (p === "rook")
      return [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ];
    if (p === "bishop")
      return [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ];
    return [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
  };

  // 为每个棋子生成候选: [dr, dc, distance] (distance=0 表示不动)
  const candidates: number[][][] = [];
  for (let i = 0; i < n; i++) {
    const [r, c] = positions[i];
    const list: number[][] = [[0, 0, 0]]; // 不动
    for (const [dr, dc] of dirsFor(pieces[i])) {
      for (let d = 1; d <= 7; d++) {
        const fr = r + dr * d;
        const fc = c + dc * d;
        if (fr < 1 || fr > 8 || fc < 1 || fc > 8) break;
        list.push([dr, dc, d]);
      }
    }
    candidates.push(list);
  }

  // 计算第 i 个棋子在第 t 时刻的位置
  const posAt = (i: number, move: number[], t: number): number[] => {
    const [r, c] = positions[i];
    const [dr, dc, d] = move;
    if (d === 0) return [r, c];
    if (t <= d) return [r + dr * t, c + dc * t];
    return [r + dr * d, c + dc * d];
  };

  let count: number = 0;
  const chosen: number[][] = []; // chosen[i] = 第 i 个棋子的 move
  const valid = (i: number, move: number[]): boolean => {
    for (let t = 0; t < 8; t++) {
      const [pr, pc] = posAt(i, move, t);
      for (let j = 0; j < i; j++) {
        const [qr, qc] = posAt(j, chosen[j], t);
        if (pr === qr && pc === qc) return false;
        if (t + 1 < 8) {
          const [pr1, pc1] = posAt(i, move, t + 1);
          const [qr1, qc1] = posAt(j, chosen[j], t + 1);
          if (pr === qr1 && pc === qc1 && pr1 === qr && pc1 === qc) return false;
        }
      }
    }
    return true;
  };

  const backtrack = (i: number): void => {
    if (i === n) {
      count++;
      return;
    }
    for (const move of candidates[i]) {
      if (valid(i, move)) {
        chosen.push(move);
        backtrack(i + 1);
        chosen.pop();
      }
    }
  };

  backtrack(0);
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 091. 棋盘上有效移动组合的数目 =====");
console.log(countCombinations(["rook"], [[1, 1]])); // 期望结果: 15
console.log(countCombinations2(["rook"], [[1, 1]])); // 期望结果: 15
console.log(countCombinations(["queen"], [[1, 1]])); // 期望结果: 22
console.log(countCombinations2(["queen"], [[1, 1]])); // 期望结果: 22

export {};
