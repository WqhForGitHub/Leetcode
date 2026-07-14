// ============================================================
// 237. 矩阵中最大的三个菱形和
// ============================================================
// LeetCode 1878. Get Biggest Three Rhombus Sums in a Grid
// 给定 m x n 矩阵 grid，计算所有菱形边界元素之和，
// 返回最大的三个不同值（降序，不足三个则全部返回）。
// 半径为 0 的菱形为单个格子；半径 k>=1 的菱形以 (x,y) 为中心，
// 四角为 (x-k,y),(x,y+k),(x+k,y),(x,y-k)，边界为四条对角线段。

// 方法1：枚举所有中心与半径（暴力，O(m*n*min(m,n)^2)）
function getBiggestThree1(grid: number[][]): number[] {
  const m = grid.length;
  const n = grid[0].length;
  const top3: number[] = [];
  const add = (val: number): void => {
    if (top3.includes(val)) return;
    top3.push(val);
    top3.sort((a, b) => b - a);
    if (top3.length > 3) top3.pop();
  };
  for (let x = 0; x < m; x++) {
    for (let y = 0; y < n; y++) {
      add(grid[x][y]); // 半径 0
      const maxR = Math.min(x, m - 1 - x, y, n - 1 - y);
      for (let k = 1; k <= maxR; k++) {
        let sum = 0;
        for (let t = 0; t < k; t++) {
          sum += grid[x - k + t][y + t]; // 上 -> 右
          sum += grid[x + t][y + k - t]; // 右 -> 下
          sum += grid[x + k - t][y - t]; // 下 -> 左
          sum += grid[x - t][y - k + t]; // 左 -> 上
        }
        add(sum);
      }
    }
  }
  return top3;
}

// 方法2：对角线前缀和优化（O(m*n*min(m,n))）
// 预处理两条对角线方向的前缀和，每条菱形边段可在 O(1) 求得。
function getBiggestThree2(grid: number[][]): number[] {
  const m = grid.length;
  const n = grid[0].length;
  // diag[i][j]: 主对角线(i-j 相同)从起点到 (i,j) 的和
  // anti[i][j]: 副对角线(i+j 相同)从起点到 (i,j) 的和
  const diag: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  const anti: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      diag[i][j] = grid[i][j] + (i > 0 && j > 0 ? diag[i - 1][j - 1] : 0);
      anti[i][j] = grid[i][j] + (i > 0 && j < n - 1 ? anti[i - 1][j + 1] : 0);
    }
  }
  // 主对角线段 (r1,c1)->(r2,c2)，r2>=r1，c2=c1+(r2-r1)
  const diagSum = (r1: number, c1: number, r2: number, c2: number): number => {
    let s = diag[r2][c2];
    if (r1 > 0 && c1 > 0) s -= diag[r1 - 1][c1 - 1];
    return s;
  };
  // 副对角线段 (r1,c1)->(r2,c2)，r2>=r1，c2=c1-(r2-r1)
  const antiSum = (r1: number, c1: number, r2: number, c2: number): number => {
    let s = anti[r2][c2];
    if (r1 > 0 && c1 < n - 1) s -= anti[r1 - 1][c1 + 1];
    return s;
  };

  const top3: number[] = [];
  const add = (val: number): void => {
    if (top3.includes(val)) return;
    top3.push(val);
    top3.sort((a, b) => b - a);
    if (top3.length > 3) top3.pop();
  };

  for (let x = 0; x < m; x++) {
    for (let y = 0; y < n; y++) {
      add(grid[x][y]);
      const maxR = Math.min(x, m - 1 - x, y, n - 1 - y);
      for (let k = 1; k <= maxR; k++) {
        const e1 = diagSum(x - k, y, x - 1, y + k - 1); // 上 -> 右
        const e2 = antiSum(x, y + k, x + k - 1, y + 1); // 右 -> 下
        const e3 = diagSum(x + 1, y - k + 1, x + k, y); // 下 -> 左
        const e4 = antiSum(x - k + 1, y - 1, x, y - k); // 左 -> 上
        add(e1 + e2 + e3 + e4);
      }
    }
  }
  return top3;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 237. 矩阵中最大的三个菱形和 =====");
const grid1 = [
  [3, 4, 5, 1, 3],
  [3, 3, 4, 2, 3],
  [20, 30, 200, 40, 10],
  [1, 5, 5, 4, 1],
  [4, 3, 2, 2, 5],
];
console.log("方法1 grid1:", getBiggestThree1(grid1)); // [228,216,211]
console.log("方法2 grid1:", getBiggestThree2(grid1)); // [228,216,211]

const grid2 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log("方法1 grid2:", getBiggestThree1(grid2)); // [20,9,8]
console.log("方法2 grid2:", getBiggestThree2(grid2)); // [20,9,8]

export {};
