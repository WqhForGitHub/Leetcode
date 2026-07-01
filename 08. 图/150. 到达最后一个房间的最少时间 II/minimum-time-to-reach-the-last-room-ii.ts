// 150. 到达最后一个房间的最少时间 II (LC3342)
// m×n 网格 moveTime[i][j] 表示可进入房间 (i,j) 的最早时间。
// 每次移动代价按已移动步数奇偶交变：第 1、3、5... 次移动耗时 1 秒，
// 第 2、4、6... 次移动耗时 2 秒。求 (0,0) 到 (m-1,n-1) 最少时间。
// Dijkstra 状态含奇偶（已走步数的奇偶性）。

type State2 = { time: number; r: number; c: number; parity: number };

function minimumTimeToReachTheLastRoomII(moveTime: number[][]): number {
  const m = moveTime.length;
  const n = moveTime[0].length;
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  // dist[r][c][p]: 到达 (r,c) 且已走步数奇偶为 p 的最少时间
  const dist: number[][][] = Array.from({ length: m }, () =>
    Array.from({ length: n }, () => new Array(2).fill(Infinity)),
  );
  dist[0][0][0] = 0;
  const heap: State2[] = [{ time: 0, r: 0, c: 0, parity: 0 }];
  while (heap.length > 0) {
    let mi = 0;
    for (let i = 1; i < heap.length; i++) {
      if (heap[i].time < heap[mi].time) mi = i;
    }
    const { time, r, c, parity } = heap.splice(mi, 1)[0];
    if (r === m - 1 && c === n - 1) return time;
    if (time > dist[r][c][parity]) continue;
    const stepCost = parity === 0 ? 1 : 2;
    const nextParity = 1 - parity;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      const arrive = Math.max(time + stepCost, moveTime[nr][nc]);
      if (arrive < dist[nr][nc][nextParity]) {
        dist[nr][nc][nextParity] = arrive;
        heap.push({ time: arrive, r: nr, c: nc, parity: nextParity });
      }
    }
  }
  return Math.min(dist[m - 1][n - 1][0], dist[m - 1][n - 1][1]);
}

function minimumTimeToReachTheLastRoomIIMethod2(moveTime: number[][]): number {
  // 方法2：将奇偶状态编码到节点下标（展平为一维），同样 Dijkstra
  const m = moveTime.length;
  const n = moveTime[0].length;
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const N = m * n * 2;
  const dist: number[] = new Array(N).fill(Infinity);
  const idx = (r: number, c: number, p: number) => (r * n + c) * 2 + p;
  dist[idx(0, 0, 0)] = 0;
  const heap: [number, number][] = [[0, idx(0, 0, 0)]];
  while (heap.length > 0) {
    let mi = 0;
    for (let i = 1; i < heap.length; i++) {
      if (heap[i][0] < heap[mi][0]) mi = i;
    }
    const [time, code] = heap.splice(mi, 1)[0];
    const p = code % 2;
    const cell = (code - p) / 2;
    const r = Math.floor(cell / n);
    const c = cell % n;
    if (r === m - 1 && c === n - 1) return time;
    if (time > dist[code]) continue;
    const stepCost = p === 0 ? 1 : 2;
    const np = 1 - p;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      const arrive = Math.max(time + stepCost, moveTime[nr][nc]);
      const ncode = idx(nr, nc, np);
      if (arrive < dist[ncode]) {
        dist[ncode] = arrive;
        heap.push([arrive, ncode]);
      }
    }
  }
  return Math.min(dist[idx(m - 1, n - 1, 0)], dist[idx(m - 1, n - 1, 1)]);
}

// 测试
(() => {
  console.log(
    minimumTimeToReachTheLastRoomII([
      [0, 4],
      [4, 4],
    ]),
  ); // 5
  console.log(
    minimumTimeToReachTheLastRoomII([
      [0, 0, 0],
      [0, 0, 0],
    ]),
  ); // 3
  console.log(
    minimumTimeToReachTheLastRoomII([
      [0, 1],
      [1, 2],
    ]),
  ); // 3
})();

export {};
