// ============================================================
// 014. 迷宫 II
// ============================================================
// LeetCode 505. The Maze II
// 球在迷宫中沿四方向滚动直到撞墙停下，求起点到终点最短距离，不可达返回 -1
// 时间复杂度：Dijkstra O(m·n·log(m·n)·max(m,n))；SPFA 平均 O(k·E)

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

// 计算 (r,c) 沿方向 (dr,dc) 滚动后的停留位置与步数
function roll(
  maze: number[][],
  r: number,
  c: number,
  dr: number,
  dc: number,
): [number, number, number] {
  const m = maze.length;
  const n = maze[0].length;
  let steps = 0;
  while (true) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nr >= m || nc < 0 || nc >= n) break;
    if (maze[nr][nc] === 1) break;
    r = nr;
    c = nc;
    steps++;
  }
  return [r, c, steps];
}

// 方法1：Dijkstra + 二叉堆（推荐）
function shortestDistance(maze: number[][], start: number[], destination: number[]): number {
  const m = maze.length;
  const n = maze[0].length;
  const dirs = [
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, 0],
  ];
  const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  const [sr, sc] = start;
  const [tr, tc] = destination;
  dist[sr][sc] = 0;

  const heap = new MinHeap<[number, number, number]>((a, b) => a[0] < b[0]);
  heap.push([0, sr, sc]);

  while (heap.size() > 0) {
    const [d, r, c] = heap.pop()!;
    if (d > dist[r][c]) continue;
    if (r === tr && c === tc) return d;
    for (const [dr, dc] of dirs) {
      const [nr, nc, steps] = roll(maze, r, c, dr, dc);
      if (steps === 0) continue;
      const nd = d + steps;
      if (nd < dist[nr][nc]) {
        dist[nr][nc] = nd;
        heap.push([nd, nr, nc]);
      }
    }
  }
  return -1;
}

// 方法2：SPFA（队列式 Bellman-Ford）
function shortestDistanceSPFA(maze: number[][], start: number[], destination: number[]): number {
  const m = maze.length;
  const n = maze[0].length;
  const dirs = [
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, 0],
  ];
  const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  const inQueue: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
  const [sr, sc] = start;
  const [tr, tc] = destination;
  dist[sr][sc] = 0;
  inQueue[sr][sc] = true;
  const queue: [number, number][] = [[sr, sc]];

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    inQueue[r][c] = false;
    for (const [dr, dc] of dirs) {
      const [nr, nc, steps] = roll(maze, r, c, dr, dc);
      if (steps === 0) continue;
      const nd = dist[r][c] + steps;
      if (nd < dist[nr][nc]) {
        dist[nr][nc] = nd;
        if (!inQueue[nr][nc]) {
          inQueue[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
  }
  return dist[tr][tc] === Infinity ? -1 : dist[tr][tc];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 014. 迷宫 II =====");
const maze1 = [
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0],
  [1, 1, 0, 1, 1],
  [0, 0, 0, 0, 0],
];
console.log(shortestDistance(maze1, [0, 4], [4, 4])); // 12
console.log(shortestDistanceSPFA(maze1, [0, 4], [4, 4])); // 12

const maze2 = [
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0],
  [1, 1, 0, 1, 1],
  [0, 0, 0, 0, 0],
];
console.log(shortestDistance(maze2, [0, 4], [3, 2])); // -1
console.log(shortestDistanceSPFA(maze2, [0, 4], [3, 2])); // -1

export {};
