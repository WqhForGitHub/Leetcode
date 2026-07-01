// ============================================================
// 045. 查找集群内的关键连接
// ============================================================
// LeetCode 1192. Critical Connections in a Network
// n 个服务器无向连接 connections，返回所有关键连接（桥）。
// 方法：Tarjan 求桥（dfn 时间戳 / low 最早回溯）。
// 时间复杂度：O(V+E)，空间复杂度：O(V+E)

// 方法1：Tarjan 求桥（迭代版，推荐避免栈溢出）
function criticalConnections(n: number, connections: number[][]): number[][] {
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of connections) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const dfn: number[] = new Array(n).fill(0); // 发现时间
  const low: number[] = new Array(n).fill(0); // 最早能回溯到的时间
  let timer = 0;
  const result: number[][] = [];

  // 迭代 DFS 栈帧：[节点, 父节点, 子节点遍历索引]
  const dfs = (start: number): void => {
    const stack: Array<[number, number, number]> = [[start, -1, 0]];
    while (stack.length > 0) {
      const [u, parent, idx] = stack[stack.length - 1];
      if (idx === 0) {
        // 首次访问 u
        timer++;
        dfn[u] = low[u] = timer;
      }
      if (idx < graph[u].length) {
        stack[stack.length - 1][2]++;
        const v = graph[u][idx];
        if (v === parent) continue;
        if (dfn[v] === 0) {
          stack.push([v, u, 0]);
        } else {
          low[u] = Math.min(low[u], dfn[v]);
        }
      } else {
        // u 的子节点遍历完，回溯
        stack.pop();
        if (parent !== -1) {
          low[parent] = Math.min(low[parent], low[u]);
          // 桥的判定：子节点的 low 严格大于父节点 dfn
          if (low[u] > dfn[parent]) {
            result.push([parent, u]);
          }
        }
      }
    }
  };

  for (let i = 0; i < n; i++) {
    if (dfn[i] === 0) dfs(i);
  }
  return result;
}

// 方法2：Tarjan 求桥（递归版，简洁但深层图可能栈溢出）
function criticalConnectionsRecursive(n: number, connections: number[][]): number[][] {
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of connections) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const dfn: number[] = new Array(n).fill(0);
  const low: number[] = new Array(n).fill(0);
  let timer = 0;
  const result: number[][] = [];

  const dfs = (u: number, parent: number): void => {
    timer++;
    dfn[u] = low[u] = timer;
    for (const v of graph[u]) {
      if (v === parent) continue;
      if (dfn[v] === 0) {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > dfn[u]) {
          result.push([u, v]);
        }
      } else {
        low[u] = Math.min(low[u], dfn[v]);
      }
    }
  };

  for (let i = 0; i < n; i++) {
    if (dfn[i] === 0) dfs(i, -1);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 045. 查找集群内的关键连接 =====");
console.log(
  "迭代 Tarjan:",
  JSON.stringify(
    criticalConnections(4, [
      [0, 1],
      [1, 2],
      [2, 0],
      [1, 3],
    ]),
  ),
); // 期望 [[1,3]]
console.log(
  "递归 Tarjan:",
  JSON.stringify(
    criticalConnectionsRecursive(4, [
      [0, 1],
      [1, 2],
      [2, 0],
      [1, 3],
    ]),
  ),
); // 期望 [[1,3]]
console.log("迭代 Tarjan 全桥:", JSON.stringify(criticalConnections(2, [[0, 1]]))); // 期望 [[0,1]]

export {};
