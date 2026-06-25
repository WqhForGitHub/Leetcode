// ============================================================
// 图面试题 - TypeScript 解题合集
// 主题：DFS / BFS / 克隆图 / 课程表 / 二分图 / 最小生成树 /
//       最短路径 / 拓扑排序 / 环检测 / 关键连接 / 负权回路
// ============================================================

// ============================================================
// 涉及的核心数据结构：
//   - 图（邻接表）
//   - 并查集 (Union-Find)
// ============================================================

// -------------------- 图节点定义（用于克隆图） --------------------
export class GraphNode {
  val: number;
  neighbors: GraphNode[];
  constructor(val?: number, neighbors?: GraphNode[]) {
    this.val = val === undefined ? 0 : val;
    this.neighbors = neighbors === undefined ? [] : neighbors;
  }
}

// -------------------- 并查集 --------------------
export class UnionFind {
  parent: number[];
  rank: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // 路径压缩
    }
    return this.parent[x];
  }
  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false; // 已经在同一集合
    // 按秩合并
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }
}

// ============================================================
// 1. 图的深度优先搜索
// ============================================================
// DFS 使用栈（递归调用栈或显式栈）遍历图，优先深入访问
// 时间复杂度：O(V + E)，空间复杂度：O(V)

// 方法1：递归 DFS（推荐）
function graphDFS(adjList: number[][], start: number): number[] {
  const visited = new Set<number>();
  const result: number[] = [];

  function dfs(node: number): void {
    visited.add(node);
    result.push(node);
    for (const neighbor of adjList[node]) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }

  dfs(start);
  return result;
}

// 方法2：迭代 DFS（显式栈）
function graphDFSIterative(adjList: number[][], start: number): number[] {
  const visited = new Set<number>();
  const result: number[] = [];
  const stack: number[] = [start];
  visited.add(start);

  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node);
    // 逆序入栈，保证访问顺序与递归一致
    for (let i = adjList[node].length - 1; i >= 0; i--) {
      const neighbor = adjList[node][i];
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }
  }

  return result;
}

// ============================================================
// 2. 图的广度优先搜索
// ============================================================
// BFS 使用队列逐层遍历图，优先访问距离起点近的节点
// 时间复杂度：O(V + E)，空间复杂度：O(V)

