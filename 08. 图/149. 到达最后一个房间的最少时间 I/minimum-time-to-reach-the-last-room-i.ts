// 149. 到达最后一个房间的最少时间 I (LC3341)
// m×n 网格 moveTime[i][j] 表示可进入房间 (i,j) 的最早时间。
// 从 (0,0) 出发到 (m-1,n-1)，每次移动耗时 1 秒，到达后须满足时间 >= moveTime。
// 求最少到达时间。Dijkstra。

type State = { time: number; r: number; c: number };

function minimumTimeToReachTheLastRoomI(moveTime: number[][]): number {
  const m = moveTime.length;
  const n = moveTime[0].length;
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  dist[0][0] = 0;
  const heap: State[] = [{ time: 0, r: 0, c: 0 }];
  while (heap.length > 0) {
    let mi = 0;
    for (let i = 1; i < heap.length; i++) {
      if (heap[i].time < heap[mi].time) mi = i;
    }
    const { time, r, c } = heap.splice(mi, 1)[0];
    if (r === m - 1 && c === n - 1) return time;
    if (time > dist[r][c]) continue;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      // 进入 (nr,nc) 至少需要 max(time+1, moveTime[nr][nc]+1)? 不，
      // 到达时间 = max(time + 1, moveTime[nr][nc])，移动耗时 1 秒
      const arrive = Math.max(time + 1, moveTime[nr][nc]);
      if (arrive < dist[nr][nc]) {
        dist[nr][nc] = arrive;
        heap.push({ time: arrive, r: nr, c: nc });
      }
    }
  }
  return dist[m - 1][n - 1];
}

function minimumTimeToReachTheLastRoomIMethod2(moveTime: number[][]): number {
  // 方法2：基于优先队列的 Dijkstra（数组实现 + 懒删除），等价实现
  const m = moveTime.length;
  const n = moveTime[0].length;
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  dist[0][0] = 0;
  // 三元组数组 [time, r, c]
  const heap: [number, number, number][] = [[0, 0, 0]];
  while (heap.length > 0) {
    let mi = 0;
    for (let i = 1; i < heap.length; i++) {
      if (heap[i][0] < heap[mi][0]) mi = i;
    }
    const [time, r, c] = heap.splice(mi, 1)[0];
    if (r === m - 1 && c === n - 1) return time;
    if (time > dist[r][c]) continue;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      const arrive = Math.max(time + 1, moveTime[nr][nc]);
      if (arrive < dist[nr][nc]) {
        dist[nr][nc] = arrive;
        heap.push([arrive, nr, nc]);
      }
    }
  }
  return dist[m - 1][n - 1];
}

// 测试
(() => {
  console.log(
    minimumTimeToReachTheLastRoomI([
      [0, 4],
      [4, 4],
    ]),
  ); // 6
  console.log(
    minimumTimeToReachTheLastRoomI([
      [0, 0, 0],
      [0, 0, 0],
    ]),
  ); // 2
  console.log(
    minimumTimeToReachTheLastRoomI([
      [0, 1],
      [1, 2],
    ]),
  ); // 3
})();

export {};
