// ============================================================
// 图 & 高级数据结构面试题 - TypeScript 解题合集
// ============================================================

// ============================================================
// 涉及的核心数据结构：
//   - 图（邻接表 / 邻接矩阵）
//   - 并查集 (Union-Find)
//   - 字典树 (Trie)
//   - 链表（带随机指针）
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

// -------------------- 链表节点定义 --------------------
export class ListNode {
  val: number;
  next: ListNode | null;
  random: ListNode | null; // 带随机指针的链表
  constructor(val?: number, next?: ListNode | null, random?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
    this.random = random === undefined ? null : random;
  }
}

// -------------------- 并查集定义 --------------------
export class UnionFind {
  private parent: number[];
  private rank: number[];
  count: number; // 连通分量数

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.count = n;
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
    if (rootX === rootY) return false; // 已在同一集合

    // 按秩合并
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    this.count--;
    return true;
  }

  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }
}

// -------------------- 字典树定义 --------------------
export class TrieNode {
  children: Map<string, TrieNode>;
  isEnd: boolean;

  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

export class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return node.isEnd;
  }

  startsWith(prefix: string): boolean {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return true;
  }
}

// ============================================================
// 1. 关键连接（寻找图中的桥）
// LeetCode 1192. Critical Connections in a Network
// ============================================================
// Tarjan 算法：DFS 过程中记录每个节点的发现时间 (dfn) 和
// 最早可达时间 (low)，若 low[v] > dfn[u]，则 (u,v) 是桥

function criticalConnections(n: number, connections: number[][]): number[][] {
  // 构建邻接表
  const graph: Map<number, number[]> = new Map();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v] of connections) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }

  const dfn = new Array(n).fill(-1); // 发现时间
  const low = new Array(n).fill(-1); // 最早可达时间
  const result: number[][] = [];
  let time = 0;

  const dfs = (u: number, parent: number) => {
    dfn[u] = low[u] = time++;

    for (const v of graph.get(u)!) {
      if (v === parent) continue; // 跳过父节点

      if (dfn[v] === -1) {
        // v 未访问
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);

        // 如果 v 的最早可达时间 > u 的发现时间，说明 v 无法通过其他路径回到 u
        if (low[v] > dfn[u]) {
          result.push([u, v]);
        }
      } else {
        // v 已访问，更新 low[u]
        low[u] = Math.min(low[u], dfn[v]);
      }
    }
  };

  dfs(0, -1);
  return result;
}

// 方法2：并查集 + 删边法（不推荐，复杂度高，仅作了解）
// 思路：从所有边中依次删去一条边，用并查集判断连通性

// ============================================================
// 2. 判断负权回路
// Bellman-Ford 算法检测负权环
// ============================================================
// Bellman-Ford 执行 n-1 轮松弛后，若第 n 轮仍能松弛，则存在负权环

function hasNegativeCycle(
  n: number,
  edges: [number, number, number][],
): boolean {
  const dist = new Array(n).fill(Infinity);
  dist[0] = 0;

  // n-1 轮松弛
  for (let i = 0; i < n - 1; i++) {
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }

  // 第 n 轮：如果还能松弛，说明有负权环
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
      return true; // 存在负权环
    }
  }

  return false;
}

// 方法2：SPFA（Bellman-Ford 的队列优化版）检测负权环
// 如果某个节点入队次数 >= n，则存在负权环
function hasNegativeCycleSPFA(
  n: number,
  edges: [number, number, number][],
): boolean {
  // 构建邻接表
  const graph: Map<number, [number, number][]> = new Map();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v, w] of edges) {
    graph.get(u)!.push([v, w]);
  }

  const dist = new Array(n).fill(Infinity);
  const count = new Array(n).fill(0); // 入队次数
  const inQueue = new Array(n).fill(false);
  const queue: number[] = [0];
  dist[0] = 0;
  inQueue[0] = true;
  count[0] = 1;

  while (queue.length > 0) {
    const u = queue.shift()!;
    inQueue[u] = false;

    for (const [v, w] of graph.get(u)!) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        if (!inQueue[v]) {
          queue.push(v);
          inQueue[v] = true;
          count[v]++;
          if (count[v] >= n) return true; // 入队 n 次以上，存在负权环
        }
      }
    }
  }

  return false;
}

// ============================================================
// 3. 判断图中是否存在环
// ============================================================

// 方法1：并查集判断无向图中的环 — 推荐
function hasCycleUndirected(n: number, edges: number[][]): boolean {
  const uf = new UnionFind(n);

  for (const [u, v] of edges) {
    if (uf.connected(u, v)) return true; // u 和 v 已在同一集合，加入此边形成环
    uf.union(u, v);
  }

  return false;
}

// 方法2：DFS 判断无向图中的环
function hasCycleUndirectedDFS(n: number, edges: number[][]): boolean {
  const graph: Map<number, number[]> = new Map();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }

  const visited = new Array(n).fill(false);

  const dfs = (u: number, parent: number): boolean => {
    visited[u] = true;
    for (const v of graph.get(u)!) {
      if (!visited[v]) {
        if (dfs(v, u)) return true;
      } else if (v !== parent) {
        // 访问过且不是父节点，说明有环
        return true;
      }
    }
    return false;
  };

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      if (dfs(i, -1)) return true;
    }
  }

  return false;
}

