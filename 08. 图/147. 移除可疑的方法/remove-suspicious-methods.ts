// 147. 移除可疑的方法 (自定义)
// n 个方法构成有向调用图 edges，k 为可疑入口方法。
// k 及所有从 k 可达的方法均标记为可疑。返回可疑方法索引升序列表。
// 思路：从 k 出发 DFS/BFS 标记所有可达节点。

function buildAdjList(n: number, edges: number[][]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) adj[u].push(v);
  return adj;
}

function removeSuspiciousMethods(n: number, edges: number[][], k: number): number[] {
  const adj = buildAdjList(n, edges);
  const visited: boolean[] = new Array(n).fill(false);
  const stack: number[] = [k];
  visited[k] = true;
  while (stack.length > 0) {
    const u = stack.pop()!;
    for (const v of adj[u]) {
      if (!visited[v]) {
        visited[v] = true;
        stack.push(v);
      }
    }
  }
  const res: number[] = [];
  for (let i = 0; i < n; i++) if (visited[i]) res.push(i);
  res.sort((a, b) => a - b);
  return res;
}

function removeSuspiciousMethodsMethod2(n: number, edges: number[][], k: number): number[] {
  // 方法2：BFS 实现
  const adj = buildAdjList(n, edges);
  const visited: boolean[] = new Array(n).fill(false);
  const q: number[] = [k];
  visited[k] = true;
  let head = 0;
  while (head < q.length) {
    const u = q[head++];
    for (const v of adj[u]) {
      if (!visited[v]) {
        visited[v] = true;
        q.push(v);
      }
    }
  }
  const res: number[] = [];
  for (let i = 0; i < n; i++) if (visited[i]) res.push(i);
  return res; // BFS 顺序天然升序生成（按 i 遍历）
}

// 测试
(() => {
  // 0 -> 1, 1 -> 2, 3 -> 4，k=0 => [0,1,2]
  console.log(
    removeSuspiciousMethods(
      5,
      [
        [0, 1],
        [1, 2],
        [3, 4],
      ],
      0,
    ),
  );
  console.log(
    removeSuspiciousMethods(
      5,
      [
        [0, 1],
        [1, 2],
        [3, 4],
      ],
      3,
    ),
  ); // [3,4]
  console.log(removeSuspiciousMethods(3, [], 1)); // [1]
  // 含环
  console.log(
    removeSuspiciousMethods(
      4,
      [
        [0, 1],
        [1, 2],
        [2, 0],
        [2, 3],
      ],
      0,
    ),
  ); // [0,1,2,3]
})();

export {};
