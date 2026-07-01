// ============================================================
// 010. 重新安排行程
// ============================================================
// LeetCode 332. Reconstruct Itinerary
// 机票 [from,to]，从 "JFK" 出发，使用所有机票，若多种取字典序最小，返回行程。
// 时间复杂度：O(E log E)，空间复杂度：O(V + E)

// 方法1：Hierholzer 算法 + 邻接表排序（推荐）
// 对每个起点的邻居按字典序降序排列，便于用 pop() 取最小边；
// DFS 贪心走最小边，走不动时入栈，最后逆序即为欧拉路径。
function findItinerary(tickets: Array<[string, string]>): string[] {
  const graph = new Map<string, string[]>();
  for (const [from, to] of tickets) {
    if (!graph.has(from)) graph.set(from, []);
    graph.get(from)!.push(to);
  }
  // 每个邻接表按字典序降序，pop() 取最小
  for (const list of graph.values()) list.sort().reverse();
  const path: string[] = [];
  const dfs = (u: string): void => {
    const list = graph.get(u);
    while (list && list.length > 0) {
      const v = list.pop()!; // 取字典序最小的
      dfs(v);
    }
    path.push(u); // 后序入栈
  };
  dfs("JFK");
  return path.reverse();
}

// 方法2：Hierholzer + 优先队列（用排序数组模拟小顶堆）
// 逻辑等价于方法1，体现优先队列版本思路：每次取字典序最小的目的机场。
function findItineraryPQ(tickets: Array<[string, string]>): string[] {
  const graph = new Map<string, string[]>();
  for (const [from, to] of tickets) {
    if (!graph.has(from)) graph.set(from, []);
    graph.get(from)!.push(to);
  }
  // 降序排列，pop() 取最小，等价于小顶堆逐个弹出
  for (const list of graph.values()) {
    list.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  }
  const path: string[] = [];
  const dfs = (u: string): void => {
    const list = graph.get(u);
    while (list && list.length > 0) {
      const v = list.pop()!;
      dfs(v);
    }
    path.push(u);
  };
  dfs("JFK");
  return path.reverse();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 010. 重新安排行程 =====");
console.log(
  "Hierholzer:",
  findItinerary([
    ["MUC", "LHR"],
    ["JFK", "MUC"],
    ["SFO", "SJC"],
    ["LHR", "SFO"],
  ]),
);
// 期望 ["JFK","MUC","LHR","SFO","SJC"]
console.log(
  "PQ:",
  findItineraryPQ([
    ["MUC", "LHR"],
    ["JFK", "MUC"],
    ["SFO", "SJC"],
    ["LHR", "SFO"],
  ]),
);
// 期望 ["JFK","MUC","LHR","SFO","SJC"]
console.log(
  "Hierholzer:",
  findItinerary([
    ["JFK", "SFO"],
    ["JFK", "ATL"],
    ["SFO", "ATL"],
    ["ATL", "JFK"],
    ["ATL", "SFO"],
  ]),
);
// 期望 ["JFK","ATL","JFK","SFO","ATL","SFO"]
console.log(
  "PQ:",
  findItineraryPQ([
    ["JFK", "SFO"],
    ["JFK", "ATL"],
    ["SFO", "ATL"],
    ["ATL", "JFK"],
    ["ATL", "SFO"],
  ]),
);
// 期望 ["JFK","ATL","JFK","SFO","ATL","SFO"]

export {};