// 方法3：DFS 判断有向图中的环（三色标记法）
function hasCycleDirected(n: number, edges: number[][]): boolean {
  const graph: Map<number, number[]> = new Map();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
  }

  // 0: 未访问, 1: 正在访问（当前路径）, 2: 已完成
  const state = new Array(n).fill(0);

  const dfs = (u: number): boolean => {
    state[u] = 1; // 标记为正在访问
    for (const v of graph.get(u)!) {
      if (state[v] === 1) return true; // 遇到正在访问的节点，有环
      if (state[v] === 0 && dfs(v)) return true;
    }
    state[u] = 2; // 标记为已完成
    return false;
  };

  for (let i = 0; i < n; i++) {
    if (state[i] === 0 && dfs(i)) return true;
  }

  return false;
}

// ============================================================
// 4. 图的深度优先搜索
// ============================================================

// 方法1：递归 DFS — 推荐
function graphDFS(n: number, edges: number[][], start: number): number[] {
  // 构建邻接表
  const graph: Map<number, number[]> = new Map();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u); // 无向图
  }

  // 对邻接表排序，保证访问顺序确定性
  for (let i = 0; i < n; i++) {
    graph.get(i)!.sort((a, b) => a - b);
  }

  const visited = new Array(n).fill(false);
  const result: number[] = [];

  const dfs = (u: number) => {
    visited[u] = true;
    result.push(u);
    for (const v of graph.get(u)!) {
      if (!visited[v]) dfs(v);
    }
  };

  dfs(start);
  return result;
}

// 方法2：迭代 DFS + 栈
function graphDFSIterative(
  n: number,
  edges: number[][],
  start: number,
): number[] {
  const graph: Map<number, number[]> = new Map();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }
  for (let i = 0; i < n; i++) {
    graph.get(i)!.sort((a, b) => a - b);
  }

  const visited = new Array(n).fill(false);
  const result: number[] = [];
  const stack: number[] = [start];

  while (stack.length > 0) {
    const u = stack.pop()!;
    if (visited[u]) continue;
    visited[u] = true;
    result.push(u);

    // 逆序入栈，保证按升序访问
    const neighbors = graph.get(u)!.slice().reverse();
    for (const v of neighbors) {
      if (!visited[v]) stack.push(v);
    }
  }

  return result;
}

// ============================================================
// 5. 克隆图
// LeetCode 133. Clone Graph
// ============================================================

// 方法1：DFS + 哈希表 — 推荐
function cloneGraph(node: GraphNode | null): GraphNode | null {
  if (node === null) return null;

  const visited = new Map<GraphNode, GraphNode>();

  const dfs = (n: GraphNode): GraphNode => {
    if (visited.has(n)) return visited.get(n)!;

    const clone = new GraphNode(n.val);
    visited.set(n, clone);

    for (const neighbor of n.neighbors) {
      clone.neighbors.push(dfs(neighbor));
    }

    return clone;
  };

  return dfs(node);
}

// 方法2：BFS + 哈希表
function cloneGraphBFS(node: GraphNode | null): GraphNode | null {
  if (node === null) return null;

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
// 6. 课程表（判断能否完成所有课程）
// LeetCode 207. Course Schedule
// ============================================================
// 本质：判断有向图中是否有环（拓扑排序）

// 方法1：BFS 拓扑排序（Kahn 算法）— 推荐
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const graph: Map<number, number[]> = new Map();
  const inDegree = new Array(numCourses).fill(0);

  for (let i = 0; i < numCourses; i++) graph.set(i, []);
  for (const [course, prereq] of prerequisites) {
    graph.get(prereq)!.push(course);
    inDegree[course]++;
  }

  // 入度为 0 的节点入队
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  let count = 0; // 已完成的课程数
  while (queue.length > 0) {
    const u = queue.shift()!;
    count++;

    for (const v of graph.get(u)!) {
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    }
  }

  return count === numCourses;
}

// 方法2：DFS 检测环（三色标记法）
function canFinishDFS(numCourses: number, prerequisites: number[][]): boolean {
  const graph: Map<number, number[]> = new Map();
  for (let i = 0; i < numCourses; i++) graph.set(i, []);
  for (const [course, prereq] of prerequisites) {
    graph.get(prereq)!.push(course);
  }

  // 0: 未访问, 1: 正在访问, 2: 已完成
  const state = new Array(numCourses).fill(0);

  const hasCycle = (u: number): boolean => {
    state[u] = 1;
    for (const v of graph.get(u)!) {
      if (state[v] === 1) return true;
      if (state[v] === 0 && hasCycle(v)) return true;
    }
    state[u] = 2;
    return false;
  };

  for (let i = 0; i < numCourses; i++) {
    if (state[i] === 0 && hasCycle(i)) return false;
  }

  return true;
}

// 方法3：并查集（仅适用于无向图，此处不适用，仅作了解）

// ============================================================
// 7. 最短路径
// ============================================================

// 方法1：Dijkstra 算法 — 单源最短路径（无负权边）
// 时间复杂度：O((V+E)logV) 使用优先队列
function dijkstra(
  n: number,
  edges: [number, number, number][],
  source: number,
): number[] {
  // 构建邻接表
  const graph: Map<number, [number, number][]> = new Map();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v, w] of edges) {
    graph.get(u)!.push([v, w]);
  }

  const dist = new Array(n).fill(Infinity);
  dist[source] = 0;

  // 最小堆 [距离, 节点]
  const heap: [number, number][] = [[0, source]];

  while (heap.length > 0) {
    // 找最小距离（简化版，实际应用优先队列）
    heap.sort((a, b) => a[0] - b[0]);
    const [d, u] = heap.shift()!;

    if (d > dist[u]) continue; // 已找到更短路径，跳过

    for (const [v, w] of graph.get(u)!) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        heap.push([dist[v], v]);
      }
    }
  }

  return dist;
}