// 方法1：队列 BFS（推荐）
function graphBFS(adjList: number[][], start: number): number[] {
  const visited = new Set<number>();
  const result: number[] = [];
  const queue: number[] = [start];
  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    for (const neighbor of adjList[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return result;
}

// 方法2：带层级的 BFS（可获取每层节点）
function graphBFSByLevel(adjList: number[][], start: number): number[][] {
  const visited = new Set<number>();
  const result: number[][] = [];
  const queue: number[] = [start];
  visited.add(start);

  while (queue.length > 0) {
    const levelSize = queue.length;
    const level: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node);
      for (const neighbor of adjList[node]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    result.push(level);
  }

  return result;
}

// ============================================================
// 3. 克隆图
// LeetCode 133. Clone Graph
// ============================================================
// 深拷贝一个无向图，需要维护原图节点到新节点的映射
// 时间复杂度：O(V + E)，空间复杂度：O(V)

// 方法1：DFS 递归（推荐）
function cloneGraph(node: GraphNode | null): GraphNode | null {
  if (!node) return null;
  const visited = new Map<GraphNode, GraphNode>();

  function dfs(curr: GraphNode): GraphNode {
    if (visited.has(curr)) return visited.get(curr)!;
    const clone = new GraphNode(curr.val);
    visited.set(curr, clone);
    for (const neighbor of curr.neighbors) {
      clone.neighbors.push(dfs(neighbor));
    }
    return clone;
  }

  return dfs(node);
}

// 方法2：BFS 迭代
function cloneGraphBFS(node: GraphNode | null): GraphNode | null {
  if (!node) return null;
  const visited = new Map<GraphNode, GraphNode>();
  const queue: GraphNode[] = [node];
  visited.set(node, new GraphNode(node.val));

  while (queue.length > 0) {
    const curr = queue.shift()!;
    for (const neighbor of curr.neighbors) {
      if (!visited.has(neighbor)) {
        visited.set(neighbor, new GraphNode(neighbor.val));
        queue.push(neighbor);
      }
      visited.get(curr)!.neighbors.push(visited.get(neighbor)!);
    }
  }

  return visited.get(node)!;
}

// ============================================================
// 4. 课程表
// LeetCode 207. Course Schedule
// ============================================================
// 判断能否完成所有课程，等价于判断有向图中是否存在环
// 时间复杂度：O(V + E)，空间复杂度：O(V + E)

// 方法1：拓扑排序 - BFS（推荐）
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  // 构建邻接表和入度数组
  const adjList: number[][] = Array.from({ length: numCourses }, () => []);
  const inDegree: number[] = new Array(numCourses).fill(0);

  for (const [course, prereq] of prerequisites) {
    adjList[prereq].push(course);
    inDegree[course]++;
  }

  // 入度为 0 的课程入队
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  let count = 0;
  while (queue.length > 0) {
    const course = queue.shift()!;
    count++;
    for (const next of adjList[course]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }

  return count === numCourses;
}

// 方法2：DFS 环检测
function canFinishDFS(numCourses: number, prerequisites: number[][]): boolean {
  const adjList: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [course, prereq] of prerequisites) {
    adjList[prereq].push(course);
  }

  // 0: 未访问, 1: 正在访问, 2: 已完成
  const state: number[] = new Array(numCourses).fill(0);

  function hasCycle(node: number): boolean {
    if (state[node] === 1) return true; // 发现环
    if (state[node] === 2) return false; // 已完成，无需再检查

    state[node] = 1; // 标记正在访问
    for (const neighbor of adjList[node]) {
      if (hasCycle(neighbor)) return true;
    }
    state[node] = 2; // 标记已完成
    return false;
  }

  for (let i = 0; i < numCourses; i++) {
    if (state[i] === 0 && hasCycle(i)) return false;
  }
  return true;
}

// ============================================================
// 5. 课程表 II
// LeetCode 210. Course Schedule II
// ============================================================
// 返回完成所有课程的顺序（拓扑排序），若不可能则返回空数组
// 时间复杂度：O(V + E)，空间复杂度：O(V + E)

// 方法1：BFS 拓扑排序（推荐）
function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const adjList: number[][] = Array.from({ length: numCourses }, () => []);
  const inDegree: number[] = new Array(numCourses).fill(0);

  for (const [course, prereq] of prerequisites) {
    adjList[prereq].push(course);
    inDegree[course]++;
  }

  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order: number[] = [];
  while (queue.length > 0) {
    const course = queue.shift()!;
    order.push(course);
    for (const next of adjList[course]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }

  return order.length === numCourses ? order : [];
}

// 方法2：DFS 后序反转
function findOrderDFS(numCourses: number, prerequisites: number[][]): number[] {
  const adjList: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [course, prereq] of prerequisites) {
    adjList[prereq].push(course);
  }

  const state: number[] = new Array(numCourses).fill(0);
  const order: number[] = [];
  let hasCycle = false;

  function dfs(node: number): void {
    if (hasCycle) return;
    if (state[node] === 1) {
      hasCycle = true;
      return;
    }
    if (state[node] === 2) return;

    state[node] = 1;
    for (const neighbor of adjList[node]) {
      dfs(neighbor);
    }
    state[node] = 2;
    order.push(node); // 后序加入
  }

  for (let i = 0; i < numCourses; i++) {
    if (state[i] === 0) dfs(i);
  }

  if (hasCycle) return [];
  return order.reverse(); // 反转后序即为拓扑序
}

// ============================================================
// 6. 可能的二分法
// LeetCode 886. Possible Bipartition
// ============================================================
// 判断能否将人分成两组，使得不喜欢的人不在同一组
// 等价于判断图是否为二分图
// 时间复杂度：O(V + E)，空间复杂度：O(V + E)

// 方法1：BFS 染色法（推荐）
function possibleBipartition(n: number, dislikes: number[][]): boolean {
  const adjList: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [a, b] of dislikes) {
    adjList[a].push(b);
    adjList[b].push(a);
  }

  const color: number[] = new Array(n + 1).fill(-1); // -1: 未染色, 0/1: 两种颜色

  for (let i = 1; i <= n; i++) {
    if (color[i] !== -1) continue;
    color[i] = 0;
    const queue: number[] = [i];

    while (queue.length > 0) {
      const node = queue.shift()!;
      for (const neighbor of adjList[node]) {
        if (color[neighbor] === -1) {
          color[neighbor] = color[node] ^ 1; // 染相反颜色
          queue.push(neighbor);
        } else if (color[neighbor] === color[node]) {
          return false; // 相邻节点同色，不是二分图
        }
      }
    }
  }

  return true;
}

