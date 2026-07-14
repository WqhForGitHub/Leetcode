// ============================================================
// 116. 积木拼接
// ============================================================
// 给定若干积木（每个用 2D 0/1 数组表示形状），判断能否用所有积木
// 恰好铺满一个 rows×cols 的矩形（积木可旋转）。
// 返回所有合法铺法的数量（每个积木视为不同个体，按索引区分）。

// 时间复杂度：指数级 O(分支^n)
// 空间复杂度：O(rows*cols + n)

// 类型别名
type Shape = number[][];

// 顺时针旋转 90 度
function rotateShape(shape: Shape): Shape {
  const h: number = shape.length;
  const w: number = shape[0].length;
  const result: Shape = [];
  for (let j: number = 0; j < w; j++) {
    const row: number[] = [];
    for (let i: number = h - 1; i >= 0; i--) {
      row.push(shape[i][j]);
    }
    result.push(row);
  }
  return result;
}

// 裁剪空行空列，返回规范化的二维数组与字符串键
function normalizeShape(shape: Shape): Shape {
  let minR: number = shape.length,
    maxR: number = -1;
  let minC: number = shape[0].length,
    maxC: number = -1;
  for (let i: number = 0; i < shape.length; i++) {
    for (let j: number = 0; j < shape[0].length; j++) {
      if (shape[i][j] === 1) {
        if (i < minR) minR = i;
        if (i > maxR) maxR = i;
        if (j < minC) minC = j;
        if (j > maxC) maxC = j;
      }
    }
  }
  if (maxR < 0) return [];
  const trimmed: Shape = [];
  for (let i: number = minR; i <= maxR; i++) {
    const row: number[] = [];
    for (let j: number = minC; j <= maxC; j++) row.push(shape[i][j]);
    trimmed.push(row);
  }
  return trimmed;
}

// 生成每个积木的所有不同旋转（去重）
function allRotations(block: Shape): Shape[] {
  const seen: Set<string> = new Set();
  const rots: Shape[] = [];
  let cur: Shape = normalizeShape(block);
  for (let r: number = 0; r < 4; r++) {
    const key: string = JSON.stringify(cur);
    if (!seen.has(key)) {
      seen.add(key);
      rots.push(cur);
    }
    cur = normalizeShape(rotateShape(cur));
  }
  return rots;
}

// 方法1：回溯（逐格填充）
// 每次找第一个空格，尝试用某个未使用积木的某种旋转覆盖该格。
// 时间复杂度 O(指数级), 空间复杂度 O(rows*cols + n)
function tileRectangle(rows: number, cols: number, blocks: Shape[]): number {
  const n: number = blocks.length;
  const blockRots: Shape[][] = blocks.map((b) => allRotations(b));

  // 计算总格子数，必须等于 rows*cols
  let totalCells: number = 0;
  for (const b of blocks) {
    for (const row of b) for (const v of row) if (v === 1) totalCells++;
  }
  if (totalCells !== rows * cols) return 0;

  const grid: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
  const used: boolean[] = new Array(n).fill(false);
  let count: number = 0;

  function canPlace(shape: Shape, r: number, c: number): boolean {
    for (let i: number = 0; i < shape.length; i++) {
      for (let j: number = 0; j < shape[0].length; j++) {
        if (shape[i][j] === 1) {
          const nr: number = r + i,
            nc: number = c + j;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return false;
          if (grid[nr][nc] !== 0) return false;
        }
      }
    }
    return true;
  }

  function place(shape: Shape, r: number, c: number, mark: number): void {
    for (let i: number = 0; i < shape.length; i++) {
      for (let j: number = 0; j < shape[0].length; j++) {
        if (shape[i][j] === 1) grid[r + i][c + j] = mark;
      }
    }
  }

  function findFirstEmpty(): [number, number] | null {
    for (let i: number = 0; i < rows; i++) {
      for (let j: number = 0; j < cols; j++) {
        if (grid[i][j] === 0) return [i, j];
      }
    }
    return null;
  }

  function backtrack(placedCount: number): void {
    if (placedCount === n) {
      count++;
      return;
    }
    const empty: [number, number] | null = findFirstEmpty();
    if (empty === null) return; // 没空格但还有积木 -> 无效
    const [er, ec]: [number, number] = empty;
    for (let bi: number = 0; bi < n; bi++) {
      if (used[bi]) continue;
      for (const rot of blockRots[bi]) {
        // 让 rot 的某个填充格对齐 (er, ec)
        for (let di: number = 0; di < rot.length; di++) {
          for (let dj: number = 0; dj < rot[0].length; dj++) {
            if (rot[di][dj] !== 1) continue;
            const r: number = er - di,
              c: number = ec - dj;
            if (r < 0 || c < 0) continue;
            if (canPlace(rot, r, c)) {
              place(rot, r, c, bi + 1);
              used[bi] = true;
              backtrack(placedCount + 1);
              used[bi] = false;
              place(rot, r, c, 0);
            }
          }
        }
      }
    }
  }

  backtrack(0);
  return count;
}