// 方法2：Bellman-Ford 算法 — 单源最短路径（支持负权边）
// 时间复杂度：O(VE)
function bellmanFord(
  n: number,
  edges: [number, number, number][],
  source: number,
): number[] {
  const dist = new Array(n).fill(Infinity);
  dist[source] = 0;

  // n-1 轮松弛
  for (let i = 0; i < n - 1; i++) {
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }

  return dist;
}

// 方法3：Floyd-Warshall 算法 — 多源最短路径
// 时间复杂度：O(V³)
function floydWarshall(
  n: number,
  edges: [number, number, number][],
): number[][] {
  const dist: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)),
  );

  for (const [u, v, w] of edges) {
    dist[u][v] = Math.min(dist[u][v], w);
  }

  // k 为中转节点
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

// ============================================================
// 8. 图的广度优先搜索
// ============================================================

// 方法1：BFS 队列 — 推荐
function graphBFS(n: number, edges: number[][], start: number): number[] {
  const graph: Map<number, number[]> = new Map();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }
  for (let i = 0; i < n; i++) {
    graph.get(i)!.sort((a, b) => a - b);
  }

  const visited = new Array(n).fill(false);
  const result: number[] = [];
  const queue: number[] = [start];
  visited[start] = true;

  while (queue.length > 0) {
    const u = queue.shift()!;
    result.push(u);

    for (const v of graph.get(u)!) {
      if (!visited[v]) {
        visited[v] = true;
        queue.push(v);
      }
    }
  }

  return result;
}

// 方法2：BFS 求最短路径（无权图）
function bfsShortestPath(
  n: number,
  edges: number[][],
  start: number,
  end: number,
): number {
  const graph: Map<number, number[]> = new Map();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }

  const visited = new Array(n).fill(false);
  const queue: [number, number][] = [[start, 0]]; // [节点, 距离]
  visited[start] = true;

  while (queue.length > 0) {
    const [u, dist] = queue.shift()!;
    if (u === end) return dist;

    for (const v of graph.get(u)!) {
      if (!visited[v]) {
        visited[v] = true;
        queue.push([v, dist + 1]);
      }
    }
  }

  return -1; // 不可达
}

// ============================================================
// 9. 最小生成树
// ============================================================

// 方法1：Kruskal 算法 — 排序 + 并查集 — 推荐
// 时间复杂度：O(E logE)
function kruskal(
  n: number,
  edges: [number, number, number][],
): { mst: [number, number, number][]; totalWeight: number } {
  // 按边权升序排序
  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  const uf = new UnionFind(n);
  const mst: [number, number, number][] = [];
  let totalWeight = 0;

  for (const [u, v, w] of sorted) {
    if (uf.union(u, v)) {
      mst.push([u, v, w]);
      totalWeight += w;
      if (mst.length === n - 1) break; // 最小生成树有 n-1 条边
    }
  }

  return { mst, totalWeight };
}

// 方法2：Prim 算法 — 从任意节点出发，每次选最小边扩展
// 时间复杂度：O(E logV) 使用优先队列
function prim(
  n: number,
  edges: [number, number, number][],
): { mst: [number, number, number][]; totalWeight: number } {
  // 构建邻接表
  const graph: Map<number, [number, number][]> = new Map();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v, w] of edges) {
    graph.get(u)!.push([v, w]);
    graph.get(v)!.push([u, w]);
  }

  const inMST = new Array(n).fill(false);
  const mst: [number, number, number][] = [];
  let totalWeight = 0;

  // 最小堆 [权重, 起点, 终点]
  const heap: [number, number, number][] = [];

  // 从节点 0 开始
  inMST[0] = true;
  for (const [v, w] of graph.get(0)!) {
    heap.push([w, 0, v]);
  }

  while (heap.length > 0 && mst.length < n - 1) {
    heap.sort((a, b) => a[0] - b[0]);
    const [w, u, v] = heap.shift()!;

    if (inMST[v]) continue;

    inMST[v] = true;
    mst.push([u, v, w]);
    totalWeight += w;

    for (const [next, weight] of graph.get(v)!) {
      if (!inMST[next]) {
        heap.push([weight, v, next]);
      }
    }
  }

  return { mst, totalWeight };
}

// ============================================================
// 10. 网络延迟时间
// LeetCode 743. Network Delay Time
// ============================================================
// 本质：单源最短路径，求所有节点中最晚收到信号的时间

// 方法1：Dijkstra — 推荐
function networkDelayTime(times: number[][], n: number, k: number): number {
  const graph: Map<number, [number, number][]> = new Map();
  for (let i = 1; i <= n; i++) graph.set(i, []);
  for (const [u, v, w] of times) {
    graph.get(u)!.push([v, w]);
  }

  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;

  // 最小堆 [距离, 节点]
  const heap: [number, number][] = [[0, k]];

  while (heap.length > 0) {
    heap.sort((a, b) => a[0] - b[0]);
    const [d, u] = heap.shift()!;

    if (d > dist[u]) continue;

    for (const [v, w] of graph.get(u)!) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        heap.push([dist[v], v]);
      }
    }
  }

  // 找最晚到达时间（排除 dist[0]）
  let maxTime = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1; // 有节点不可达
    maxTime = Math.max(maxTime, dist[i]);
  }

  return maxTime;
}

