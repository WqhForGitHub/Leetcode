// 126. 前往目标的最小代价
// 自定义. Minimum Cost with Discounts
// 题意：n 城市带权边，最多 k 次打折（边权减半），start 到 end 最小代价。
// 思路：Dijkstra 状态 (节点, 剩余打折次数)。

type Edge = { to: number; cost: number };
type State = { node: number; rem: number; cost: number };

function minimumCostWithDiscounts(
  n: number,
  edges: number[][],
  start: number,
  end: number,
  k: number,
): number {
  const adj: Edge[][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push({ to: v, cost: w });
    adj[v].push({ to: u, cost: w });
  }

  // dist[node][rem]
  const dist: number[][] = Array.from({ length: n }, () => new Array(k + 1).fill(Infinity));
  dist[start][k] = 0;
  const pq: State[] = [{ node: start, rem: k, cost: 0 }];

  const push = (s: State): void => {
    let i = pq.length;
    pq.push(s);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (pq[p].cost <= pq[i].cost) break;
      [pq[p], pq[i]] = [pq[i], pq[p]];
      i = p;
    }
  };
  const pop = (): State => {
    const top = pq[0];
    const last = pq.pop()!;
    if (pq.length > 0) {
      pq[0] = last;
      let i = 0;
      const len = pq.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let sml = i;
        if (l < len && pq[l].cost < pq[sml].cost) sml = l;
        if (r < len && pq[r].cost < pq[sml].cost) sml = r;
        if (sml === i) break;
        [pq[sml], pq[i]] = [pq[i], pq[sml]];
        i = sml;
      }
    }
    return top;
  };

  while (pq.length > 0) {
    const { node, rem, cost } = pop();
    if (node === end) return cost;
    if (cost > dist[node][rem]) continue;
    for (const e of adj[node]) {
      // 不打折
      if (cost + e.cost < dist[e.to][rem]) {
        dist[e.to][rem] = cost + e.cost;
        push({ node: e.to, rem, cost: cost + e.cost });
      }
      // 打折
      if (rem > 0) {
        const half = Math.floor(e.cost / 2);
        if (cost + half < dist[e.to][rem - 1]) {
          dist[e.to][rem - 1] = cost + half;
          push({ node: e.to, rem: rem - 1, cost: cost + half });
        }
      }
    }
  }

  let ans = Infinity;
  for (let r = 0; r <= k; r++) ans = Math.min(ans, dist[end][r]);
  return ans === Infinity ? -1 : ans;
}

function test(): void {
  const case1 = minimumCostWithDiscounts(
    4,
    [
      [0, 1, 4],
      [1, 2, 6],
      [2, 3, 8],
      [0, 3, 20],
    ],
    0,
    3,
    1,
  );
  console.log("case1:", case1, "expected:", 14, case1 === 14);

  const case2 = minimumCostWithDiscounts(
    3,
    [
      [0, 1, 10],
      [1, 2, 10],
    ],
    0,
    2,
    2,
  );
  console.log("case2:", case2, "expected:", 10, case2 === 10);
}

test();

export {};
