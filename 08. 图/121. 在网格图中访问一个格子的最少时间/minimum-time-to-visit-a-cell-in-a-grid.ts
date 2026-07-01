// 121. 在网格图中访问一个格子的最少时间
// LC2577. Minimum Time to Visit a Cell In a Grid
// 题意：m×n 网格 grid，访问 (i,j) 至少需 grid[i][j] 时刻。
//      每步可上下左右移动一格耗时 1，起点 (0,0) 到 (m-1,n-1) 的最少时间。
// 思路：Dijkstra + 奇偶性。若到达时间 t < grid[i][j]，需等待至 grid[i][j]，
//      且需保证与目标格奇偶性一致，否则多等 1。

type Cell = { r: number; c: number; t: number };

function minimumTime(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  if (grid[0][1] > 1 && grid[1][0] > 1) {
    return -1;
  }

  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const dist: number[][] = Array.from({ length: m }, () => Array(n).fill(Infinity));
  dist[0][0] = grid[0][0];

  const pq: Cell[] = [{ r: 0, c: 0, t: grid[0][0] }];
  const push = (cell: Cell): void => {
    let i = pq.length;
    pq.push(cell);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (pq[p].t <= pq[i].t) break;
      [pq[p], pq[i]] = [pq[i], pq[p]];
      i = p;
    }
  };
  const pop = (): Cell => {
    const top = pq[0];
    const last = pq.pop()!;
    if (pq.length > 0) {
      pq[0] = last;
      let i = 0;
      const len = pq.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let s = i;
        if (l < len && pq[l].t < pq[s].t) s = l;
        if (r < len && pq[r].t < pq[s].t) s = r;
        if (s === i) break;
        [pq[s], pq[i]] = [pq[i], pq[s]];
        i = s;
      }
    }
    return top;
  };

  while (pq.length > 0) {
    const { r, c, t } = pop();
    if (r === m - 1 && c === n - 1) {
      return t;
    }
    if (t > dist[r][c]) continue;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      let nt = t + 1;
      if (nt < grid[nr][nc]) {
        const diff = grid[nr][nc] - nt;
        nt = grid[nr][nc] + (diff & 1);
      }
      if (nt < dist[nr][nc]) {
        dist[nr][nc] = nt;
        push({ r: nr, c: nc, t: nt });
      }
    }
  }
  return -1;
}

function test(): void {
  const case1: number[][] = [
    [0, 2, 4],
    [3, 2, 1],
    [1, 2, 1],
  ];
  const ans1 = minimumTime(case1);
  const exp1 = 7;
  console.log("case1:", ans1, "expected:", exp1, ans1 === exp1);

  const case2: number[][] = [
    [0, 1, 3],
    [2, 4, 1],
    [1, 2, 1],
  ];
  const ans2 = minimumTime(case2);
  const exp2 = 5;
  console.log("case2:", ans2, "expected:", exp2, ans2 === exp2);
}

test();

export {};
