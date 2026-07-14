// ============================================================
// 105. 将石头分散到网格图的最少移动次数
// ============================================================
// LeetCode 2850. Minimum Moves to Spread Stones Over a Grid
// 3×3 网格中共有 9 个石头，每次可将一个石头上下左右移动一格
// 使每个格子恰好 1 个石头，返回最少总移动次数
// 时间复杂度：O(n!), 空间复杂度：O(n)（n 为空格数，最多 8）

// 提取多余石头位置（源）和空格位置（目标）
function collectSourcesTargets(grid: number[][]): {
  sources: [number, number][];
  targets: [number, number][];
} {
  const sources: [number, number][] = [];
  const targets: [number, number][] = [];
  for (let i: number = 0; i < 3; i++) {
    for (let j: number = 0; j < 3; j++) {
      if (grid[i][j] === 0) targets.push([i, j]);
      else for (let k: number = 1; k < grid[i][j]; k++) sources.push([i, j]);
    }
  }
  return { sources, targets };
}

// 方法1：回溯匹配多源到多目标（推荐）
// 回溯分配每个空格一个源石头，使总曼哈顿距离最小
function minimumMoves(grid: number[][]): number {
  const { sources, targets } = collectSourcesTargets(grid);
  const n: number = sources.length;
  if (n === 0) return 0;
  const used: boolean[] = new Array(n).fill(false);
  let result: number = Infinity;

  function backtrack(targetIdx: number, cost: number): void {
    if (targetIdx === targets.length) {
      result = Math.min(result, cost);
      return;
    }
    for (let i: number = 0; i < n; i++) {
      if (!used[i]) {
        used[i] = true;
        const dist: number =
          Math.abs(sources[i][0] - targets[targetIdx][0]) +
          Math.abs(sources[i][1] - targets[targetIdx][1]);
        backtrack(targetIdx + 1, cost + dist);
        used[i] = false;
      }
    }
  }
  backtrack(0, 0);
  return result;
}

// 方法2：DFS + 记忆化（位掩码最小权匹配）
// 用位掩码记录已使用的源，DFS 求最小权匹配
function minimumMoves2(grid: number[][]): number {
  const { sources, targets } = collectSourcesTargets(grid);
  const n: number = sources.length;
  if (n === 0) return 0;
  const memo: Map<number, number> = new Map();
  const popcount = (x: number): number => {
    let c = 0;
    while (x) {
      c++;
      x &= x - 1;
    }
    return c;
  };

  function dfs(sourceMask: number): number {
    const targetIdx: number = popcount(sourceMask);
    if (targetIdx === targets.length) return 0;
    if (memo.has(sourceMask)) return memo.get(sourceMask)!;
    let result: number = Infinity;
    for (let i: number = 0; i < n; i++) {
      if (!(sourceMask & (1 << i))) {
        const dist: number =
          Math.abs(sources[i][0] - targets[targetIdx][0]) +
          Math.abs(sources[i][1] - targets[targetIdx][1]);
        result = Math.min(result, dist + dfs(sourceMask | (1 << i)));
      }
    }
    memo.set(sourceMask, result);
    return result;
  }
  return dfs(0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 105. 将石头分散到网格图的最少移动次数 =====");
console.log(
  minimumMoves([
    [1, 1, 0],
    [1, 1, 1],
    [1, 2, 1],
  ]),
); // 期望结果: 3
console.log("--- 方法2测试 ---");
console.log(
  minimumMoves2([
    [1, 1, 0],
    [1, 1, 1],
    [1, 2, 1],
  ]),
); // 期望结果: 3

export {};