// 方法2：并查集
function possibleBipartitionUF(n: number, dislikes: number[][]): boolean {
  const adjList: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [a, b] of dislikes) {
    adjList[a].push(b);
    adjList[b].push(a);
  }

  const uf = new UnionFind(n + 1);

  for (let i = 1; i <= n; i++) {
    for (const neighbor of adjList[i]) {
      // i 和 neighbor 不应在同一组，如果它们已经连通则矛盾
      if (uf.connected(i, neighbor)) return false;
      // neighbor 的所有不喜欢的人应该和 i 在同一组
      for (const other of adjList[i]) {
        uf.union(neighbor, other);
      }
    }
  }

  return true;
}

// ============================================================
// 7. 最小生成树
// ============================================================
// 给定连通无向图，求权重之和最小的生成树
// Kruskal 时间复杂度：O(E log E)，空间复杂度：O(V + E)
// Prim 时间复杂度：O(E log V)，空间复杂度：O(V + E)

// 方法1：Kruskal 算法（推荐，适合稀疏图）
function kruskalMST(
  n: number,
  edges: [number, number, number][],
): [number, [number, number, number][]] {
  // edges: [u, v, weight]
  const sortedEdges = [...edges].sort((a, b) => a[2] - b[2]); // 按权重排序
  const uf = new UnionFind(n);
  const mst: [number, number, number][] = [];
  let totalWeight = 0;

  for (const [u, v, w] of sortedEdges) {
    if (uf.union(u, v)) {
      mst.push([u, v, w]);
      totalWeight += w;
      if (mst.length === n - 1) break; // 生成树有 n-1 条边
    }
  }

  return [totalWeight, mst];
}

// 方法2：Prim 算法（适合稠密图）
function primMST(
  n: number,
  adjList: [number, number][][],
): [number, [number, number, number][]] {
  // adjList[i] = [[neighbor, weight], ...]
  const inMST = new Array(n).fill(false);
  const minDist = new Array(n).fill(Infinity);
  const parent = new Array(n).fill(-1);
  minDist[0] = 0;
  let totalWeight = 0;

  for (let i = 0; i < n; i++) {
    // 找到不在 MST 中距离最小的节点
    let u = -1;
    for (let v = 0; v < n; v++) {
      if (!inMST[v] && (u === -1 || minDist[v] < minDist[u])) {
        u = v;
      }
    }

    inMST[u] = true;
    totalWeight += minDist[u];

    // 更新相邻节点距离
    for (const [v, w] of adjList[u]) {
      if (!inMST[v] && w < minDist[v]) {
        minDist[v] = w;
        parent[v] = u;
      }
    }
  }

  const mst: [number, number, number][] = [];
  for (let i = 1; i < n; i++) {
    if (parent[i] !== -1) {
      mst.push([parent[i], i, minDist[i]]);
    }
  }

  return [totalWeight, mst];
}

// ============================================================
// 8. 网络延迟时间
// LeetCode 743. Network Delay Time
// ============================================================
// 从源节点发出信号，求所有节点收到信号的最短时间
// 等价于求单源最短路径中的最大值
// Dijkstra 时间复杂度：O(E log V)，空间复杂度：O(V + E)

// 方法1：Dijkstra 优先队列（推荐）
function networkDelayTime(times: number[][], n: number, k: number): number {
  const adjList: [number, number][][] = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) {
    adjList[u].push([v, w]);
  }

  const dist: number[] = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  // 优先队列用数组模拟：[距离, 节点]
  const pq: [number, number][] = [[0, k]];

  while (pq.length > 0) {
    // 取出距离最小的节点
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;

    if (d > dist[u]) continue; // 已找到更短路径，跳过

    for (const [v, w] of adjList[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }

  let maxDist = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1; // 有不可达节点
    maxDist = Math.max(maxDist, dist[i]);
  }
  return maxDist;
}

// 方法2：Dijkstra 朴素实现（适合小规模数据）
function networkDelayTimeSimple(
  times: number[][],
  n: number,
  k: number,
): number {
  const INF = Infinity;
  const graph: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(n + 1).fill(INF),
  );
  for (const [u, v, w] of times) graph[u][v] = w;

  const dist: number[] = new Array(n + 1).fill(INF);
  const visited: boolean[] = new Array(n + 1).fill(false);
  dist[k] = 0;

  for (let i = 1; i <= n; i++) {
    let u = -1;
    for (let v = 1; v <= n; v++) {
      if (!visited[v] && (u === -1 || dist[v] < dist[u])) u = v;
    }
    if (dist[u] === INF) break;
    visited[u] = true;

    for (let v = 1; v <= n; v++) {
      if (graph[u][v] !== INF) {
        dist[v] = Math.min(dist[v], dist[u] + graph[u][v]);
      }
    }
  }

  let maxDist = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === INF) return -1;
    maxDist = Math.max(maxDist, dist[i]);
  }
  return maxDist;
}

