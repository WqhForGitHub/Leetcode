// ============================================================
// 064. 奇怪的打印机 II
// ============================================================
// LeetCode 1591. Strange Printer II
// targetGrid 整数矩阵，每种颜色是一次打印的矩形。判断能否通过若干次矩形打印得到。
// 等价于：每种颜色矩形区域内出现的其他颜色必须在该颜色之后打印，建拓扑图判断是否有环。
// 时间复杂度：O(m * n * c)，空间复杂度：O(c^2)

// ============================================================
// 方法1：拓扑排序检测环（推荐）
// ============================================================
function isPrintable1(targetGrid: number[][]): boolean {
  const m = targetGrid.length;
  const n = targetGrid[0].length;

  // 收集所有颜色及其矩形边界
  const colorSet = new Set<number>();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      colorSet.add(targetGrid[i][j]);
    }
  }
  const colors = Array.from(colorSet);
  const minR = new Map<number, number>();
  const maxR = new Map<number, number>();
  const minC = new Map<number, number>();
  const maxC = new Map<number, number>();
  for (const c of colors) {
    minR.set(c, m);
    maxR.set(c, -1);
    minC.set(c, n);
    maxC.set(c, -1);
  }
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const c = targetGrid[i][j];
      minR.set(c, Math.min(minR.get(c)!, i));
      maxR.set(c, Math.max(maxR.get(c)!, i));
      minC.set(c, Math.min(minC.get(c)!, j));
      maxC.set(c, Math.max(maxC.get(c)!, j));
    }
  }

  // 建图：颜色 A 矩形内出现颜色 B，则 A 必须在 B 之前打印（A -> B，A 先于 B）
  const adj = new Map<number, Set<number>>();
  const inDegree = new Map<number, number>();
  for (const c of colors) {
    adj.set(c, new Set());
    inDegree.set(c, 0);
  }
  for (const a of colors) {
    const r1 = minR.get(a)!;
    const r2 = maxR.get(a)!;
    const c1 = minC.get(a)!;
    const c2 = maxC.get(a)!;
    for (let i = r1; i <= r2; i++) {
      for (let j = c1; j <= c2; j++) {
        const b = targetGrid[i][j];
        if (b !== a && !adj.get(a)!.has(b)) {
          adj.get(a)!.add(b);
          inDegree.set(b, inDegree.get(b)! + 1);
        }
      }
    }
  }

  // 拓扑排序（Kahn），若能处理完所有节点则无环
  const queue: number[] = [];
  for (const [c, d] of inDegree) {
    if (d === 0) queue.push(c);
  }
  let processed = 0;
  while (queue.length > 0) {
    const u = queue.shift()!;
    processed++;
    for (const v of adj.get(u)!) {
      inDegree.set(v, inDegree.get(v)! - 1);
      if (inDegree.get(v) === 0) queue.push(v);
    }
  }
  return processed === colors.length;
}

// ============================================================
// 方法2：DFS 检测环（三色标记法）
// ============================================================
function isPrintable2(targetGrid: number[][]): boolean {
  const m = targetGrid.length;
  const n = targetGrid[0].length;

  const colorSet = new Set<number>();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) colorSet.add(targetGrid[i][j]);
  }
  const colors = Array.from(colorSet);
  const minR = new Map<number, number>();
  const maxR = new Map<number, number>();
  const minC = new Map<number, number>();
  const maxC = new Map<number, number>();
  for (const c of colors) {
    minR.set(c, m);
    maxR.set(c, -1);
    minC.set(c, n);
    maxC.set(c, -1);
  }
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const c = targetGrid[i][j];
      minR.set(c, Math.min(minR.get(c)!, i));
      maxR.set(c, Math.max(maxR.get(c)!, i));
      minC.set(c, Math.min(minC.get(c)!, j));
      maxC.set(c, Math.max(maxC.get(c)!, j));
    }
  }

  const adj = new Map<number, Set<number>>();
  for (const c of colors) adj.set(c, new Set());
  for (const a of colors) {
    for (let i = minR.get(a)!; i <= maxR.get(a)!; i++) {
      for (let j = minC.get(a)!; j <= maxC.get(a)!; j++) {
        const b = targetGrid[i][j];
        if (b !== a) adj.get(a)!.add(b);
      }
    }
  }

  // 0=未访问, 1=访问中, 2=已完成
  const state = new Map<number, number>();
  for (const c of colors) state.set(c, 0);

  const dfs = (u: number): boolean => {
    state.set(u, 1);
    for (const v of adj.get(u)!) {
      if (state.get(v) === 1) return false; // 发现环
      if (state.get(v) === 0 && !dfs(v)) return false;
    }
    state.set(u, 2);
    return true;
  };

  for (const c of colors) {
    if (state.get(c) === 0 && !dfs(c)) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 064. 奇怪的打印机 II =====");
console.log(
  isPrintable1([
    [1, 1, 1, 1],
    [1, 2, 2, 1],
    [1, 2, 2, 1],
    [1, 1, 1, 1],
  ]),
);
// 期望: true
console.log(
  isPrintable1([
    [1, 2, 1],
    [2, 1, 2],
    [1, 2, 1],
  ]),
);
// 期望: false
console.log(
  isPrintable2([
    [1, 1, 1, 1],
    [1, 2, 2, 1],
    [1, 2, 2, 1],
    [1, 1, 1, 1],
  ]),
);
// 期望: true

export {};
