// ============================================================
// 206. 矩阵转换后的排名
// ============================================================
// LeetCode 1632. Rank Transform of a Matrix
// 给定矩阵，将每个元素替换为其排名：排名从1开始，较大值排名较大，
// 相同值排名相同，值 v 的排名 = 1 + 同行或同列中所有小于 v 的值的最大排名。

type Cell = { val: number; row: number; col: number };

// 方法1：按值排序 + 并查集分组同行同列相同值 + 分配排名（O(mn * α(mn)))
function matrixRankTransform(matrix: number[][]): number[][] {
  const m = matrix.length;
  const n = matrix[0].length;
  const result: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));

  // 收集所有单元格并按值排序
  const cells: Cell[] = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      cells.push({ val: matrix[i][j], row: i, col: j });
    }
  }
  cells.sort((a, b) => a.val - b.val);

  // 记录每行每列当前最大排名
  const rowMax = new Array<number>(m).fill(0);
  const colMax = new Array<number>(n).fill(0);

  // 并查集
  const parent = new Array<number>(m * n);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(x: number, y: number): void {
    const px = find(x);
    const py = find(y);
    if (px !== py) parent[px] = py;
  }

  let idx = 0;
  while (idx < cells.length) {
    const currentVal = cells[idx].val;
    const group: Cell[] = [];

    // 收集所有相同值的单元格
    while (idx < cells.length && cells[idx].val === currentVal) {
      group.push(cells[idx]);
      idx++;
    }

    // 初始化并查集
    for (const cell of group) {
      parent[cell.row * n + cell.col] = cell.row * n + cell.col;
    }

    // 按行分组并合并
    const rowMap = new Map<number, number[]>();
    const colMap = new Map<number, number[]>();
    for (let i = 0; i < group.length; i++) {
      const cell = group[i];
      if (!rowMap.has(cell.row)) rowMap.set(cell.row, []);
      rowMap.get(cell.row)!.push(i);
      if (!colMap.has(cell.col)) colMap.set(cell.col, []);
      colMap.get(cell.col)!.push(i);
    }

    for (const indices of rowMap.values()) {
      for (let i = 1; i < indices.length; i++) {
        union(
          group[indices[0]].row * n + group[indices[0]].col,
          group[indices[i]].row * n + group[indices[i]].col,
        );
      }
    }
    for (const indices of colMap.values()) {
      for (let i = 1; i < indices.length; i++) {
        union(
          group[indices[0]].row * n + group[indices[0]].col,
          group[indices[i]].row * n + group[indices[i]].col,
        );
      }
    }

    // 按根节点分组
    const rootGroups = new Map<number, Cell[]>();
    for (const cell of group) {
      const root = find(cell.row * n + cell.col);
      if (!rootGroups.has(root)) rootGroups.set(root, []);
      rootGroups.get(root)!.push(cell);
    }

    // 为每个连通分量分配排名
    for (const componentCells of rootGroups.values()) {
      let maxRank = 0;
      for (const cell of componentCells) {
        maxRank = Math.max(maxRank, rowMax[cell.row], colMax[cell.col]);
      }
      const rank = maxRank + 1;
      for (const cell of componentCells) {
        result[cell.row][cell.col] = rank;
        rowMax[cell.row] = rank;
        colMax[cell.col] = rank;
      }
    }
  }

  return result;
}

// 方法2：按值排序 + 按值分组 + BFS找连通分量 + 追踪行列最大排名（O(mn * log(mn)))
function matrixRankTransform2(matrix: number[][]): number[][] {
  const m = matrix.length;
  const n = matrix[0].length;
  const result: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));

  const cells: Cell[] = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      cells.push({ val: matrix[i][j], row: i, col: j });
    }
  }
  cells.sort((a, b) => a.val - b.val);

  const rowMax = new Array<number>(m).fill(0);
  const colMax = new Array<number>(n).fill(0);

  let idx = 0;
  while (idx < cells.length) {
    const currentVal = cells[idx].val;
    const group: Cell[] = [];
    while (idx < cells.length && cells[idx].val === currentVal) {
      group.push(cells[idx]);
      idx++;
    }

    // 构建行和列的索引映射
    const rowMap = new Map<number, number[]>();
    const colMap = new Map<number, number[]>();
    for (let i = 0; i < group.length; i++) {
      const cell = group[i];
      if (!rowMap.has(cell.row)) rowMap.set(cell.row, []);
      rowMap.get(cell.row)!.push(i);
      if (!colMap.has(cell.col)) colMap.set(cell.col, []);
      colMap.get(cell.col)!.push(i);
    }

    // BFS 找连通分量
    const visited = new Array<boolean>(group.length).fill(false);
    for (let i = 0; i < group.length; i++) {
      if (visited[i]) continue;

      const component: number[] = [];
      const queue: number[] = [i];
      let head = 0;
      visited[i] = true;

      while (head < queue.length) {
        const cur = queue[head];
        head++;
        component.push(cur);

        // 同行的单元格加入队列
        const rowIndices = rowMap.get(group[cur].row);
        if (rowIndices) {
          for (const next of rowIndices) {
            if (!visited[next]) {
              visited[next] = true;
              queue.push(next);
            }
          }
        }
        // 同列的单元格加入队列
        const colIndices = colMap.get(group[cur].col);
        if (colIndices) {
          for (const next of colIndices) {
            if (!visited[next]) {
              visited[next] = true;
              queue.push(next);
            }
          }
        }
      }

      // 计算该连通分量的排名
      let maxRank = 0;
      for (const ci of component) {
        maxRank = Math.max(maxRank, rowMax[group[ci].row], colMax[group[ci].col]);
      }
      const rank = maxRank + 1;
      for (const ci of component) {
        result[group[ci].row][group[ci].col] = rank;
        rowMax[group[ci].row] = rank;
        colMax[group[ci].col] = rank;
      }
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 206. 矩阵转换后的排名 =====");
console.log(
  "方法1 [[1,2],[3,4]]:",
  matrixRankTransform([
    [1, 2],
    [3, 4],
  ]),
);
console.log(
  "方法2 [[1,2],[3,4]]:",
  matrixRankTransform2([
    [1, 2],
    [3, 4],
  ]),
);
console.log(
  "方法1 [[7,7],[7,7]]:",
  matrixRankTransform([
    [7, 7],
    [7, 7],
  ]),
);
console.log(
  "方法2 [[7,7],[7,7]]:",
  matrixRankTransform2([
    [7, 7],
    [7, 7],
  ]),
);
console.log(
  "方法1 [[7,5],[7,7]]:",
  matrixRankTransform([
    [7, 5],
    [7, 7],
  ]),
);
console.log(
  "方法2 [[7,5],[7,7]]:",
  matrixRankTransform2([
    [7, 5],
    [7, 7],
  ]),
);

export {};
