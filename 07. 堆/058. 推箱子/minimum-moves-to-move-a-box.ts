// ============================================================
// 058. 推箱子
// ============================================================
// LeetCode 1263. Minimum Moves to Move a Box to Their Target Location
// 网格中玩家推箱子到目标点，求最少推动次数。
// 时间复杂度：O(mn * mn log(mn))，空间复杂度：O(mn * mn)

// 方法1：Dijkstra + BFS（推荐）
function minPushBox(grid: char[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  let boxR = 0,
    boxC = 0;
  let tarR = 0,
    tarC = 0;
  let plR = 0,
    plC = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === "B") {
        boxR = r;
        boxC = c;
      } else if (grid[r][c] === "T") {
        tarR = r;
        tarC = c;
      } else if (grid[r][c] === "S") {
        plR = r;
        plC = c;
      }
    }
  }
  type State = string;
  const key = (br: number, bc: number, pr: number, pc: number): State => `${br},${bc},${pr},${pc}`;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const visited: Set<State> = new Set();
  const canReach = (
    sr: number,
    sc: number,
    tr: number,
    tc: number,
    br: number,
    bc: number,
  ): boolean => {
    const seen: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
    const queue: Array<[number, number]> = [[sr, sc]];
    seen[sr][sc] = true;
    let head = 0;
    while (head < queue.length) {
      const [r, c] = queue[head++];
      if (r === tr && c === tc) return true;
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
        if (seen[nr][nc]) continue;
        if (grid[nr][nc] === "#") continue;
        if (nr === br && nc === bc) continue;
        seen[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
    return false;
  };
  // Dijkstra
  const heap: Array<{ d: number; br: number; bc: number; pr: number; pc: number }> = [];
  const push = (v: { d: number; br: number; bc: number; pr: number; pc: number }): void => {
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
  const pop = (): { d: number; br: number; bc: number; pr: number; pc: number } | undefined => {
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
  push({ d: 0, br: boxR, bc: boxC, pr: plR, pc: plC });
  while (heap.length > 0) {
    const cur = pop()!;
    const k = key(cur.br, cur.bc, cur.pr, cur.pc);
    if (visited.has(k)) continue;
    visited.add(k);
    if (cur.br === tarR && cur.bc === tarC) return cur.d;
    for (const [dr, dc] of dirs) {
      const npr = cur.br - dr; // 玩家推箱子的位置
      const npc = cur.bc - dc;
      if (npr < 0 || npr >= m || npc < 0 || npc >= n) continue;
      if (grid[npr][npc] === "#") continue;
      if (!canReach(cur.pr, cur.pc, npr, npc, cur.br, cur.bc)) continue;
      const nbr = cur.br + dr;
      const nbc = cur.bc + dc;
      if (nbr < 0 || nbr >= m || nbc < 0 || nbc >= n || grid[nbr][nbc] === "#") continue;
      push({ d: cur.d + 1, br: nbr, bc: nbc, pr: cur.br, pc: cur.bc });
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 058. 推箱子 =====");
console.log(
  "推动次数:",
  minPushBox([
    ["#", "#", "#", "#", "#", "#"],
    ["#", "T", "#", "#", "#", "#"],
    ["#", ".", ".", "B", ".", "#"],
    ["#", ".", "#", "#", ".", "#"],
    ["#", ".", ".", ".", "S", "#"],
    ["#", "#", "#", "#", "#", "#"],
  ] as unknown as string[][]),
); // 期望 3

export {};