// 方法2：Floyd-Warshall — 多源最短路径
function networkDelayTimeFloyd(
  times: number[][],
  n: number,
  k: number,
): number {
  const dist: number[][] = Array.from({ length: n + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === j ? 0 : Infinity)),
  );

  for (const [u, v, w] of times) {
    dist[u][v] = w;
  }

  for (let m = 1; m <= n; m++) {
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= n; j++) {
        if (dist[i][m] + dist[m][j] < dist[i][j]) {
          dist[i][j] = dist[i][m] + dist[m][j];
        }
      }
    }
  }

  let maxTime = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[k][i] === Infinity) return -1;
    maxTime = Math.max(maxTime, dist[k][i]);
  }

  return maxTime;
}

// ============================================================
// 11. 最大异或对
// LeetCode 421. Maximum XOR of Two Numbers in an Array
// ============================================================

// 方法1：字典树 — 推荐
// 时间复杂度：O(n * 31)
function findMaximumXOR(nums: number[]): number {
  // 构建二进制字典树
  class BitTrieNode {
    children: (BitTrieNode | null)[] = [null, null]; // 0 和 1
  }

  const root = new BitTrieNode();
  const L = 31; // 32 位整数的最高有效位

  const insert = (num: number) => {
    let node = root;
    for (let i = L; i >= 0; i--) {
      const bit = (num >> i) & 1;
      if (!node.children[bit]) {
        node.children[bit] = new BitTrieNode();
      }
      node = node.children[bit]!;
    }
  };

  const findMaxXor = (num: number): number => {
    let node = root;
    let xorVal = 0;

    for (let i = L; i >= 0; i--) {
      const bit = (num >> i) & 1;
      const opposite = 1 - bit; // 尽量走相反的位

      if (node.children[opposite]) {
        xorVal |= 1 << i;
        node = node.children[opposite]!;
      } else {
        node = node.children[bit]!;
      }
    }

    return xorVal;
  };

  let maxXor = 0;
  for (const num of nums) {
    insert(num);
    maxXor = Math.max(maxXor, findMaxXor(num));
  }

  return maxXor;
}

// 方法2：位运算 + 哈希集合（贪心逐位确定）
function findMaximumXORBit(nums: number[]): number {
  let maxXor = 0;
  let mask = 0;

  for (let i = 31; i >= 0; i--) {
    mask |= 1 << i;
    const prefixes = new Set<number>();

    for (const num of nums) {
      prefixes.add(num & mask);
    }

    // 尝试将当前位设为 1
    const candidate = maxXor | (1 << i);

    for (const prefix of prefixes) {
      if (prefixes.has(prefix ^ candidate)) {
        maxXor = candidate;
        break;
      }
    }
  }

  return maxXor;
}

// 方法3：暴力法 — O(n²)
function findMaximumXORBrute(nums: number[]): number {
  let maxXor = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      maxXor = Math.max(maxXor, nums[i] ^ nums[j]);
    }
  }
  return maxXor;
}

// ============================================================
// 12. 可能的二分法
// LeetCode 886. Possible Bipartition
// ============================================================
// 本质：判断图是否为二分图（能否将节点分成两组，使得所有边都跨组）

// 方法1：并查集 — 推荐
// 思路：每个人和自己的"不喜欢的人"必须在不同的组
// 将每个人的"不喜欢的人"归入同一组
function possibleBipartition(n: number, dislikes: number[][]): boolean {
  // 构建邻接表
  const graph: Map<number, number[]> = new Map();
  for (let i = 1; i <= n; i++) graph.set(i, []);
  for (const [a, b] of dislikes) {
    graph.get(a)!.push(b);
    graph.get(b)!.push(a);
  }

  const uf = new UnionFind(n + 1);

  for (let i = 1; i <= n; i++) {
    const neighbors = graph.get(i)!;
    if (neighbors.length === 0) continue;

    // 将所有不喜欢的人合并到同一组
    for (let j = 1; j < neighbors.length; j++) {
      uf.union(neighbors[0], neighbors[j]);
    }

    // 如果自己和不喜欢的人在同一个组，无法二分
    if (uf.connected(i, neighbors[0])) return false;
  }

  return true;
}

// 方法2：DFS 染色法
function possibleBipartitionDFS(n: number, dislikes: number[][]): boolean {
  const graph: Map<number, number[]> = new Map();
  for (let i = 1; i <= n; i++) graph.set(i, []);
  for (const [a, b] of dislikes) {
    graph.get(a)!.push(b);
    graph.get(b)!.push(a);
  }

  // 0: 未染色, 1: 组A, -1: 组B
  const color = new Array(n + 1).fill(0);

  const dfs = (u: number, c: number): boolean => {
    color[u] = c;
    for (const v of graph.get(u)!) {
      if (color[v] === c) return false; // 相邻节点同色
      if (color[v] === 0 && !dfs(v, -c)) return false;
    }
    return true;
  };

  for (let i = 1; i <= n; i++) {
    if (color[i] === 0 && !dfs(i, 1)) return false;
  }

  return true;
}

// 方法3：BFS 染色法
function possibleBipartitionBFS(n: number, dislikes: number[][]): boolean {
  const graph: Map<number, number[]> = new Map();
  for (let i = 1; i <= n; i++) graph.set(i, []);
  for (const [a, b] of dislikes) {
    graph.get(a)!.push(b);
    graph.get(b)!.push(a);
  }

  const color = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    if (color[i] !== 0) continue;

    const queue: number[] = [i];
    color[i] = 1;

    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of graph.get(u)!) {
        if (color[v] === color[u]) return false;
        if (color[v] === 0) {
          color[v] = -color[u];
          queue.push(v);
        }
      }
    }
  }

  return true;
}

