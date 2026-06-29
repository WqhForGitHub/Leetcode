// ============================================================
// 019. 迷宫 III
// ============================================================
// LeetCode 499. The Maze III
// 球在迷宫中滚动直到撞墙，求到达洞的最短路径（按字典序）。
// 时间复杂度：O(mn log(mn))，空间复杂度：O(mn)

// 方法1：Dijkstra + 最小堆
function findShortestWay(maze: number[][], ball: number[], hole: number[]): string {
  const m = maze.length;
  const n = maze[0].length;
  const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  const path: string[][] = Array.from({ length: m }, () => new Array(n).fill(""));
  const dirs = [
    { dr: -1, dc: 0, ch: "u" },
    { dr: 1, dc: 0, ch: "d" },
    { dr: 0, dc: -1, ch: "l" },
    { dr: 0, dc: 1, ch: "r" },
  ];
  const heap: Array<{ d: number; r: number; c: number; p: string }> = [];
  const push = (v: { d: number; r: number; c: number; p: string }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const par = (i - 1) >> 1;
      if (heap[i].d < heap[par].d || (heap[i].d === heap[par].d && heap[i].p < heap[par].p)) {
        [heap[i], heap[par]] = [heap[par], heap[i]];
        i = par;
      } else break;
    }
  };
  const pop = (): { d: number; r: number; c: number; p: string } | undefined => {
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
        if (l < heap.length && (heap[l].d < heap[s].d || (heap[l].d === heap[s].d && heap[l].p < heap[s].p))) s = l;
        if (r < heap.length && (heap[r].d < heap[s].d || (heap[r].d === heap[s].d && heap[r].p < heap[s].p))) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  dist[ball[0]][ball[1]] = 0;
  push({ d: 0, r: ball[0], c: ball[1], p: "" });
  while (heap.length > 0) {
    const cur = pop()!;
    if (cur.r === hole[0] && cur.c === hole[1]) return cur.p;
    if (cur.d > dist[cur.r][cur.c]) continue;
    for (const { dr, dc, ch } of dirs) {
      let nr = cur.r;
      let nc = cur.c;
      let steps = 0;
      while (nr + dr >= 0 && nr + dr < m && nc + dc >= 0 && nc + dc < n && maze[nr + dr][nc + dc] === 0) {
        nr += dr;
        nc += dc;
        steps++;
        if (nr === hole[0] && nc === hole[1]) break;
      }
      const nd = cur.d + steps;
      if (nd < dist[nr][nc] || (nd === dist[nr][nc] && (path[nr][nc] === "" || cur.p + ch < path[nr][nc]))) {
        dist[nr][nc] = nd;
        path[nr][nc] = cur.p + ch;
        push({ d: nd, r: nr, c: nc, p: cur.p + ch });
      }
    }
  }
  return "impossible";
}

// ============================================================
// 测试
// ============================================================
console.log("===== 019. 迷宫 III =====");
console.log("路径:", findShortestWay([[0, 0, 0, 0, 0], [1, 1, 0, 0, 1], [0, 0, 0, 0, 0], [0, 1, 0, 0, 1], [0, 1, 0, 0, 0]], [4, 3], [0, 1]));
// 期望 "lul"

export {};
