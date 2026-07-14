// ============================================================
// 101. 巡逻的骑士
// ============================================================
// LeetCode 2596. Check Knight Tour Configuration
// 给定 n×n 网格含 0..n²-1，验证是否为从值 0 出发的合法骑士巡逻：每步为马步且访问所有格子
// 时间复杂度：O(n²), 空间复杂度：O(n²)

// 方法1：验证(逐步检查) (推荐)
// 记录每个值所在位置，依次检查相邻值的位移是否为合法马步
function isKnightsTour(grid: number[][]): boolean {
  const n = grid.length;
  const total = n * n;
  const pos: Array<[number, number]> = new Array(total);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const v = grid[i][j];
      if (v < 0 || v >= total) return false; // 值越界
      pos[v] = [i, j];
    }
  }
  // 检查每对相邻值是否为合法马步 (|Δr|,|Δc|) ∈ {(1,2),(2,1)}
  for (let v = 0; v < total - 1; v++) {
    const [r1, c1] = pos[v];
    const [r2, c2] = pos[v + 1];
    const dr = Math.abs(r1 - r2);
    const dc = Math.abs(c1 - c2);
    if (!((dr === 1 && dc === 2) || (dr === 2 && dc === 1))) return false;
  }
  return true;
}

// 方法2：回溯(沿网格序列 DFS 验证)
// 从值 0 出发递归：定位下一个值的位置，验证马步后推进，某步非法则回溯返回 false
function isKnightsTour2(grid: number[][]): boolean {
  const n = grid.length;
  const total = n * n;
  const pos: Array<[number, number]> = new Array(total);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const v = grid[i][j];
      if (v < 0 || v >= total) return false;
      pos[v] = [i, j];
    }
  }
  const isKnightMove = (r1: number, c1: number, r2: number, c2: number): boolean => {
    const dr = Math.abs(r1 - r2);
    const dc = Math.abs(c1 - c2);
    return (dr === 1 && dc === 2) || (dr === 2 && dc === 1);
  };
  const dfs = (v: number): boolean => {
    if (v === total - 1) return true; // 已检查到最后一个值
    const [r1, c1] = pos[v];
    const [r2, c2] = pos[v + 1];
    if (!isKnightMove(r1, c1, r2, c2)) return false; // 此步非法，回溯
    return dfs(v + 1);
  };
  return dfs(0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 101. 巡逻的骑士 =====");
// 3×3 中心格(1,1)不可达，无法构成骑士巡逻 => false
console.log(
  isKnightsTour([
    [0, 3, 6],
    [5, 8, 1],
    [2, 7, 4],
  ]),
); // 期望结果: false
// 5×5 合法骑士巡逻 => true
console.log(
  isKnightsTour([
    [0, 11, 16, 5, 20],
    [17, 4, 19, 10, 15],
    [12, 1, 8, 21, 6],
    [3, 18, 23, 14, 9],
    [24, 13, 2, 7, 22],
  ]),
); // 期望结果: true
console.log("--- 方法2测试 ---");
// 3×3 中心格(1,1)不可达，无法构成骑士巡逻 => false
console.log(
  isKnightsTour2([
    [0, 3, 6],
    [5, 8, 1],
    [2, 7, 4],
  ]),
); // 期望结果: false
// 5×5 合法骑士巡逻 => true
console.log(
  isKnightsTour2([
    [0, 11, 16, 5, 20],
    [17, 4, 19, 10, 15],
    [12, 1, 8, 21, 6],
    [3, 18, 23, 14, 9],
    [24, 13, 2, 7, 22],
  ]),
); // 期望结果: true

export {};
