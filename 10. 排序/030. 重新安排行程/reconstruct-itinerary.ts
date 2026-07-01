// ============================================================
// 030. 重新安排行程
// ============================================================
// LeetCode 332. Reconstruct Itinerary
// 给定一批机票 [from, to]，从 "JFK" 出发，使用全部机票，重构字典序最小的行程。
// 必存在合法解。

// 方法1：DFS + Hierholzer 算法（推荐，O(E log E) 时间，O(E) 空间）
// 构建邻接表并按字典序降序排列，便于从末尾 pop 出字典序最小的目的地。
// Hierholzer：用栈不断深入，遇到死路时回退并入栈，最后逆序即为欧拉路径。
function findItinerary(tickets: string[][]): string[] {
  const adj = new Map<string, string[]>();
  for (const [from, to] of tickets) {
    if (!adj.has(from)) adj.set(from, []);
    adj.get(from)!.push(to);
  }
  // 每个邻接表降序排列，pop() 取出字典序最小的目的地
  for (const list of adj.values()) {
    list.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  }

  const stack: string[] = ["JFK"];
  const route: string[] = [];
  while (stack.length > 0) {
    const top = stack[stack.length - 1];
    const list = adj.get(top);
    // 还能继续走，就继续深入
    if (list && list.length > 0) {
      stack.push(list.pop()!);
    } else {
      // 走到死路，回退并入结果
      route.push(stack.pop()!);
    }
  }
  route.reverse();
  return route;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 030. 重新安排行程 =====");

console.log(
  "Hierholzer:",
  findItinerary([
    ["MUC", "LHR"],
    ["JFK", "MUC"],
    ["SFO", "SJC"],
    ["LHR", "SFO"],
  ])
); // 期望 ["JFK","MUC","LHR","SFO","SJC"]

console.log(
  "Hierholzer:",
  findItinerary([
    ["JFK", "SFO"],
    ["JFK", "ATL"],
    ["SFO", "ATL"],
    ["ATL", "JFK"],
    ["ATL", "SFO"],
  ])
); // 期望 ["JFK","ATL","JFK","SFO","ATL","SFO"]

export {};
