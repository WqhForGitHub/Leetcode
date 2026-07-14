// 130. 找到最近的标记节点
// 自定义. Closest Marked Node
// 题意：n 节点带权无向图 edges，marked 为标记集合，
//      求每个节点到最近标记节点的距离。
// 思路：多源 Dijkstra，将所有标记节点作为初始源同时入队。

type Edge = { to: number; cost: number };
type Item = { node: number; dist: number };

function closestMarkedNode(n: number, edges: number[][], marked: number[]): number[] {
  const adj: Edge[][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push({ to: v, cost: w });
    adj[v].push({ to: u, cost: w });
  }

  const dist: number[] = new Array(n).fill(Infinity);
  const isMarked: boolean[] = new Array(n).fill(false);
  for (const m of marked) isMarked[m] = true;

  const pq: Item[] = [];
  const push = (it: Item): void => {
    let i = pq.length;
    pq.push(it);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (pq[p].dist <= pq[i].dist) break;
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
        if (l < len && pq[l].dist < pq[sml].dist) sml = l;
        if (r < len && pq[r].dist < pq[sml].dist) sml = r;
        if (sml === i) break;
        [pq[sml], pq[i]] = [pq[i], pq[sml]];
        i = sml;
      }
    }
    return top;
  };

  // 多源初始化：标记节点自身距离为 0
  for (const m of marked) {
    dist[m] = 0;
    push({ node: m, dist: 0 });
  }

  while (pq.length > 0) {
    const { node, dist: d } = pop();
    if (d > dist[node]) continue;
    for (const e of adj[node]) {
      const nd = d + e.cost;
      if (nd < dist[e.to]) {
        dist[e.to] = nd;
        push({ node: e.to, dist: nd });
      }
    }
  }

  // 标记节点自身返回 0，无路径返回 -1
  return dist.map((d, i) => (isMarked[i] ? 0 : d === Infinity ? -1 : d));
}

function test(): void {
  const case1 = closestMarkedNode(
    5,
    [
      [0, 1, 2],
      [1, 2, 3],
      [2, 3, 1],
      [3, 4, 4],
      [0, 4, 10],
    ],
    [2, 4],
  );
  console.log(
    "case1:",
    case1,
    "expected:",
    [2, 3, 0, 1, 0],
    JSON.stringify(case1) === JSON.stringify([2, 3, 0, 1, 0]),
  );

  const case2 = closestMarkedNode(3, [[0, 1, 5]], [0]);
  console.log(
    "case2:",
    case2,
    "expected:",
    [0, 5, -1],
    JSON.stringify(case2) === JSON.stringify([0, 5, -1]),
  );
}

test();

export {};
