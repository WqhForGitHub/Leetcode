// 146. 穿越网格图的安全路径 (自定义)
// m×n 网格，0 为安全格，1 为不安全格。初始 health 血量，
// 进入不安全格扣 1 血（安全格不扣血）。能否从 (0,0) 到 (m-1,n-1)，
// 且全程血量保持 > 0。
// 思路：Dijkstra 最大化到达终点时的剩余血量，比较是否 > 0。
// 等价于最小化"经过的不安全格数量"。

type Cell = { r: number; c: number };

function findSafeWalkThroughGrid(grid: number[][], health: number): boolean {
  const m = grid.length;
  const n = grid[0].length;
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  // maxRemain[r][c]: 到达 (r,c) 时的最大剩余血量
  const maxRemain: number[][] = Array.from({ length: m }, () => new Array(n).fill(-Infinity));
  const startCost = grid[0][0];
  maxRemain[0][0] = health - startCost;
  // 堆：[-remain, r, c]，最大化 remain => 最小化 -remain
  const heap: [number, number, number][] = [-maxRemain[0][0], 0, 0] as any;
  (heap as any).length = 0;
  heap.push([-maxRemain[0][0], 0, 0]);
  while (heap.length > 0) {
    let mi = 0;
    for (let i = 1; i < heap.length; i++) {
      if (heap[i][0] < heap[mi][0]) mi = i;
    }
    const [neg, r, c] = heap.splice(mi, 1)[0];
    const rem = -neg;
    if (r === m - 1 && c === n - 1) return rem > 0;
    if (rem < maxRemain[r][c]) continue;
    if (rem <= 0) continue;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      const nrem = rem - grid[nr][nc];
      if (nrem > maxRemain[nr][nc]) {
        maxRemain[nr][nc] = nrem;
        heap.push([-nrem, nr, nc]);
      }
    }
  }
  return maxRemain[m - 1][n - 1] > 0;
}

function findSafeWalkThroughGridMethod2(grid: number[][], health: number): boolean {
  // 方法2：BFS + 二分 / 0-1 BFS 最小化不安全格数量
  // 用 0-1 BFS（双端队列）：经过安全格代价 0，不安全格代价 1
  const m = grid.length;
  const n = grid[0].length;
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const cost: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  cost[0][0] = grid[0][0];
  const dq: [number, number][] = [[0, 0]];
  while (dq.length > 0) {
    const [r, c] = dq.shift()!;
    if (r === m - 1 && c === n - 1) return cost[r][c] < health;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      const w = grid[nr][nc];
      if (cost[r][c] + w < cost[nr][nc]) {
        cost[nr][nc] = cost[r][c] + w;
        if (w === 0) dq.unshift([nr, nc]);
        else dq.push([nr, nc]);
      }
    }
  }
  return cost[m - 1][n - 1] < health;
}

// 测试
(() => {
  console.log(
    findSafeWalkThroughGrid(
      [
        [0, 1, 0],
        [1, 0, 1],
        [0, 0, 0],
      ],
      3,
    ),
  ); // true
  console.log(
    findSafeWalkThroughGrid(
      [
        [0, 1, 1],
        [1, 1, 1],
        [1, 0, 0],
      ],
      2,
    ),
  ); // false
  console.log(findSafeWalkThroughGrid([[1]], 1)); // true
  console.log(findSafeWalkThroughGrid([[1]], 0)); // false
})();

export {};