// 方法2：回溯（逐块放置）
// 按积木索引顺序逐个放置，每个积木尝试所有位置与旋转。
// 时间复杂度 O(指数级), 空间复杂度 O(rows*cols + n)
function tileRectangle2(rows: number, cols: number, blocks: Shape[]): number {
  const n: number = blocks.length;
  const blockRots: Shape[][] = blocks.map((b) => allRotations(b));

  let totalCells: number = 0;
  for (const b of blocks) {
    for (const row of b) for (const v of row) if (v === 1) totalCells++;
  }
  if (totalCells !== rows * cols) return 0;

  const grid: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));

  function canPlace(shape: Shape, r: number, c: number): boolean {
    for (let i: number = 0; i < shape.length; i++) {
      for (let j: number = 0; j < shape[0].length; j++) {
        if (shape[i][j] === 1) {
          const nr: number = r + i,
            nc: number = c + j;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return false;
          if (grid[nr][nc] !== 0) return false;
        }
      }
    }
    return true;
  }

  function place(shape: Shape, r: number, c: number, mark: number): void {
    for (let i: number = 0; i < shape.length; i++) {
      for (let j: number = 0; j < shape[0].length; j++) {
        if (shape[i][j] === 1) grid[r + i][c + j] = mark;
      }
    }
  }

  function backtrack(bi: number): void {
    if (bi === n) {
      // 所有积木放完，由于总格数等于矩形格数，必然铺满
      return; // 由外层计数
    }
    // 尝试所有位置与旋转
    // （为计数，外层封装）
  }

  // 由于逐块放置需要遍历所有位置，这里用递归计数
  let count: number = 0;
  function solve(bi: number): void {
    if (bi === n) {
      count++;
      return;
    }
    for (const rot of blockRots[bi]) {
      const sh: number = rot.length,
        sw: number = rot[0].length;
      for (let r: number = 0; r <= rows - sh; r++) {
        for (let c: number = 0; c <= cols - sw; c++) {
          if (canPlace(rot, r, c)) {
            place(rot, r, c, bi + 1);
            solve(bi + 1);
            place(rot, r, c, 0);
          }
        }
      }
    }
  }

  solve(0);
  // 上面的 backtrack 未使用，保留以展示思路
  void backtrack;
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 116. 积木拼接 =====");
// 2x3 矩形，两个 L 形积木（每个 3 格，共 6 格恰好铺满）
// 两个积木视为不同个体：合法铺法数 = 4
console.log(
  tileRectangle(2, 3, [
    [
      [1, 1],
      [1, 0],
    ],
    [
      [1, 1],
      [0, 1],
    ],
  ]),
); // 期望: 4
console.log(
  tileRectangle2(2, 3, [
    [
      [1, 1],
      [1, 0],
    ],
    [
      [1, 1],
      [0, 1],
    ],
  ]),
); // 期望: 4
console.log(
  tileRectangle(2, 2, [
    [
      [1, 1],
      [1, 1],
    ],
  ]),
); // 期望: 1 (单块 2x2 铺满)

export {};
