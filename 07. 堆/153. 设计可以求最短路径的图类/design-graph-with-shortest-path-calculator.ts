// ============================================================
// 153. 设计可以求最短路径的图类
// ============================================================
// LeetCode 2642. Design Graph With Shortest Path Calculator
// 支持添加边和查询两节点间最短路径。
// 时间复杂度：addEdge O(1)，shortestPath O(E log V)

// 方法1：Dijkstra + 最小堆
class Graph {
  private adjList: Map<number, Array<[number, number]>>;

  constructor(n: number, edges: number[][]) {
    this.adjList = new Map();
    for (let i = 0; i < n; i++) this.adjList.set(i, []);
    for (const [from, to, cost] of edges) {
      this.adjList.get(from)!.push([to, cost]);
    }
  }

  addEdge(edge: number[]): void {
    const [from, to, cost] = edge;
    this.adjList.get(from)!.push([to, cost]);
  }

  shortestPath(node1: number, node2: number): number {
    const dist: Map<number, number> = new Map();
    dist.set(node1, 0);
    const heap: Array<[number, number]> = [[0, node1]]; // [cost, node]
    const siftUp = (i: number): void => {
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (heap[i][0] < heap[p][0]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
        else break;
      }
    };
    const siftDown = (): void => {
      let i = 0;
      const len = heap.length;
      while (true) {
        let s = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < len && heap[l][0] < heap[s][0]) s = l;
        if (r < len && heap[r][0] < heap[s][0]) s = r;
        if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
        else break;
      }
    };
    while (heap.length > 0) {
      const [cost, node] = heap[0];
      heap[0] = heap[heap.length - 1];
      heap.pop();
      if (heap.length > 0) siftDown();
      if (node === node2) return cost;
      if (cost > (dist.get(node) ?? Infinity)) continue;
      for (const [neighbor, edgeCost] of this.adjList.get(node) ?? []) {
        const newCost = cost + edgeCost;
        if (newCost < (dist.get(neighbor) ?? Infinity)) {
          dist.set(neighbor, newCost);
          heap.push([newCost, neighbor]);
          siftUp(heap.length - 1);
        }
      }
    }
    return -1;
  }
}

// 方法2：Floyd（适合小图，频繁查询）
class GraphFloyd {
  private n: number;
  private dist: number[][];

  constructor(n: number, edges: number[][]) {
    this.n = n;
    this.dist = Array.from({ length: n }, () => new Array(n).fill(Infinity));
    for (let i = 0; i < n; i++) this.dist[i][i] = 0;
    for (const [from, to, cost] of edges) {
      this.dist[from][to] = Math.min(this.dist[from][to], cost);
    }
    this.floyd();
  }

  private floyd(): void {
    for (let k = 0; k < this.n; k++) {
      for (let i = 0; i < this.n; i++) {
        for (let j = 0; j < this.n; j++) {
          if (this.dist[i][k] + this.dist[k][j] < this.dist[i][j]) {
            this.dist[i][j] = this.dist[i][k] + this.dist[k][j];
          }
        }
      }
    }
  }

  addEdge(edge: number[]): void {
    const [from, to, cost] = edge;
    if (cost >= this.dist[from][to]) return;
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (this.dist[i][from] + cost + this.dist[to][j] < this.dist[i][j]) {
          this.dist[i][j] = this.dist[i][from] + cost + this.dist[to][j];
        }
      }
    }
  }

  shortestPath(node1: number, node2: number): number {
    return this.dist[node1][node2] === Infinity ? -1 : this.dist[node1][node2];
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 153. 设计可以求最短路径的图类 =====");
const g = new Graph(4, [[0, 2, 5], [0, 1, 2], [1, 2, 1], [3, 0, 3]]);
console.log("shortestPath(3,2):", g.shortestPath(3, 2)); // 6
g.addEdge([1, 3, 4]);
console.log("shortestPath(0,3):", g.shortestPath(0, 3)); // 6

export {};
