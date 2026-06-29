// ============================================================
// 009. 重新安排行程
// ============================================================
// LeetCode 332. Reconstruct Itinerary
// 给定一份航线票，从 JFK 出发，按字典序返回使用所有票的行程。
// 时间复杂度：O(E log E)，空间复杂度：O(E)

// 方法1：Hierholzer 算法（后序 DFS）（推荐）
function findItinerary(tickets: string[][]): string[] {
  const graph = new Map<string, string[]>();
  for (const [from, to] of tickets) {
    if (!graph.has(from)) graph.set(from, []);
    graph.get(from)!.push(to);
  }
  for (const [, list] of graph) list.sort((a, b) => (a < b ? -1 : 1));
  const result: string[] = [];
  const dfs = (node: string): void => {
    const list = graph.get(node);
    while (list !== undefined && list.length > 0) {
      const next = list.shift()!;
      dfs(next);
    }
    result.push(node);
  };
  dfs("JFK");
  return result.reverse();
}

// 方法2：优先队列（最小堆）做邻接表
function findItineraryHeap(tickets: string[][]): string[] {
  class MinHeapStr {
    private heap: string[] = [];
    get size(): number {
      return this.heap.length;
    }
    push(v: string): void {
      this.heap.push(v);
      let i = this.heap.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (this.heap[i] < this.heap[p]) {
          [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
          i = p;
        } else break;
      }
    }
    pop(): string | undefined {
      if (this.heap.length === 0) return undefined;
      const top = this.heap[0];
      const last = this.heap.pop()!;
      if (this.heap.length > 0) {
        this.heap[0] = last;
        let i = 0;
        while (true) {
          let s = i;
          const l = 2 * i + 1;
          const r = 2 * i + 2;
          if (l < this.heap.length && this.heap[l] < this.heap[s]) s = l;
          if (r < this.heap.length && this.heap[r] < this.heap[s]) s = r;
          if (s !== i) {
            [this.heap[i], this.heap[s]] = [this.heap[s], this.heap[i]];
            i = s;
          } else break;
        }
      }
      return top;
    }
  }
  const graph = new Map<string, MinHeapStr>();
  for (const [from, to] of tickets) {
    if (!graph.has(from)) graph.set(from, new MinHeapStr());
    graph.get(from)!.push(to);
  }
  const result: string[] = [];
  const dfs = (node: string): void => {
    const h = graph.get(node);
    while (h !== undefined && h.size > 0) {
      dfs(h.pop()!);
    }
    result.push(node);
  };
  dfs("JFK");
  return result.reverse();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 009. 重新安排行程 =====");
console.log("DFS:", findItinerary([["MUC", "LHR"], ["JFK", "MUC"], ["SFO", "SJC"], ["LHR", "SFO"]]));
// 期望 ["JFK","MUC","LHR","SFO","SJC"]
console.log("堆:", findItineraryHeap([["JFK", "SFO"], ["JFK", "ATL"], ["SFO", "ATL"], ["ATL", "JFK"], ["ATL", "SFO"]]));
// 期望 ["JFK","ATL","JFK","SFO","ATL","SFO"]

export {};
