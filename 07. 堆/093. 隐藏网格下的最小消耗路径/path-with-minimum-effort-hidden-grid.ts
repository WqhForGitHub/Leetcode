// ============================================================
// 093. 隐藏网格下的最小消耗路径
// ============================================================
// LeetCode 1778. Path With Minimum Effort (Hidden Grid)
// 通过 GridMaster 接口探索隐藏网格，从 (0,0) 到目标的最小体力消耗。
// 时间复杂度：O(mn log(mn))，空间复杂度：O(mn)

// 方法1：DFS 探索 + Dijkstra
class GridMaster {
  canMove(direction: string): boolean {
    return false;
  }
  move(direction: string): void {}
  isTarget(): boolean {
    return false;
  }
}

function findShortestPath(master: GridMaster): number {
  // 用偏移坐标探索网格
  const grid: Map<string, number> = new Map();
  const dirs: Array<{ d: string; dr: number; dc: number }> = [
    { d: "U", dr: -1, dc: 0 },
    { d: "D", dr: 1, dc: 0 },
    { d: "L", dr: 0, dc: -1 },
    { d: "R", dr: 0, dc: 1 },
  ];
  let target: string | null = null;
  const visited: Set<string> = new Set();
  const dfs = (r: number, c: number): void => {
    const key = `${r},${c}`;
    if (master.isTarget()) target = key;
    for (const { d, dr, dc } of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      const nkey = `${nr},${nc}`;
      if (visited.has(nkey)) continue;
      if (master.canMove(d)) {
        master.move(d);
        visited.add(nkey);
        grid.set(nkey, 1);
        dfs(nr, nc);
        // 回溯
        const back = d === "U" ? "D" : d === "D" ? "U" : d === "L" ? "R" : "L";
        master.move(back);
      } else {
        grid.set(nkey, 0);
      }
    }
  };
  visited.add("0,0");
  grid.set("0,0", 1);
  dfs(0, 0);
  if (target === null) return -1;
  // Dijkstra
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
  push({ d: 0, r: 0, c: 0 });
  const dist: Map<string, number> = new Map();
  dist.set("0,0", 0);
  const dpos = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  while (heap.length > 0) {
    const cur = pop()!;
    const key = `${cur.r},${cur.c}`;
    if (key === target) return cur.d;
    if (cur.d > (dist.get(key) ?? Infinity)) continue;
    for (const [dr, dc] of dpos) {
      const nr = cur.r + dr;
      const nc = cur.c + dc;
      const nkey = `${nr},${nc}`;
      if ((grid.get(nkey) ?? 0) === 0) continue;
      const nd = cur.d + 1;
      if (nd < (dist.get(nkey) ?? Infinity)) {
        dist.set(nkey, nd);
        push({ d: nd, r: nr, c: nc });
      }
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 093. 隐藏网格下的最小消耗路径 =====");
console.log("需要 GridMaster 接口才能测试");

export {};