// ============================================================
// 13. 课程表 II（返回拓扑排序结果）
// LeetCode 210. Course Schedule II
// ============================================================

// 方法1：BFS 拓扑排序（Kahn 算法）— 推荐
function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const graph: Map<number, number[]> = new Map();
  const inDegree = new Array(numCourses).fill(0);

  for (let i = 0; i < numCourses; i++) graph.set(i, []);
  for (const [course, prereq] of prerequisites) {
    graph.get(prereq)!.push(course);
    inDegree[course]++;
  }

  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order: number[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);

    for (const v of graph.get(u)!) {
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    }
  }

  return order.length === numCourses ? order : [];
}

// 方法2：DFS 后序遍历逆序
function findOrderDFS(numCourses: number, prerequisites: number[][]): number[] {
  const graph: Map<number, number[]> = new Map();
  for (let i = 0; i < numCourses; i++) graph.set(i, []);
  for (const [course, prereq] of prerequisites) {
    graph.get(prereq)!.push(course);
  }

  const state = new Array(numCourses).fill(0); // 0:未访问 1:访问中 2:完成
  const order: number[] = [];

  const dfs = (u: number): boolean => {
    state[u] = 1;
    for (const v of graph.get(u)!) {
      if (state[v] === 1) return false; // 有环
      if (state[v] === 0 && !dfs(v)) return false;
    }
    state[u] = 2;
    order.push(u); // 后序遍历
    return true;
  };

  for (let i = 0; i < numCourses; i++) {
    if (state[i] === 0 && !dfs(i)) return [];
  }

  return order.reverse(); // 逆后序即为拓扑序
}

// ============================================================
// 14. 字符串集合维护
// LeetCode 208. Implement Trie (Prefix Tree)
// ============================================================
// 字典树（Trie）适用于：前缀匹配、自动补全、拼写检查

// 方法1：基于 Map 的字典树（见上方 Trie 类定义）— 推荐

// 方法2：基于数组的字典树（仅限小写字母）
class TrieArray {
  private children: (number | null)[][];
  private isEnd: boolean[];
  private size: number;

  constructor(maxNodes: number = 10000) {
    this.size = 1; // 根节点为 0
    this.children = Array.from({ length: maxNodes }, () =>
      new Array(26).fill(null),
    );
    this.isEnd = new Array(maxNodes).fill(false);
  }

  insert(word: string): void {
    let node = 0;
    for (const char of word) {
      const idx = char.charCodeAt(0) - 97;
      if (this.children[node][idx] === null) {
        this.children[node][idx] = this.size++;
      }
      node = this.children[node][idx]!;
    }
    this.isEnd[node] = true;
  }

  search(word: string): boolean {
    let node = 0;
    for (const char of word) {
      const idx = char.charCodeAt(0) - 97;
      if (this.children[node][idx] === null) return false;
      node = this.children[node][idx]!;
    }
    return this.isEnd[node];
  }

  startsWith(prefix: string): boolean {
    let node = 0;
    for (const char of prefix) {
      const idx = char.charCodeAt(0) - 97;
      if (this.children[node][idx] === null) return false;
      node = this.children[node][idx]!;
    }
    return true;
  }
}

// 方法3：简单 Set 方案（无前缀匹配功能，仅精确匹配）
class StringSet {
  private set: Set<string>;

  constructor() {
    this.set = new Set();
  }

  add(s: string): void {
    this.set.add(s);
  }

  remove(s: string): boolean {
    return this.set.delete(s);
  }

  contains(s: string): boolean {
    return this.set.has(s);
  }

  startsWith(prefix: string): string[] {
    const result: string[] = [];
    for (const s of this.set) {
      if (s.startsWith(prefix)) result.push(s);
    }
    return result;
  }
}

// ============================================================
// 15. 字符串相似性判断
// ============================================================

// 方法1：编辑距离（Levenshtein Distance）— 推荐
// LeetCode 72. Edit Distance
function minDistance(word1: string, word2: string): number {
  const m = word1.length;
  const n = word2.length;

  // dp[i][j] = word1[0..i-1] 变成 word2[0..j-1] 的最少操作数
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );

  // 初始化
  for (let i = 0; i <= m; i++) dp[i][0] = i; // 删除
  for (let j = 0; j <= n; j++) dp[0][j] = j; // 插入

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // 字符相同，无需操作
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // 删除 word1[i-1]
            dp[i][j - 1], // 插入 word2[j-1]
            dp[i - 1][j - 1], // 替换
          );
      }
    }
  }

  return dp[m][n];
}

// 方法2：编辑距离（空间优化 — 滚动数组）
function minDistanceOptimized(word1: string, word2: string): number {
  const m = word1.length;
  const n = word2.length;

  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let curr = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        curr[j] = prev[j - 1];
      } else {
        curr[j] = 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
      }
    }
    [prev, curr] = [curr, prev];
  }

  return prev[n];
}

// 方法3：汉明距离（仅适用于等长字符串，统计不同字符数）
function hammingDistance(s1: string, s2: string): number {
  if (s1.length !== s2.length) return -1;
  let dist = 0;
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) dist++;
  }
  return dist;
}

// 方法4：最长公共子序列（LCS）相似度
function lcsSimilarity(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n] / Math.max(m, n); // 归一化相似度 [0, 1]
}

// ============================================================
// 16. 集合操作
// ============================================================

// 方法1：并查集（见上方 UnionFind 类定义）— 推荐

