// 183. 最多 K 个连续相同字符的最短路径
// 自定义题：n 节点图带 labels，从 start 到 end，路径中连续相同字符 <= k 的最短长度。
// 思路：BFS，状态 = (节点, 当前字符, 当前连续相同字符数)。
//       转移到邻居时若标签相同则连续数+1（须<=k），否则连续数重置为 1。
//       边权为 1，首次到达 end 即最短。

interface State {
  node: number;
  ch: string;
  cnt: number;
}

class ShortestPathWithAtMostKConsecutiveSameChars {
  private n: number;
  private adj: number[][];
  private labels: string[];
  private k: number;

  constructor(n: number, edges: [number, number][], labels: string[], k: number) {
    this.n = n;
    this.labels = labels;
    this.k = k;
    this.adj = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      this.adj[u].push(v);
      this.adj[v].push(u);
    }
  }

  // 主方法：返回 start->end 满足约束的最短边数，不可达返回 -1
  public shortestPath(start: number, end: number): number {
    if (start === end) return 0;
    const visited = new Set<string>();
    const queue: State[] = [];
    const startCh = this.labels[start];
    queue.push({ node: start, ch: startCh, cnt: 1 });
    visited.add(`${start},${startCh},1`);
    let dist = 0;
    while (queue.length > 0) {
      dist++;
      const size = queue.length;
      for (let i = 0; i < size; i++) {
        const cur = queue.shift()!;
        for (const v of this.adj[cur.node]) {
          const vCh = this.labels[v];
          let cnt: number;
          if (vCh === cur.ch) {
            cnt = cur.cnt + 1;
          } else {
            cnt = 1;
          }
          if (cnt > this.k) continue;
          const key = `${v},${vCh},${cnt}`;
          if (visited.has(key)) continue;
          if (v === end) return dist;
          visited.add(key);
          queue.push({ node: v, ch: vCh, cnt });
        }
      }
    }
    return -1;
  }

  // 辅助方法：构造状态键（供外部/调试使用）
  public stateKey(node: number, ch: string, cnt: number): string {
    return `${node},${ch},${cnt}`;
  }
}

// 测试
(() => {
  // 样例：链 0(a)-1(a)-2(a)-3(b)，k=2，求 0->3
  // 0->1->2 连续 a 已达 2，到 3(b) 重置为 1，长度 3
  const sol1 = new ShortestPathWithAtMostKConsecutiveSameChars(
    4,
    [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    ["a", "a", "a", "b"],
    2,
  );
  console.log("Test1:", sol1.shortestPath(0, 3)); // 3

  // 样例：k=1，连续相同最多 1，链 a-a-a-b 从 0 不可走第二条 a，0->3 不可达
  const sol2 = new ShortestPathWithAtMostKConsecutiveSameChars(
    4,
    [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    ["a", "a", "a", "b"],
    1,
  );
  console.log("Test2:", sol2.shortestPath(0, 3)); // -1

  // 样例：环 a-b-a-b，k=1，0->2
  const sol3 = new ShortestPathWithAtMostKConsecutiveSameChars(
    4,
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ],
    ["a", "b", "a", "b"],
    1,
  );
  console.log("Test3:", sol3.shortestPath(0, 2)); // 2
})();

export {};
