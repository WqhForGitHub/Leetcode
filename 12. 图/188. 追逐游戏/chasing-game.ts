// 188. 追逐游戏
// 自定义题：n 节点图，追逃双方轮流移动，求追上最少回合；逃不掉返回 -1。
// 思路：BFS 预处理追者到各点最短路 + 博弈（minimax + 记忆化）。
//       每回合：追者先动（可停留），若与逃者同点则捕获；否则逃者动（可停留），
//       逃者最大化回合、追者最小化回合。深度超阈值视为逃者可无限逃避返回 -1。

class ChasingGame {
  private n: number;
  private adj: number[][];
  private memo: Map<string, number>;
  private cap: number;

  constructor(n: number, edges: [number, number][]) {
    this.n = n;
    this.adj = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      this.adj[u].push(v);
      this.adj[v].push(u);
    }
    this.memo = new Map();
    this.cap = 4 * n * n + 10;
  }

  // 主方法：追者在 chaser、逃者在 runner，返回追上最少回合，逃不掉返回 -1
  public minRounds(chaser: number, runner: number): number {
    this.memo.clear();
    const res = this.solve(chaser, runner, 0);
    return res === Number.POSITIVE_INFINITY ? -1 : res;
  }

  // 辅助方法：minimax 求解；turn 0=追者动, 1=逃者动
  private solve(c: number, r: number, depth: number): number {
    if (c === r) return 0;
    if (depth > this.cap) return Number.POSITIVE_INFINITY;
    const key = `${c},${r}`;
    if (this.memo.has(key)) return this.memo.get(key)!;

    // 防止递归栈上的循环：临时标记为大值，最终回填
    this.memo.set(key, Number.POSITIVE_INFINITY);

    // 追者回合：选择自身或邻居，最小化
    let best = Number.POSITIVE_INFINITY;
    const cOpts = [c, ...this.adj[c]];
    for (const nc of cOpts) {
      if (nc === r) {
        best = 0; // 追者一步捕获
        break;
      }
      // 逃者回合：选择自身或邻居，最大化
      let worst: number;
      const rOpts = [r, ...this.adj[r]];
      let escape = false;
      let runMax = -1;
      for (const nr of rOpts) {
        if (nr === nc) continue; // 逃者不会自投罗网
        const sub = this.solve(nc, nr, depth + 1);
        if (sub > runMax) runMax = sub;
      }
      if (rOpts.every((nr) => nr === nc)) {
        // 逃者无路可走（只能撞上追者）-> 被捕获
        worst = 0;
      } else {
        worst = runMax;
      }
      if (worst === Number.POSITIVE_INFINITY) {
        escape = true;
      }
      const cand = worst === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : 1 + worst;
      if (cand < best) best = cand;
      void escape;
    }

    this.memo.set(key, best);
    return best;
  }
}

// 测试
(() => {
  // 样例：链 0-1-2-3，追者在 0，逃者在 2
  // 追者逼近，逃者向 3 退，到端点后被捕获
  const sol1 = new ChasingGame(4, [
    [0, 1],
    [1, 2],
    [2, 3],
  ]);
  console.log("Test1:", sol1.minRounds(0, 2));

  // 样例：环 0-1-2-3-0，追者 0 逃者 2，环上逃者可一直保持距离 -> -1
  const sol2 = new ChasingGame(4, [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ]);
  console.log("Test2:", sol2.minRounds(0, 2));

  // 样例：同点立即捕获
  const sol3 = new ChasingGame(3, [
    [0, 1],
    [1, 2],
  ]);
  console.log("Test3:", sol3.minRounds(1, 1)); // 0
})();

export {};