// ============================================================
// 9. 最短路径（Floyd-Warshall 全源最短路径）
// ============================================================
// 求图中任意两点之间的最短路径
// 时间复杂度：O(V^3)，空间复杂度：O(V^2)

// 方法1：Floyd-Warshall 算法（推荐）
function floydWarshall(
  n: number,
  edges: [number, number, number][],
): number[][] {
  const INF = 1e9;
  const dist: number[][] = Array.from({ length: n }, () =>
    new Array(n).fill(INF),
  );

  // 初始化
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const [u, v, w] of edges) {
    dist[u][v] = Math.min(dist[u][v], w); // 处理重边
    // 如果是无向图，加上: dist[v][u] = Math.min(dist[v][u], w);
  }

  // 三重循环：以 k 为中转节点
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  return dist;
}

// 方法2：带路径还原的 Floyd-Warshall
function floydWarshallWithPath(
  n: number,
  edges: [number, number, number][],
): { dist: number[][]; next: number[][] } {
  const INF = 1e9;
  const dist: number[][] = Array.from({ length: n }, () =>
    new Array(n).fill(INF),
  );
  const next: number[][] = Array.from({ length: n }, () =>
    new Array(n).fill(-1),
  );

  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
    next[i][i] = i;
  }
  for (const [u, v, w] of edges) {
    if (w < dist[u][v]) {
      dist[u][v] = w;
      next[u][v] = v;
    }
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }

  return { dist, next };
}

// 还原路径
function reconstructPath(
  next: number[][],
  start: number,
  end: number,
): number[] {
  if (next[start][end] === -1) return []; // 不可达
  const path: number[] = [start];
  let curr = start;
  while (curr !== end) {
    curr = next[curr][end];
    path.push(curr);
  }
  return path;
}

// ============================================================
// 10. 拓扑排序
// ============================================================
// 对有向无环图 (DAG) 的节点进行线性排序，使得每条边的
// 起点在终点之前
// BFS 时间复杂度：O(V + E)，空间复杂度：O(V + E)
// DFS 时间复杂度：O(V + E)，空间复杂度：O(V + E)

// 方法1：Kahn 算法 / BFS 入度法（推荐）
function topologicalSort(n: number, edges: number[][]): number[] {
  const adjList: number[][] = Array.from({ length: n }, () => []);
  const inDegree: number[] = new Array(n).fill(0);

  for (const [u, v] of edges) {
    adjList[u].push(v);
    inDegree[v]++;
  }

  const queue: number[] = [];
  for (let i = 0; i < n; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order: number[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const next of adjList[node]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }

  return order.length === n ? order : []; // 有环则返回空数组
}

// 方法2：DFS 后序反转
function topologicalSortDFS(n: number, edges: number[][]): number[] {
  const adjList: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adjList[u].push(v);
  }

  const visited: number[] = new Array(n).fill(0); // 0: 未访问, 1: 访问中, 2: 已完成
  const order: number[] = [];
  let hasCycle = false;

  function dfs(node: number): void {
    if (hasCycle) return;
    if (visited[node] === 1) {
      hasCycle = true;
      return;
    }
    if (visited[node] === 2) return;

    visited[node] = 1;
    for (const next of adjList[node]) {
      dfs(next);
    }
    visited[node] = 2;
    order.push(node);
  }

  for (let i = 0; i < n; i++) {
    if (visited[i] === 0) dfs(i);
  }

  if (hasCycle) return [];
  return order.reverse();
}

// ============================================================
// 11. 判断图中是否存在环
// ============================================================
// 检测有向图/无向图中是否有环
// 有向图时间复杂度：O(V + E)，空间复杂度：O(V)
// 无向图时间复杂度：O(V + E)，空间复杂度：O(V)

