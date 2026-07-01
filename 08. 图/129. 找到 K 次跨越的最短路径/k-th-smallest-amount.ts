// 129. 找到 K 次跨越的最短路径
// 自定义. K-th Smallest Amount (K-shortest path length)
// 题意：n 节点带权图，start 到 end 第 k 短路径长度（允许重复边/节点）。
// 思路：Dijkstra 变体，对每个节点维护已确定的到达次数计数，
//      弹出第 k 次到 end 的距离即为答案。

type Edge = { to: number; cost: number };
type Item = { node: number; cost: number };

function kthSmallestAmount(
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

  const pq: Item[] = [{ node: start, cost: 0 }];
  const count: number[] = new Array(n).fill(0);

  const push = (it: Item): void => {
    let i = pq.length;
    pq.push(it);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (pq[p].cost <= pq[i].cost) break;
      [pq[p], pq[i]] = [pq[i], pq[p]];
      i = p;
    }
  };
  const pop = (): Item => {
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
    const { node, cost } = pop();
    if (count[node] >= k) continue;
    count[node]++;
    if (node === end && count[node] === k) {
      return cost;
    }
    if (count[node] > k) continue;
    for (const e of adj[node]) {
      if (count[e.to] < k) {
        push({ node: e.to, cost: cost + e.cost });
      }
    }
  }
  return -1;
}

function test(): void {
  const case1 = kthSmallestAmount(
    4,
    [
      [0, 1, 1],
      [1, 3, 1],
      [0, 2, 2],
      [2, 3, 1],
      [0, 3, 5],
    ],
    0,
    3,
    2,
  );
  console.log("case1:", case1, "expected:", 3, case1 === 3);

  const case2 = kthSmallestAmount(
    3,
    [
      [0, 1, 1],
      [1, 2, 1],
      [0, 2, 3],
    ],
    0,
    2,
    3,
  );
  console.log("case2:", case2, "expected:", 5, case2 === 5);
}

test();

export {};
