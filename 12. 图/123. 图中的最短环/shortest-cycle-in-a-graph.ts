// 123. 图中的最短环
// LC2608. Shortest Cycle in a Graph
// 题意：n 节点无向图 edges，求最短环长度；无环返回 -1。
// 思路：对每个点 BFS 找最短环，取最小。

function findShortestCycle(n: number, edges: number[][]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  let ans = Infinity;
  for (let s = 0; s < n; s++) {
    const dist: number[] = new Array(n).fill(-1);
    const parent: number[] = new Array(n).fill(-1);
    const queue: number[] = [s];
    dist[s] = 0;
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++];
      for (const v of adj[u]) {
        if (dist[v] === -1) {
          dist[v] = dist[u] + 1;
          parent[v] = u;
          queue.push(v);
        } else if (parent[u] !== v) {
          // 找到环：dist[u] + dist[v] + 1
          ans = Math.min(ans, dist[u] + dist[v] + 1);
        }
      }
    }
  }
  return ans === Infinity ? -1 : ans;
}

function test(): void {
  const case1 = findShortestCycle(7, [
    [0, 1],
    [1, 2],
    [2, 0],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 3],
  ]);
  console.log("case1:", case1, "expected:", 3, case1 === 3);

  const case2 = findShortestCycle(4, [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ]);
  console.log("case2:", case2, "expected:", 4, case2 === 4);

  const case3 = findShortestCycle(4, [
    [0, 1],
    [1, 2],
    [2, 3],
  ]);
  console.log("case3:", case3, "expected:", -1, case3 === -1);
}

test();

export {};