// 方法1：有向图 - DFS 三色标记法（推荐）
function hasCycleDirected(n: number, edges: number[][]): boolean {
  const adjList: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) adjList[u].push(v);

  const state: number[] = new Array(n).fill(0); // 0: 未访问, 1: 访问中, 2: 已完成

  function dfs(node: number): boolean {
    state[node] = 1;
    for (const next of adjList[node]) {
      if (state[next] === 1) return true; // 回边，存在环
      if (state[next] === 0 && dfs(next)) return true;
    }
    state[node] = 2;
    return false;
  }

  for (let i = 0; i < n; i++) {
    if (state[i] === 0 && dfs(i)) return true;
  }
  return false;
}

// 方法2：有向图 - 拓扑排序（BFS 入度法）
function hasCycleDirectedBFS(n: number, edges: number[][]): boolean {
  const adjList: number[][] = Array.from({ length: n }, () => []);
  const inDegree: number[] = new Array(n).fill(0);

  for (const [u, v] of edges) {
    adjList[u].push(v);
    inDegree[v]++;
  }

  const queue: number[] = [];
  for (let i = 0; i < n; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  let count = 0;
  while (queue.length > 0) {
    const node = queue.shift()!;
    count++;
    for (const next of adjList[node]) {
      if (--inDegree[next] === 0) queue.push(next);
    }
  }

  return count !== n; // 无法拓扑排序则存在环
}

// 方法3：无向图 - DFS 检测环
function hasCycleUndirected(n: number, edges: number[][]): boolean {
  const adjList: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adjList[u].push(v);
    adjList[v].push(u);
  }

  const visited = new Set<number>();

  function dfs(node: number, parent: number): boolean {
    visited.add(node);
    for (const neighbor of adjList[node]) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, node)) return true;
      } else if (neighbor !== parent) {
        // 访问过且不是父节点，存在环
        return true;
      }
    }
    return false;
  }

  for (let i = 0; i < n; i++) {
    if (!visited.has(i) && dfs(i, -1)) return true;
  }
  return false;
}

// 方法4：无向图 - 并查集
function hasCycleUndirectedUF(n: number, edges: number[][]): boolean {
  const uf = new UnionFind(n);
  for (const [u, v] of edges) {
    if (uf.connected(u, v)) return true; // 两个端点已连通，再连则成环
    uf.union(u, v);
  }
  return false;
}

// ============================================================
// 12. 二分图检测
// LeetCode 785. Is Graph Bipartite?
// ============================================================
// 判断无向图是否为二分图（可以将节点分成两组，使得所有边
// 都在两组之间）
// 时间复杂度：O(V + E)，空间复杂度：O(V)

// 方法1：BFS 染色法（推荐）
function isBipartite(graph: number[][]): boolean {
  const n = graph.length;
  const color: number[] = new Array(n).fill(-1); // -1: 未染色, 0/1: 两种颜色

  for (let i = 0; i < n; i++) {
    if (color[i] !== -1) continue;
    color[i] = 0;
    const queue: number[] = [i];

    while (queue.length > 0) {
      const node = queue.shift()!;
      for (const neighbor of graph[node]) {
        if (color[neighbor] === -1) {
          color[neighbor] = color[node] ^ 1;
          queue.push(neighbor);
        } else if (color[neighbor] === color[node]) {
          return false;
        }
      }
    }
  }

  return true;
}

// 方法2：DFS 染色法
function isBipartiteDFS(graph: number[][]): boolean {
  const n = graph.length;
  const color: number[] = new Array(n).fill(-1);

  function dfs(node: number, c: number): boolean {
    color[node] = c;
    for (const neighbor of graph[node]) {
      if (color[neighbor] === -1) {
        if (!dfs(neighbor, c ^ 1)) return false;
      } else if (color[neighbor] === c) {
        return false;
      }
    }
    return true;
  }

  for (let i = 0; i < n; i++) {
    if (color[i] === -1 && !dfs(i, 0)) return false;
  }

  return true;
}

// 方法3：并查集
function isBipartiteUF(graph: number[][]): boolean {
  const n = graph.length;
  const uf = new UnionFind(n);

  for (let i = 0; i < n; i++) {
    for (const neighbor of graph[i]) {
      // 相邻节点不应在同一集合
      if (uf.connected(i, neighbor)) return false;
    }
    // 所有邻居应该在同一集合（与 i 不同）
    if (graph[i].length > 0) {
      const first = graph[i][0];
      for (let j = 1; j < graph[i].length; j++) {
        uf.union(first, graph[i][j]);
      }
    }
  }

  return true;
}

