// LC2368. 受限条件下可到达节点的数目
// n 节点树 edges, restricted 不可访问, 从 0 出发可达节点数
// DFS / BFS 跳过受限

type EdgeList = number[][];

// 方法1: DFS 跳过受限
function reachableNodes1(n: number, edges: EdgeList, restricted: number[]): number {
  const blocked = new Set(restricted);
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  let cnt = 0;
  const visited = new Array(n).fill(false);
  function dfs(u: number): void {
    if (blocked.has(u)) return;
    visited[u] = true;
    cnt++;
    for (const v of adj[u]) {
      if (!visited[v]) dfs(v);
    }
  }
  dfs(0);
  return cnt;
}

// 方法2: BFS
function reachableNodes2(n: number, edges: EdgeList, restricted: number[]): number {
  const blocked = new Set(restricted);
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const visited = new Array(n).fill(false);
  visited[0] = true;
  const q: number[] = [0];
  let cnt = 0;
  while (q.length) {
    const u = q.shift()!;
    if (blocked.has(u)) continue;
    cnt++;
    for (const v of adj[u]) {
      if (!visited[v] && !blocked.has(v)) {
        visited[v] = true;
        q.push(v);
      }
    }
  }
  return cnt;
}

// 测试
function test(): void {
  console.log(
    reachableNodes1(
      7,
      [
        [0, 1],
        [1, 2],
        [3, 1],
        [4, 0],
        [0, 5],
        [5, 6],
      ],
      [4, 5],
    ),
  ); // 4
  console.log(
    reachableNodes1(
      7,
      [
        [0, 1],
        [0, 2],
        [0, 5],
        [0, 4],
        [3, 2],
        [6, 5],
      ],
      [4, 2, 1],
    ),
  ); // 3
  console.log(
    reachableNodes2(
      7,
      [
        [0, 1],
        [1, 2],
        [3, 1],
        [4, 0],
        [0, 5],
        [5, 6],
      ],
      [4, 5],
    ),
  ); // 4
  console.log(
    reachableNodes2(
      7,
      [
        [0, 1],
        [0, 2],
        [0, 5],
        [0, 4],
        [3, 2],
        [6, 5],
      ],
      [4, 2, 1],
    ),
  ); // 3
}
test();

export {};
