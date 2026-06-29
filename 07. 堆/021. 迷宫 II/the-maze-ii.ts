// ============================================================
// 021. 迷宫 II
// ============================================================
// LeetCode 505. The Maze II
// 球在迷宫中滚动直到撞墙，求从起点到终点的最短距离。
// 时间复杂度：O(mn log(mn))，空间复杂度：O(mn)

// 方法1：Dijkstra + 最小堆
function shortestDistance(maze: number[][], start: number[], destination: number[]): number {
  const m = maze.length;
  const n = maze[0].length;
  const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const heap: Array<{ d: number; r: number; c: number }> = [];
  const push = (v: { d: number; r: number; c: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].d < heap[p].d) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { d: number; r: number; c: number } | undefined => {
    if (heap.length === 0) return undefined;
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l].d < heap[s].d) s = l;
        if (r < heap.length && heap[r].d < heap[s].d) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  dist[start[0]][start[1]] = 0;
  push({ d: 0, r: start[0], c: start[1] });
  while (heap.length > 0) {
    const cur = pop()!;
    if (cur.r === destination[0] && cur.c === destination[1]) return cur.d;
    if (cur.d > dist[cur.r][cur.c]) continue;
    for (const [dr, dc] of dirs) {
      let nr = cur.r;
      let nc = cur.c;
      let steps = 0;
      while (nr + dr >= 0 && nr + dr < m && nc + dc >= 0 && nc + dc < n && maze[nr + dr][nc + dc] === 0) {
        nr += dr;
        nc += dc;
        steps++;
      }
      const nd = cur.d + steps;
      if (nd < dist[nr][nc]) {
        dist[nr][nc] = nd;
        push({ d: nd, r: nr, c: nc });
      }
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 021. 迷宫 II =====");
console.log("最短距离:", shortestDistance([[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [1, 1, 0, 1, 1], [0, 0, 0, 0, 0]], [0, 4], [4, 4]));
// 期望 12

export {};