// 方法2：基本集合操作（使用 Set）
function setOperations() {
  const a = new Set([1, 2, 3, 4]);
  const b = new Set([3, 4, 5, 6]);

  // 并集
  const union = new Set([...a, ...b]); // {1, 2, 3, 4, 5, 6}

  // 交集
  const intersection = new Set([...a].filter((x) => b.has(x))); // {3, 4}

  // 差集 A - B
  const difference = new Set([...a].filter((x) => !b.has(x))); // {1, 2}

  // 对称差集
  const symmetricDiff = new Set(
    [...a, ...b].filter((x) => !(a.has(x) && b.has(x))),
  ); // {1, 2, 5, 6}

  return { union, intersection, difference, symmetricDiff };
}

// 方法3：并查集的高级应用 — 连通分量计数
function countComponents(n: number, edges: number[][]): number {
  const uf = new UnionFind(n);
  for (const [u, v] of edges) {
    uf.union(u, v);
  }
  return uf.count;
}

// ============================================================
// 17. 账户合并
// LeetCode 721. Accounts Merge
// ============================================================

// 方法1：并查集 + 哈希表 — 推荐
function accountsMerge(accounts: string[][]): string[][] {
  const emailToName: Map<string, string> = new Map();
  const emailToId: Map<string, number> = new Map();
  let id = 0;

  // 为每个邮箱分配唯一 ID，并记录邮箱到姓名的映射
  for (const account of accounts) {
    const name = account[0];
    for (let i = 1; i < account.length; i++) {
      const email = account[i];
      if (!emailToId.has(email)) {
        emailToId.set(email, id++);
        emailToName.set(email, name);
      }
    }
  }

  // 同一个账户的邮箱合并
  const uf = new UnionFind(id);
  for (const account of accounts) {
    const firstEmail = account[1];
    for (let i = 2; i < account.length; i++) {
      uf.union(emailToId.get(firstEmail)!, emailToId.get(account[i])!);
    }
  }

  // 按根节点收集邮箱
  const rootToEmails: Map<number, string[]> = new Map();
  for (const email of emailToId.keys()) {
    const root = uf.find(emailToId.get(email)!);
    if (!rootToEmails.has(root)) {
      rootToEmails.set(root, []);
    }
    rootToEmails.get(root)!.push(email);
  }

  // 构建结果
  const result: string[][] = [];
  for (const [, emails] of rootToEmails) {
    emails.sort();
    const name = emailToName.get(emails[0])!;
    result.push([name, ...emails]);
  }

  return result;
}

// 方法2：DFS 连通分量
function accountsMergeDFS(accounts: string[][]): string[][] {
  // 构建图：同一账户的邮箱互连
  const graph: Map<string, Set<string>> = new Map();
  const emailToName: Map<string, string> = new Map();

  for (const account of accounts) {
    const name = account[0];
    const firstEmail = account[1];

    for (let i = 1; i < account.length; i++) {
      const email = account[i];
      emailToName.set(email, name);
      if (!graph.has(email)) graph.set(email, new Set());

      if (i > 1) {
        graph.get(email)!.add(firstEmail);
        graph.get(firstEmail)!.add(email);
      }
    }
  }

  const visited = new Set<string>();
  const result: string[][] = [];

  for (const email of graph.keys()) {
    if (visited.has(email)) continue;

    // DFS 收集同一连通分量的邮箱
    const component: string[] = [];
    const stack: string[] = [email];

    while (stack.length > 0) {
      const curr = stack.pop()!;
      if (visited.has(curr)) continue;
      visited.add(curr);
      component.push(curr);

      for (const neighbor of graph.get(curr)!) {
        if (!visited.has(neighbor)) stack.push(neighbor);
      }
    }

    component.sort();
    result.push([emailToName.get(email)!, ...component]);
  }

  return result;
}

// ============================================================
// 18. 复制带有随机指针的链表
// LeetCode 138. Copy List with Random Pointer
// ============================================================

// 方法1：哈希表 — 推荐
// 时间复杂度 O(n)，空间复杂度 O(n)
function copyRandomList(head: ListNode | null): ListNode | null {
  if (head === null) return null;

  const map = new Map<ListNode, ListNode>();

  // 第一遍：创建所有新节点
  let curr: ListNode | null = head;
  while (curr) {
    map.set(curr, new ListNode(curr.val));
    curr = curr.next;
  }

  // 第二遍：设置 next 和 random 指针
  curr = head;
  while (curr) {
    const copy = map.get(curr)!;
    copy.next = curr.next ? map.get(curr.next)! : null;
    copy.random = curr.random ? map.get(curr.random)! : null;
    curr = curr.next;
  }

  return map.get(head)!;
}

// 方法2：原地修改（穿插法）— O(1) 额外空间
// 时间复杂度 O(n)，空间复杂度 O(1)
function copyRandomListO1(head: ListNode | null): ListNode | null {
  if (head === null) return null;

  // 第一步：在每个原节点后面插入一个新节点
  let curr: ListNode | null = head;
  while (curr) {
    const copyNode: ListNode = new ListNode(curr.val, curr.next, null);
    curr.next = copyNode;
    curr = copyNode.next;
  }

  // 第二步：设置新节点的 random 指针
  curr = head;
  while (curr) {
    if (curr.random) {
      curr.next!.random = curr.random.next;
    }
    curr = curr.next!.next;
  }

  // 第三步：拆分链表
  const dummy = new ListNode(0);
  let copyCurr: ListNode | null = dummy;
  curr = head;

  while (curr) {
    copyCurr.next = curr.next;
    curr.next = curr.next!.next;
    curr = curr.next;
    copyCurr = copyCurr.next!;
  }

  return dummy.next;
}

