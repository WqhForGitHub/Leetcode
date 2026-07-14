// 177. 查找树的直径端点
// 自定义题：n 节点树，返回直径的两个端点。
// 思路：两次 BFS，先从任意点找最远点，再从该点找最远点。

type TreeEdge = [number, number];

function bfsFurthest(n: number, adj: number[][], start: number): [number, number] {
  const dist = new Array(n).fill(-1);
  dist[start] = 0;
  const queue: number[] = [start];
  let furthest = start;
  for (let i = 0; i < queue.length; i++) {
    const u = queue[i];
    for (const v of adj[u]) {
      if (dist[v] === -1) {
        dist[v] = dist[u] + 1;
        queue.push(v);
        if (dist[v] > dist[furthest]) furthest = v;
      }
    }
  }
  return [furthest, dist[furthest]];
}

function findDiameterEndpointsOfTree(n: number, edges: TreeEdge[]): [number, number] {
  if (n === 0) return [-1, -1];
  if (n === 1) return [0, 0];
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const [far1] = bfsFurthest(n, adj, 0);
  const [far2] = bfsFurthest(n, adj, far1);
  return [far1, far2];
}

// 测试
console.log(
  findDiameterEndpointsOfTree(5, [
    [0, 1],
    [1, 2],
    [1, 3],
    [3, 4],
  ]),
); // 期望 [4, 0]
console.log(findDiameterEndpointsOfTree(1, [])); // 期望 [0, 0]
console.log(findDiameterEndpointsOfTree(2, [[0, 1]])); // 期望 [1, 0]

export {};
