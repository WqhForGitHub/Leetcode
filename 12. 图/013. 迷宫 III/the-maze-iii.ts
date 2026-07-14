// ============================================================
// 013. 迷宫 III
// ============================================================
// LeetCode 499. The Maze III
// 球在迷宫中沿四方向滚动直到撞墙或落入洞中，求起点到洞的最短路径；
// 距离相同取字典序最小（d < l < r < u），不可达返回 "impossible"
// 时间复杂度：O(m·n·log(m·n)·max(m,n))；空间复杂度：O(m·n)

// 通用小顶堆
class MinHeap<T> {
  private data: T[] = [];
  constructor(private less: (a: T, b: T) => boolean) {}

  size(): number {
    return this.data.length;
  }

  push(x: T): void {
    this.data.push(x);
    let i = this.data.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.less(this.data[i], this.data[p])) {
        [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
        i = p;
      } else {
        break;
      }
    }
  }

  pop(): T | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      let i = 0;
      const n = this.data.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let smallest = i;
        if (l < n && this.less(this.data[l], this.data[smallest])) smallest = l;
        if (r < n && this.less(this.data[r], this.data[smallest])) smallest = r;
        if (smallest !== i) {
          [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
          i = smallest;
        } else {
          break;
        }
      }
    }
    return top;
  }
}

// 状态：(距离, 路径字符串, 行, 列)
type State = [number, string, number, number];

// 方法1：Dijkstra + 二叉堆（推荐）
// 距离优先，距离相同按路径字符串字典序比较
function findShortestWay(maze: number[][], ball: number[], hole: number[]): string {
  const m = maze.length;
  const n = maze[0].length;
  const [hr, hc] = hole;
  // 方向按字典序 d < l < r < u
  const dirs: [number, number, string][] = [
    [1, 0, "d"],
    [0, -1, "l"],
    [0, 1, "r"],
    [-1, 0, "u"],
  ];

  const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  const pathStr: string[][] = Array.from({ length: m }, () => new Array(n).fill(""));

  const cmp = (a: State, b: State): boolean => {
    if (a[0] !== b[0]) return a[0] < b[0];
    return a[1] < b[1];
  };
  const heap = new MinHeap<State>(cmp);

  const [sr, sc] = ball;
  dist[sr][sc] = 0;
  pathStr[sr][sc] = "";
  heap.push([0, "", sr, sc]);

  while (heap.size() > 0) {
    const [d, p, r, c] = heap.pop()!;
    // 跳过过期状态
    if (d > dist[r][c] || (d === dist[r][c] && p > pathStr[r][c])) continue;
    if (r === hr && c === hc) return p;

    for (const [dr, dc, ch] of dirs) {
      let nr = r;
      let nc = c;
      let steps = 0;
      // 滚动直到撞墙或落入洞
      while (true) {
        const nrr = nr + dr;
        const ncc = nc + dc;
        if (nrr < 0 || nrr >= m || ncc < 0 || ncc >= n) break;
        if (maze[nrr][ncc] === 1) break;
        nr = nrr;
        nc = ncc;
        steps++;
        if (nr === hr && nc === hc) break; // 落入洞，停止
      }
      const nd = d + steps;
      const curPath = p + ch;
      if (nd < dist[nr][nc] || (nd === dist[nr][nc] && curPath < pathStr[nr][nc])) {
        dist[nr][nc] = nd;
        pathStr[nr][nc] = curPath;
        heap.push([nd, curPath, nr, nc]);
      }
    }
  }
  return "impossible";
}

// 方法2：Dijkstra + 线性扫描取最小（无堆实现，O(V^2)）
function findShortestWayScan(maze: number[][], ball: number[], hole: number[]): string {
  const m = maze.length;
  const n = maze[0].length;
  const [hr, hc] = hole;
  const dirs: [number, number, string][] = [
    [1, 0, "d"],
    [0, -1, "l"],
    [0, 1, "r"],
    [-1, 0, "u"],
  ];
  const INF = Infinity;
  const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(INF));
  const pathStr: string[][] = Array.from({ length: m }, () => new Array(n).fill(""));
  const done: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));

  const [sr, sc] = ball;
  dist[sr][sc] = 0;
  pathStr[sr][sc] = "";

  while (true) {
    // 找未确定中 (dist, path) 最小的格子
    let bestR = -1;
    let bestC = -1;
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (done[r][c]) continue;
        if (dist[r][c] === INF) continue;
        if (
          bestR === -1 ||
          dist[r][c] < dist[bestR][bestC] ||
          (dist[r][c] === dist[bestR][bestC] && pathStr[r][c] < pathStr[bestR][bestC])
        ) {
          bestR = r;
          bestC = c;
        }
      }
    }
    if (bestR === -1) break;
    done[bestR][bestC] = true;
    if (bestR === hr && bestC === hc) return pathStr[bestR][bestC];

    const d = dist[bestR][bestC];
    const p = pathStr[bestR][bestC];
    for (const [dr, dc, ch] of dirs) {
      let nr = bestR;
      let nc = bestC;
      let steps = 0;
      while (true) {
        const nrr = nr + dr;
        const ncc = nc + dc;
        if (nrr < 0 || nrr >= m || ncc < 0 || ncc >= n) break;
        if (maze[nrr][ncc] === 1) break;
        nr = nrr;
        nc = ncc;
        steps++;
        if (nr === hr && nc === hc) break;
      }
      const nd = d + steps;
      const curPath = p + ch;
      if (nd < dist[nr][nc] || (nd === dist[nr][nc] && curPath < pathStr[nr][nc])) {
        dist[nr][nc] = nd;
        pathStr[nr][nc] = curPath;
      }
    }
  }
  return "impossible";
}

// ============================================================
// 测试
// ============================================================
console.log("===== 013. 迷宫 III =====");
const maze1 = [
  [0, 0, 0, 0, 0],
  [1, 1, 0, 0, 1],
  [0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1],
  [0, 1, 0, 0, 0],
];
console.log(findShortestWay(maze1, [4, 3], [0, 1])); // "lul"
console.log(findShortestWayScan(maze1, [4, 3], [0, 1])); // "lul"

const maze2 = [
  [0, 0, 0, 0, 0],
  [1, 1, 0, 0, 1],
  [0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1],
  [0, 1, 0, 0, 0],
];
console.log(findShortestWay(maze2, [0, 0], [1, 1])); // "impossible"
console.log(findShortestWayScan(maze2, [0, 0], [1, 1])); // "impossible"

const maze3 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
console.log(findShortestWay(maze3, [0, 0], [4, 4])); // "dr"（距离 8）

export {};
