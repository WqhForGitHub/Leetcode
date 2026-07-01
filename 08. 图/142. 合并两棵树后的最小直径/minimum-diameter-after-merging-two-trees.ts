// 142. 合并两棵树后的最小直径 (LC3203)
// 两棵树各选一个节点连一条边，求合并后新树的最小直径。
// 思路：求每棵树各节点到其最远节点的距离（即该节点作为根时的树高）。
// 合并后直径 = max(直径1, 直径2, maxDist1[i] + 1 + maxDist2[j])。
// 枚举连接点对，最小化上式。对每棵树只需取最小的 maxDist 作为连接点。

function treeDiameter(n: number, edges: number[][]): number {
  if (n <= 1) return 0;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  // 两次 BFS 求直径
  const bfs = (src: number): [number, number[]] => {
    const dist: number[] = new Array(n).fill(-1);
    dist[src] = 0;
    const q: number[] = [src];
    let far = src;
    while (q.length > 0) {
      const u = q.shift()!;
      for (const v of adj[u]) {
        if (dist[v] === -1) {
          dist[v] = dist[u] + 1;
          q.push(v);
          if (dist[v] > dist[far]) far = v;
        }
      }
    }
    return [far, dist];
  };
  const [far1] = bfs(0);
  const [, dist] = bfs(far1);
  return Math.max(...dist);
}

function maxDistFromEachNode(n: number, edges: number[][]): number[] {
  // 每个节点到其最远节点的距离（树高/偏心距）
  if (n === 0) return [];
  if (n === 1) return [0];
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  // 求直径端点
  const bfs = (src: number): [number, number[]] => {
    const dist: number[] = new Array(n).fill(-1);
    dist[src] = 0;
    const q: number[] = [src];
    let far = src;
    while (q.length > 0) {
      const u = q.shift()!;
      for (const v of adj[u]) {
        if (dist[v] === -1) {
          dist[v] = dist[u] + 1;
          q.push(v);
          if (dist[v] > dist[far]) far = v;
        }
      }
    }
    return [far, dist];
  };
  const [far1] = bfs(0);
  const [far2, dist1] = bfs(far1);
  const [, dist2] = bfs(far2);
  // 每个节点偏心距 = max(dist1[i], dist2[i])
  const ecc: number[] = new Array(n);
  for (let i = 0; i < n; i++) ecc[i] = Math.max(dist1[i], dist2[i]);
  return ecc;
}

function minimumDiameterAfterMergingTwoTrees(edges1: number[][], edges2: number[][]): number {
  const n1 = edges1.length + 1;
  const n2 = edges2.length + 1;
  const d1 = treeDiameter(n1, edges1);
  const d2 = treeDiameter(n2, edges2);
  const ecc1 = maxDistFromEachNode(n1, edges1);
  const ecc2 = maxDistFromEachNode(n2, edges2);
  // 最小化 ecc1[i] + 1 + ecc2[j]，分别取最小
  const minE1 = Math.min(...ecc1);
  const minE2 = Math.min(...ecc2);
  return Math.max(d1, d2, minE1 + 1 + minE2);
}

function minimumDiameterAfterMergingTwoTreesMethod2(
  edges1: number[][],
  edges2: number[][],
): number {
  // 方法2：直接利用性质：合并后最优连接点是各自树的"中心"，
  // 中心偏心距 = ceil(直径 / 2)
  const n1 = edges1.length + 1;
  const n2 = edges2.length + 1;
  const d1 = treeDiameter(n1, edges1);
  const d2 = treeDiameter(n2, edges2);
  const c1 = Math.ceil(d1 / 2);
  const c2 = Math.ceil(d2 / 2);
  return Math.max(d1, d2, c1 + 1 + c2);
}

// 测试
(() => {
  console.log(
    minimumDiameterAfterMergingTwoTrees(
      [
        [0, 1],
        [0, 2],
        [0, 3],
      ],
      [[0, 1]],
    ),
  ); // 3
  console.log(
    minimumDiameterAfterMergingTwoTrees(
      [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
      [
        [0, 1],
        [1, 2],
      ],
    ),
  ); // 4
})();

export {};
