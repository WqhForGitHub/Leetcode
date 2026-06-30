// ============================================================
// 066. 矩阵转换后的排名
// ============================================================
// LeetCode 1632. Rank Transform of a Matrix
// 给定 matrix，返回同大小排名矩阵。同行同列相同值排名相同，排名从 1 开始连续。
// 时间复杂度：O(m * n * log(m * n))，空间复杂度：O(m * n)

// ============================================================
// 方法1：按值分组 + 并查集 + 贪心分配排名（推荐）
// ============================================================
function matrixRankTransform1(matrix: number[][]): number[][] {
  const m = matrix.length;
  const n = matrix[0].length;

  // 按值分组
  const valueToCells = new Map<number, number[][]>();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const v = matrix[i][j];
      if (!valueToCells.has(v)) valueToCells.set(v, []);
      valueToCells.get(v)!.push([i, j]);
    }
  }
  const sortedValues = Array.from(valueToCells.keys()).sort((a, b) => a - b);

  const rowRank = new Array<number>(m).fill(0);
  const colRank = new Array<number>(n).fill(0);
  const result: number[][] = Array.from({ length: m }, () =>
    new Array<number>(n).fill(0),
  );

  // 并查集：按单元格下标 i*n+j
  const parent = new Array<number>(m * n);
  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (x: number, y: number): void => {
    const px = find(x);
    const py = find(y);
    if (px !== py) parent[px] = py;
  };

  for (const v of sortedValues) {
    const cells = valueToCells.get(v)!;
    // 初始化这些单元格的父节点
    for (const [r, c] of cells) {
      parent[r * n + c] = r * n + c;
    }
    // 同行同列的相同值单元格必须排名相同，合并
    const rowMap = new Map<number, number[]>();
    const colMap = new Map<number, number[]>();
    for (const [r, c] of cells) {
      if (!rowMap.has(r)) rowMap.set(r, []);
      rowMap.get(r)!.push(r * n + c);
      if (!colMap.has(c)) colMap.set(c, []);
      colMap.get(c)!.push(r * n + c);
    }
    for (const list of rowMap.values()) {
      for (let k = 1; k < list.length; k++) union(list[0], list[k]);
    }
    for (const list of colMap.values()) {
      for (let k = 1; k < list.length; k++) union(list[0], list[k]);
    }

    // 按连通分量分组
    const comp = new Map<number, number[][]>();
    for (const [r, c] of cells) {
      const root = find(r * n + c);
      if (!comp.has(root)) comp.set(root, []);
      comp.get(root)!.push([r, c]);
    }

    // 每个分量取涉及行/列最大排名 + 1
    for (const compCells of comp.values()) {
      let maxRank = 0;
      for (const [r, c] of compCells) {
        maxRank = Math.max(maxRank, rowRank[r], colRank[c]);
      }
      const newRank = maxRank + 1;
      for (const [r, c] of compCells) {
        rowRank[r] = newRank;
        colRank[c] = newRank;
        result[r][c] = newRank;
      }
    }
  }
  return result;
}

// ============================================================
// 方法2：按值分组 + 二分图 BFS 连通分量
// ============================================================
function matrixRankTransform2(matrix: number[][]): number[][] {
  const m = matrix.length;
  const n = matrix[0].length;

  const valueToCells = new Map<number, number[][]>();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const v = matrix[i][j];
      if (!valueToCells.has(v)) valueToCells.set(v, []);
      valueToCells.get(v)!.push([i, j]);
    }
  }
  const sortedValues = Array.from(valueToCells.keys()).sort((a, b) => a - b);

  const rowRank = new Array<number>(m).fill(0);
  const colRank = new Array<number>(n).fill(0);
  const result: number[][] = Array.from({ length: m }, () =>
    new Array<number>(n).fill(0),
  );

  for (const v of sortedValues) {
    const cells = valueToCells.get(v)!;
    // 构建二分图：行节点 0..m-1，列节点 m..m+n-1
    // 用 Set 记录该值涉及的行列
    const rowCells = new Map<number, number[]>();
    const colCells = new Map<number, number[]>();
    for (const [r, c] of cells) {
      if (!rowCells.has(r)) rowCells.set(r, []);
      rowCells.get(r)!.push(c);
      if (!colCells.has(c)) colCells.set(c, []);
      colCells.get(c)!.push(r);
    }

    const visitedRow = new Set<number>();
    const visitedCol = new Set<number>();
    // BFS 找连通分量
    for (const [r0] of rowCells) {
      if (visitedRow.has(r0)) continue;
      // 从行 r0 出发 BFS
      const compRows: number[] = [];
      const compCols: number[] = [];
      const queue: number[] = [r0];
      visitedRow.add(r0);
      let isRow = true;
      const queueIsRow: boolean[] = [true];
      let head = 0;
      while (head < queue.length) {
        const node = queue[head];
        const nodeIsRow = queueIsRow[head];
        head++;
        if (nodeIsRow) {
          compRows.push(node);
          for (const c of rowCells.get(node) ?? []) {
            if (!visitedCol.has(c)) {
              visitedCol.add(c);
              queue.push(c);
              queueIsRow.push(false);
            }
          }
        } else {
          compCols.push(node);
          for (const r of colCells.get(node) ?? []) {
            if (!visitedRow.has(r)) {
              visitedRow.add(r);
              queue.push(r);
              queueIsRow.push(true);
            }
          }
        }
      }

      // 计算该分量排名
      let maxRank = 0;
      for (const r of compRows) maxRank = Math.max(maxRank, rowRank[r]);
      for (const c of compCols) maxRank = Math.max(maxRank, colRank[c]);
      const newRank = maxRank + 1;
      for (const r of compRows) rowRank[r] = newRank;
      for (const c of compCols) colRank[c] = newRank;
    }

    // 填充结果
    for (const [r, c] of cells) {
      result[r][c] = Math.max(rowRank[r], colRank[c]);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 066. 矩阵转换后的排名 =====");
console.log(
  JSON.stringify(
    matrixRankTransform1([
      [1, 2],
      [3, 4],
    ]),
  ),
);
// 期望: [[1,2],[2,3]]
console.log(
  JSON.stringify(
    matrixRankTransform1([
      [7, 7],
      [7, 7],
    ]),
  ),
);
// 期望: [[1,1],[1,1]]
console.log(
  JSON.stringify(
    matrixRankTransform1([
      [20, -21, 14],
      [-19, 4, 19],
      [22, -47, 24],
      [-19, 4, 19],
    ]),
  ),
);
// 期望: [[4,2,3],[1,3,4],[5,1,6],[1,3,4]]
console.log(
  JSON.stringify(
    matrixRankTransform2([
      [1, 2],
      [3, 4],
    ]),
  ),
);
// 期望: [[1,2],[2,3]]

export {};