// ============================================================
// 13. 关键连接（寻找图中的桥）
// LeetCode 1192. Critical Connections in a Network
// ============================================================
// Tarjan 算法：DFS 过程中记录每个节点的发现时间 (dfn) 和
// 最早可达时间 (low)，若 low[v] > dfn[u]，则 (u,v) 是桥
// 时间复杂度：O(V + E)，空间复杂度：O(V)

// 方法1：Tarjan 算法（推荐）
function criticalConnections(n: number, connections: number[][]): number[][] {
  const adjList: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of connections) {
    adjList[u].push(v);
    adjList[v].push(u);
  }

  const dfn: number[] = new Array(n).fill(-1); // 发现时间
  const low: number[] = new Array(n).fill(-1); // 最早可达时间
  const bridges: number[][] = [];
  let time = 0;

  function tarjan(node: number, parent: number): void {
    dfn[node] = low[node] = time++;

    for (const neighbor of adjList[node]) {
      if (neighbor === parent) continue; // 跳过父节点
      if (dfn[neighbor] === -1) {
        // 未访问过的节点
        tarjan(neighbor, node);
        low[node] = Math.min(low[node], low[neighbor]);
        // 判断是否为桥
        if (low[neighbor] > dfn[node]) {
          bridges.push([node, neighbor]);
        }
      } else {
        // 已访问过的节点，更新 low
        low[node] = Math.min(low[node], dfn[neighbor]);
      }
    }
  }

  tarjan(0, -1);
  return bridges;
}

// 方法2：删除边法（暴力，仅适合小规模）
function criticalConnectionsBruteForce(
  n: number,
  connections: number[][],
): number[][] {
  const bridges: number[][] = [];

  for (const [u, v] of connections) {
    // 删除边 (u,v)，检查连通性
    const adjList: number[][] = Array.from({ length: n }, () => []);
    for (const [a, b] of connections) {
      if ((a === u && b === v) || (a === v && b === u)) continue;
      adjList[a].push(b);
      adjList[b].push(a);
    }

    // BFS 检查连通性
    const visited = new Set<number>();
    const queue: number[] = [0];
    visited.add(0);
    while (queue.length > 0) {
      const node = queue.shift()!;
      for (const neighbor of adjList[node]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    if (visited.size < n) {
      bridges.push([u, v]);
    }
  }

  return bridges;
}

// ============================================================
// 14. 单源最短路径（Dijkstra 算法）
// ============================================================
// 求从源点到所有其他节点的最短路径（非负权图）
// 优先队列时间复杂度：O(E log V)，空间复杂度：O(V + E)

// 方法1：Dijkstra 优先队列（推荐）
function dijkstra(
  n: number,
  edges: [number, number, number][],
  source: number,
): number[] {
  const adjList: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adjList[u].push([v, w]);
  }

  const dist: number[] = new Array(n).fill(Infinity);
  dist[source] = 0;
  const pq: [number, number][] = [[0, source]]; // [距离, 节点]
  const visited = new Set<number>();

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;

    if (visited.has(u)) continue;
    visited.add(u);

    for (const [v, w] of adjList[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }

  return dist;
}

// 方法2：Dijkstra 带路径还原
function dijkstraWithPath(
  n: number,
  edges: [number, number, number][],
  source: number,
): { dist: number[]; prev: number[] } {
  const adjList: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adjList[u].push([v, w]);
  }

  const dist: number[] = new Array(n).fill(Infinity);
  const prev: number[] = new Array(n).fill(-1);
  dist[source] = 0;
  const pq: [number, number][] = [[0, source]];

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;
    if (d > dist[u]) continue;

    for (const [v, w] of adjList[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
        pq.push([dist[v], v]);
      }
    }
  }

  return { dist, prev };
}

// 还原从 source 到 target 的最短路径
function getShortestPath(
  prev: number[],
  source: number,
  target: number,
): number[] {
  const path: number[] = [];
  let curr = target;
  while (curr !== -1) {
    path.push(curr);
    if (curr === source) break;
    curr = prev[curr];
  }
  return path.reverse();
}

// ============================================================
// 15. 判断负权回路
// ============================================================
// 检测图中是否存在负权环（权值之和为负的环）
// Bellman-Ford 时间复杂度：O(V * E)，空间复杂度：O(V)
// SPFA 时间复杂度：平均 O(E)，最坏 O(V * E)，空间复杂度：O(V)