// 方法3：递归 + 哈希表
function copyRandomListRecursive(head: ListNode | null): ListNode | null {
  const map = new Map<ListNode, ListNode>();

  const copy = (node: ListNode | null): ListNode | null => {
    if (node === null) return null;
    if (map.has(node)) return map.get(node)!;

    const newNode = new ListNode(node.val);
    map.set(node, newNode);
    newNode.next = copy(node.next);
    newNode.random = copy(node.random);

    return newNode;
  };

  return copy(head);
}

// ============================================================
// 19. 分割链表
// LeetCode 86. Partition List
// ============================================================
// 将链表中小于 x 的节点放在前面，大于等于 x 的节点放在后面，保持相对顺序

// 方法1：双指针（两个子链表）— 推荐
function partition(head: ListNode | null, x: number): ListNode | null {
  // small 链表：存放小于 x 的节点
  const smallDummy = new ListNode(0);
  let small = smallDummy;

  // large 链表：存放大于等于 x 的节点
  const largeDummy = new ListNode(0);
  let large = largeDummy;

  let curr = head;
  while (curr) {
    if (curr.val < x) {
      small.next = curr;
      small = small.next;
    } else {
      large.next = curr;
      large = large.next;
    }
    curr = curr.next;
  }

  // 连接两个链表
  large.next = null; // 防止环
  small.next = largeDummy.next;

  return smallDummy.next;
}

// 方法2：数组辅助法
function partitionByArray(head: ListNode | null, x: number): ListNode | null {
  if (!head) return null;

  const small: number[] = [];
  const large: number[] = [];
  let curr: ListNode | null = head;

  while (curr) {
    if (curr.val < x) small.push(curr.val);
    else large.push(curr.val);
    curr = curr.next;
  }

  const all = [...small, ...large];
  const dummy = new ListNode(0);
  let node = dummy;
  for (const val of all) {
    node.next = new ListNode(val);
    node = node.next;
  }

  return dummy.next;
}

// ============================================================
// 20. 旋转链表
// LeetCode 61. Rotate List
// ============================================================
// 将链表向右旋转 k 个位置

// 方法1：成环 + 断开 — 推荐
// 时间复杂度 O(n)，空间复杂度 O(1)
function rotateRight(head: ListNode | null, k: number): ListNode | null {
  if (!head || !head.next || k === 0) return head;

  // 计算链表长度
  let length = 1;
  let tail = head;
  while (tail.next) {
    length++;
    tail = tail.next;
  }

  // 实际旋转次数
  k = k % length;
  if (k === 0) return head;

  // 成环
  tail.next = head;

  // 找到新尾节点：第 length - k - 1 个节点（0-indexed）
  let newTail = head;
  for (let i = 0; i < length - k - 1; i++) {
    newTail = newTail.next!;
  }

  // 新头节点是新尾的下一个
  const newHead = newTail.next;
  newTail.next = null; // 断开

  return newHead;
}

// 方法2：双指针
function rotateRightTwoPointers(
  head: ListNode | null,
  k: number,
): ListNode | null {
  if (!head || !head.next || k === 0) return head;

  // 计算链表长度
  let length = 0;
  let curr: ListNode | null = head;
  while (curr) {
    length++;
    curr = curr.next;
  }

  k = k % length;
  if (k === 0) return head;

  // 快指针先走 k 步
  let fast: ListNode | null = head;
  for (let i = 0; i < k; i++) {
    fast = fast!.next;
  }

  // 慢指针和快指针同步走
  let slow: ListNode | null = head;
  while (fast!.next) {
    fast = fast!.next;
    slow = slow!.next;
  }

  // slow 的下一个就是新的头节点
  const newHead = slow!.next;
  slow!.next = null;
  fast!.next = head;

  return newHead;
}

// 方法3：栈方法
function rotateRightStack(head: ListNode | null, k: number): ListNode | null {
  if (!head || !head.next || k === 0) return head;

  const stack: ListNode[] = [];
  let curr: ListNode | null = head;
  while (curr) {
    stack.push(curr);
    curr = curr.next;
  }

  k = k % stack.length;
  if (k === 0) return head;

  // 依次将尾部节点移到头部
  const dummy = new ListNode(0, head);
  for (let i = 0; i < k; i++) {
    const last = stack.pop()!;
    const prev = stack[stack.length - 1];
    prev.next = null;
    last.next = dummy.next;
    dummy.next = last;
    stack.unshift(last); // 维护栈
  }

  return dummy.next;
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 关键连接（寻找图中的桥） =====");
console.log(
  criticalConnections(4, [
    [0, 1],
    [1, 2],
    [2, 0],
    [1, 3],
  ]),
); // [[1,3]]

console.log("\n===== 2. 判断负权回路 =====");
// 有负权环：0->1(1), 1->2(-3), 2->0(1)
console.log(
  hasNegativeCycle(3, [
    [0, 1, 1],
    [1, 2, -3],
    [2, 0, 1],
  ]),
); // true
// 无负权环
console.log(
  hasNegativeCycle(3, [
    [0, 1, 1],
    [1, 2, 2],
    [0, 2, 5],
  ]),
); // false

console.log("\n===== 3. 判断图中是否存在环 =====");
// 无向图有环
console.log(
  hasCycleUndirected(3, [
    [0, 1],
    [1, 2],
    [2, 0],
  ]),
); // true
// 无向图无环
console.log(
  hasCycleUndirected(3, [
    [0, 1],
    [1, 2],
  ]),
); // false
// 有向图有环
console.log(
  hasCycleDirected(3, [
    [0, 1],
    [1, 2],
    [2, 0],
  ]),
); // true

console.log("\n===== 4. 图的深度优先搜索 =====");
console.log(
  graphDFS(
    5,
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
    ],
    0,
  ),
); // [0, 1, 3, 4, 2]

