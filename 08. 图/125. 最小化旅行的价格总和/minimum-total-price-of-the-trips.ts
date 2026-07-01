// 125. 最小化旅行的价格总和
// LC2647. Minimum Total Price of the Trips
// 题意：n 节点树 price，trips = [start, end]，可对不相邻节点价格减半，
//      求所有 trips 路径价格总和的最小值。
// 思路：DFS 统计每个节点经过次数 + 树形 DP（节点减半/不减半取最小）。

type TreeNode = { to: number };

function minimumTotalPrice(
  n: number,
  edges: number[][],
  price: number[],
  trips: number[][],
): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const cnt: number[] = new Array(n).fill(0);
  const parent: number[] = new Array(n).fill(-1);

  const findPath = (start: number, end: number): void => {
    const visited: boolean[] = new Array(n).fill(false);
    const par: number[] = new Array(n).fill(-1);
    const stack: number[] = [start];
    visited[start] = true;
    while (stack.length > 0) {
      const u = stack.pop()!;
      if (u === end) break;
      for (const v of adj[u]) {
        if (!visited[v]) {
          visited[v] = true;
          par[v] = u;
          stack.push(v);
        }
      }
    }
    let cur = end;
    while (cur !== -1) {
      cnt[cur]++;
      cur = par[cur];
    }
  };

  for (const [s, e] of trips) findPath(s, e);

  // 树形 DP：dp[u][0] 不减半，dp[u][1] 减半
  const dfs = (u: number, p: number): [number, number] => {
    let noHalve = price[u] * cnt[u];
    let halve = (price[u] / 2) * cnt[u];
    for (const v of adj[u]) {
      if (v === p) continue;
      const [childNo, childYes] = dfs(v, u);
      // u 不减半，子节点可减半/不减半取小
      noHalve += Math.min(childNo, childYes);
      // u 减半，子节点必须不减半
      halve += childNo;
    }
    return [noHalve, halve];
  };

  const [a, b] = dfs(0, -1);
  return Math.min(a, b);
}

function test(): void {
  const case1 = minimumTotalPrice(
    4,
    [
      [0, 1],
      [1, 2],
      [1, 3],
    ],
    [2, 2, 1, 3],
    [
      [1, 3],
      [0, 2],
      [1, 2],
    ],
  );
  console.log("case1:", case1, "expected:", 4, case1 === 4);
}

test();

export {};