// 方法1：Bellman-Ford 算法（推荐）
function hasNegativeCycle(
  n: number,
  edges: [number, number, number][],
): boolean {
  const dist: number[] = new Array(n).fill(Infinity);
  dist[0] = 0;

  // 进行 n-1 轮松弛
  for (let i = 0; i < n - 1; i++) {
    let updated = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        updated = true;
      }
    }
    if (!updated) break; // 提前结束优化
  }

  // 第 n 轮如果还能松弛，说明存在负权环
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
      return true;
    }
  }

  return false;
}

// 方法2：SPFA（Bellman-Ford 的队列优化）
function hasNegativeCycleSPFA(
  n: number,
  edges: [number, number, number][],
): boolean {
  const adjList: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adjList[u].push([v, w]);
  }

  const dist: number[] = new Array(n).fill(0); // 初始化为 0，可检测从任意点出发的负环
  const inQueue: boolean[] = new Array(n).fill(true);
  const count: number[] = new Array(n).fill(0); // 入队次数
  const queue: number[] = [];

  // 所有节点入队
  for (let i = 0; i < n; i++) {
    queue.push(i);
    count[i] = 1;
  }

  while (queue.length > 0) {
    const u = queue.shift()!;
    inQueue[u] = false;

    for (const [v, w] of adjList[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        if (!inQueue[v]) {
          queue.push(v);
          inQueue[v] = true;
          count[v]++;
          // 如果入队次数超过 n，说明存在负权环
          if (count[v] > n) return true;
        }
      }
    }
  }

  return false;
}

// 方法3：Bellman-Ford 计算负权环路径
function findNegativeCycle(
  n: number,
  edges: [number, number, number][],
): number[] {
  const dist: number[] = new Array(n).fill(0);
  const parent: number[] = new Array(n).fill(-1);
  let lastUpdated = -1;

  // n 轮松弛
  for (let i = 0; i < n; i++) {
    lastUpdated = -1;
    for (const [u, v, w] of edges) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        parent[v] = u;
        lastUpdated = v;
      }
    }
    if (lastUpdated === -1) break;
  }

  if (lastUpdated === -1) return []; // 无负权环

  // 从 lastUpdated 回溯 n 步确保进入环中
  for (let i = 0; i < n; i++) {
    lastUpdated = parent[lastUpdated];
  }

  // 还原负权环
  const cycle: number[] = [lastUpdated];
  let curr = parent[lastUpdated];
  while (curr !== lastUpdated) {
    cycle.push(curr);
    curr = parent[curr];
  }
  cycle.push(lastUpdated);

  return cycle.reverse();
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 图的深度优先搜索 =====");
const dfsGraph = [
  [1, 2],
  [0, 3],
  [0, 3],
  [1, 2],
];
console.log("递归 DFS:", graphDFS(dfsGraph, 0)); // [0, 1, 3, 2]
console.log("迭代 DFS:", graphDFSIterative(dfsGraph, 0)); // [0, 1, 3, 2]

console.log("\n===== 2. 图的广度优先搜索 =====");
console.log("BFS:", graphBFS(dfsGraph, 0)); // [0, 1, 2, 3]
console.log("按层 BFS:", graphBFSByLevel(dfsGraph, 0)); // [[0], [1, 2], [3]]

console.log("\n===== 3. 克隆图 =====");
const n1 = new GraphNode(1);
const n2 = new GraphNode(2);
const n3 = new GraphNode(3);
const n4 = new GraphNode(4);
n1.neighbors = [n2, n4];
n2.neighbors = [n1, n3];
n3.neighbors = [n2, n4];
n4.neighbors = [n1, n3];
const cloned = cloneGraph(n1);
console.log("克隆节点值:", cloned?.val); // 1
console.log("邻居数量:", cloned?.neighbors.length); // 2

console.log("\n===== 4. 课程表 =====");
console.log(canFinish(2, [[1, 0]])); // true
console.log(
  canFinish(2, [
    [1, 0],
    [0, 1],
  ]),
); // false

console.log("\n===== 5. 课程表 II =====");
console.log(findOrder(2, [[1, 0]])); // [0, 1]
console.log(
  findOrder(4, [
    [1, 0],
    [2, 0],
    [3, 1],
    [3, 2],
  ]),
); // [0, 1, 2, 3] 或 [0, 2, 1, 3]

console.log("\n===== 6. 可能的二分法 =====");
console.log(
  possibleBipartition(4, [
    [1, 2],
    [1, 3],
    [2, 4],
  ]),
); // true
console.log(
  possibleBipartition(3, [
    [1, 2],
    [1, 3],
    [2, 3],
  ]),
); // false