console.log("\n===== 5. 克隆图 =====");
const n1 = new GraphNode(1);
const n2 = new GraphNode(2);
const n3 = new GraphNode(3);
const n4 = new GraphNode(4);
n1.neighbors = [n2, n4];
n2.neighbors = [n1, n3];
n3.neighbors = [n2, n4];
n4.neighbors = [n1, n3];
const cloned = cloneGraph(n1);
console.log(cloned?.val); // 1
console.log(cloned?.neighbors.length); // 2

console.log("\n===== 6. 课程表 =====");
console.log(canFinish(2, [[1, 0]])); // true
console.log(
  canFinish(2, [
    [1, 0],
    [0, 1],
  ]),
); // false

console.log("\n===== 7. 最短路径 =====");
const edges7: [number, number, number][] = [
  [0, 1, 4],
  [0, 2, 1],
  [2, 1, 2],
  [1, 3, 1],
  [2, 3, 5],
];
console.log(dijkstra(4, edges7, 0)); // [0, 3, 1, 4]
console.log(bellmanFord(4, edges7, 0)); // [0, 3, 1, 4]

console.log("\n===== 8. 图的广度优先搜索 =====");
console.log(
  graphBFS(
    5,
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
    ],
    0,
  ),
); // [0, 1, 2, 3, 4]

console.log("\n===== 9. 最小生成树 =====");
const edges9: [number, number, number][] = [
  [0, 1, 4],
  [0, 2, 3],
  [1, 2, 1],
  [1, 3, 2],
  [2, 3, 4],
  [3, 4, 2],
  [1, 4, 3],
];
console.log(kruskal(5, edges9));
console.log(prim(5, edges9));

console.log("\n===== 10. 网络延迟时间 =====");
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

console.log("\n===== 11. 最大异或对 =====");
console.log(findMaximumXOR([3, 10, 5, 25, 2, 8])); // 28 (25 ^ 5 = 28)
console.log(findMaximumXORBit([3, 10, 5, 25, 2, 8])); // 28

console.log("\n===== 12. 可能的二分法 =====");
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

console.log("\n===== 13. 课程表 II =====");
console.log(findOrder(2, [[1, 0]])); // [0, 1]
console.log(
  findOrder(4, [
    [1, 0],
    [2, 0],
    [3, 1],
    [3, 2],
  ]),
); // [0,1,2,3] 或 [0,2,1,3]

console.log("\n===== 14. 字符串集合维护 =====");
const trie = new Trie();
trie.insert("apple");
console.log(trie.search("apple")); // true
console.log(trie.search("app")); // false
console.log(trie.startsWith("app")); // true

console.log("\n===== 15. 字符串相似性判断 =====");
console.log(minDistance("horse", "ros")); // 3
console.log(minDistanceOptimized("intention", "execution")); // 5
console.log(hammingDistance("karolin", "kathrin")); // 3
console.log(lcsSimilarity("abcde", "ace")); // 0.6

console.log("\n===== 16. 集合操作 =====");
const sets = setOperations();
console.log([...sets.union]); // [1, 2, 3, 4, 5, 6]
console.log([...sets.intersection]); // [3, 4]
console.log([...sets.difference]); // [1, 2]

console.log("\n===== 17. 账户合并 =====");
console.log(
  accountsMerge([
    ["John", "johnsmith@mail.com", "john00@mail.com"],
    ["John", "johnnybravo@mail.com"],
    ["John", "johnsmith@mail.com", "john_newyork@mail.com"],
    ["Mary", "mary@mail.com"],
  ]),
);

console.log("\n===== 18. 复制带有随机指针的链表 =====");
const n18_1 = new ListNode(7);
const n18_2 = new ListNode(13);
const n18_3 = new ListNode(11);
const n18_4 = new ListNode(10);
const n18_5 = new ListNode(1);
n18_1.next = n18_2;
n18_2.next = n18_3;
n18_3.next = n18_4;
n18_4.next = n18_5;
n18_2.random = n18_1;
n18_3.random = n18_5;
n18_4.random = n18_3;
const copied = copyRandomList(n18_1);
console.log(copied?.val); // 7
console.log(copied?.next?.random?.val); // 7

console.log("\n===== 19. 分割链表 =====");
function createSimpleList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy = new ListNode(0);
  let current: ListNode | null = dummy;
  for (const val of arr) {
    current.next = new ListNode(val);
    current = current.next;
  }
  return dummy.next;
}

function simpleListToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current: ListNode | null = head;
  while (current) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

console.log(
  simpleListToArray(partition(createSimpleList([1, 4, 3, 2, 5, 2]), 3)),
); // [1, 2, 2, 4, 3, 5]

console.log("\n===== 20. 旋转链表 =====");
console.log(
  simpleListToArray(rotateRight(createSimpleList([1, 2, 3, 4, 5]), 2)),
); // [4, 5, 1, 2, 3]
console.log(simpleListToArray(rotateRight(createSimpleList([0, 1, 2]), 4))); // [2, 0, 1]

export {};
