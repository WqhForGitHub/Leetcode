// ============================================================
// 074. 隐藏网格下的最小消耗路径
// ============================================================
// LeetCode 1778. Shortest Path in a Hidden Grid
// 交互式问题。已知存在全局 GridMaster 接口：
//   canMove(direction: "U"|"D"|"L"|"R"): boolean
//   move(direction): void
//   isTarget(): boolean
// 从 (0,0) 出发，在未知网格中找到通往目标格的最短步数，无法到达返回 -1。
// 时间复杂度：O(网格可通行格数)，空间复杂度：O(网格可通行格数)

// 全局 GridMaster 接口声明（由评测机提供）
declare interface GridMaster {
  canMove(direction: string): boolean;
  move(direction: string): void;
  isTarget(): boolean;
}

const DIRS: Array<[string, number, number]> = [
  ["U", -1, 0],
  ["D", 1, 0],
  ["L", 0, -1],
  ["R", 0, 1],
];
const OPP: Record<string, string> = { U: "D", D: "U", L: "R", R: "L" };

function keyOf(r: number, c: number): string {
  return `${r},${c}`;
}

// 方法1：DFS 探索建图 + BFS 最短路（推荐）
function findShortestPath(master: GridMaster): number {
  // passable 记录所有真实可通行的格子，target 记录目标格坐标键
  const passable = new Set<string>();
  let target: string | null = null;

  // DFS 探索：通过 canMove/move 探测整张网格，move 后用反向 move 回溯
  function dfs(r: number, c: number): void {
    const k = keyOf(r, c);
    passable.add(k);
    if (master.isTarget()) target = k;
    for (const [dir, dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      const nk = keyOf(nr, nc);
      if (passable.has(nk)) continue;
      if (master.canMove(dir)) {
        master.move(dir);
        dfs(nr, nc);
        master.move(OPP[dir]); // 回溯到 (r,c)
      }
    }
  }
  dfs(0, 0);
  if (target === null) return -1;

  // BFS 在已知可通行格上求从 (0,0) 到 target 的最短步数
  const visited = new Set<string>(["0,0"]);
  const queue: Array<[number, number, number]> = [[0, 0, 0]];
  while (queue.length > 0) {
    const [r, c, d] = queue.shift()!;
    if (keyOf(r, c) === target) return d;
    for (const [, dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      const nk = keyOf(nr, nc);
      if (passable.has(nk) && !visited.has(nk)) {
        visited.add(nk);
        queue.push([nr, nc, d + 1]);
      }
    }
  }
  return -1;
}

// 模拟 GridMaster 用于本地测试
class MockGridMaster implements GridMaster {
  private grid: Map<string, number>; // 1 = 可通行且非目标, 2 = 目标, 0 = 障碍
  private r = 0;
  private c = 0;
  constructor(blocked: string[][], target: [number, number]) {
    this.grid = new Map();
    this.grid.set("0,0", 1);
    for (const [d, p] of blocked) {
      // 占位，忽略
      void [d, p];
    }
    this.grid.set(keyOf(target[0], target[1]), 2);
  }
  canMove(direction: string): boolean {
    const [dr, dc] = this.delta(direction);
    const nk = keyOf(this.r + dr, this.c + dc);
    const v = this.grid.get(nk);
    return v === 1 || v === 2;
  }
  move(direction: string): void {
    const [dr, dc] = this.delta(direction);
    this.r += dr;
    this.c += dc;
  }
  isTarget(): boolean {
    return this.grid.get(keyOf(this.r, this.c)) === 2;
  }
  private delta(dir: string): [number, number] {
    if (dir === "U") return [-1, 0];
    if (dir === "D") return [1, 0];
    if (dir === "L") return [0, -1];
    return [0, 1];
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 074. 隐藏网格下的最小消耗路径 =====");
// 构造一个简单网格：(0,0)->(0,1)->(0,2) 目标在 (0,2)
// MockGridMaster 的实现较简单，这里仅做示意性调用
const mock = new MockGridMaster([], [0, 2]);
// 为使测试通过，需手动设置中间格可通行
(mock as unknown as { grid: Map<string, number> }).grid.set("0,1", 1);
console.log(findShortestPath(mock as unknown as GridMaster)); // 期望 2

export {};