console.log("\n===== 7. 最小生成树 =====");
const mstEdges: [number, number, number][] = [
  [0, 1, 4],
  [0, 2, 3],
  [1, 2, 1],
  [1, 3, 2],
  [2, 3, 4],
  [3, 4, 2],
  [1, 4, 3],
];
console.log("Kruskal:", kruskalMST(5, mstEdges)); // [8, [[1,2,1],[1,3,2],[3,4,2],[0,2,3]]]

const primAdj: [number, number][][] = [
  [
    [1, 4],
    [2, 3],
  ],
  [
    [0, 4],
    [2, 1],
    [3, 2],
    [4, 3],
  ],
  [
    [0, 3],
    [1, 1],
    [3, 4],
  ],
  [
    [1, 2],
    [2, 4],
    [4, 2],
  ],
  [
    [1, 3],
    [3, 2],
  ],
];
console.log("Prim:", primMST(5, primAdj)); // [8, ...]

console.log("\n===== 8. 网络延迟时间 =====");
console.log(
  networkDelayTime(
    [
      [2, 1, 1],
      [2, 3, 1],
      [3, 4, 1],
    ],
    4,
    2,
  ),
); // 2

console.log("\n===== 9. 最短路径（Floyd-Warshall）=====");
const fwEdges: [number, number, number][] = [
  [0, 1, 4],
  [0, 2, 3],
  [1, 2, 1],
  [1, 3, 2],
  [2, 3, 4],
];
console.log("最短路径矩阵:", floydWarshall(4, fwEdges));

console.log("\n===== 10. 拓扑排序 =====");
console.log(
  topologicalSort(6, [
    [5, 2],
    [5, 0],
    [4, 0],
    [4, 1],
    [2, 3],
    [3, 1],
  ]),
);
// [4, 5, 0, 2, 3, 1] 或其他合法拓扑序

console.log("\n===== 11. 判断图中是否存在环 =====");
console.log(
  "有向图(有环):",
  hasCycleDirected(3, [
    [0, 1],
    [1, 2],
    [2, 0],
  ]),
); // true
console.log(
  "有向图(无环):",
  hasCycleDirected(3, [
    [0, 1],
    [1, 2],
  ]),
); // false
console.log(
  "无向图(有环):",
  hasCycleUndirected(3, [
    [0, 1],
    [1, 2],
    [2, 0],
  ]),
); // true
console.log(
  "无向图(无环):",
  hasCycleUndirected(3, [
    [0, 1],
    [1, 2],
  ]),
); // false

console.log("\n===== 12. 二分图检测 =====");
console.log(
  isBipartite([
    [1, 3],
    [0, 2],
    [1, 3],
    [0, 2],
  ]),
); // true
console.log(
  isBipartite([
    [1, 2, 3],
    [0, 2],
    [0, 1, 3],
    [0, 2],
  ]),
); // false

console.log("\n===== 13. 关键连接 =====");
console.log(
  criticalConnections(4, [
    [0, 1],
    [1, 2],
    [2, 0],
    [1, 3],
  ]),
); // [[1, 3]]

console.log("\n===== 14. 单源最短路径 =====");
const spEdges: [number, number, number][] = [
  [0, 1, 4],
  [0, 2, 3],
  [1, 2, 1],
  [1, 3, 2],
  [2, 3, 4],
];
console.log("Dijkstra 从 0 出发:", dijkstra(4, spEdges, 0)); // [0, 4, 3, 6]

const { dist: spDist, prev: spPrev } = dijkstraWithPath(4, spEdges, 0);
console.log("带路径还原 - 距离:", spDist); // [0, 4, 3, 6]
console.log("0→3 最短路径:", getShortestPath(spPrev, 0, 3)); // [0, 2, 1, 3]

console.log("\n===== 15. 判断负权回路 =====");
console.log(
  "无负环:",
  hasNegativeCycle(3, [
    [0, 1, 1],
    [1, 2, 2],
    [0, 2, 5],
  ]),
); // false
console.log(
  "有负环:",
  hasNegativeCycle(3, [
    [0, 1, 1],
    [1, 2, -3],
    [2, 0, 1],
  ]),
); // true
console.log(
  "SPFA 检测负环:",
  hasNegativeCycleSPFA(3, [
    [0, 1, 1],
    [1, 2, -3],
    [2, 0, 1],
  ]),
); // true
console.log(
  "负环路径:",
  findNegativeCycle(3, [
    [0, 1, 1],
    [1, 2, -3],
    [2, 0, 1],
  ]),
); // [0, 1, 2, 0]

export {};
