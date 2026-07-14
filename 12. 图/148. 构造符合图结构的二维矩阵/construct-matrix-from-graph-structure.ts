// 148. 构造符合图结构的二维矩阵 (自定义)
// 给定无向图（n 个节点，edges），构造其邻接矩阵。
// 思路：直接构造 n×n 矩阵，adj[i][j] = 1 表示 i,j 之间存在边。

function constructMatrixFromGraphStructure(n: number, edges: number[][]): number[][] {
  const matrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const [u, v] of edges) {
    matrix[u][v] = 1;
    matrix[v][u] = 1;
  }
  return matrix;
}

function constructMatrixFromGraphStructureMethod2(
  n: number,
  edges: number[][],
  weighted: boolean = false,
): number[][] {
  // 方法2：支持带权图（边权在第三位）
  const matrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const e of edges) {
    const u = e[0];
    const v = e[1];
    const w = e.length >= 3 ? e[2] : 1;
    matrix[u][v] = w;
    matrix[v][u] = w;
  }
  return matrix;
}

// 测试
(() => {
  console.log(
    constructMatrixFromGraphStructure(4, [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ]),
  );
  // [[1,1,0,1],[1,0,1,0],[0,1,0,1],[1,0,1,0]]
  console.log(
    constructMatrixFromGraphStructureMethod2(
      3,
      [
        [0, 1, 5],
        [1, 2, 3],
      ],
      true,
    ),
  );
  // [[0,5,0],[5,0,3],[0,3,0]]
  console.log(constructMatrixFromGraphStructure(1, [])); // [[0]]
})();

export {};
