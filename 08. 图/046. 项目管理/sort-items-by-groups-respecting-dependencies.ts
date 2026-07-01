// ============================================================
// 046. 项目管理
// ============================================================
// LeetCode 1203. Sort Items by Groups Respecting Dependencies
// n 项目，m 组，group[i]（-1 的项目自成一独立组），beforeItems 依赖。
// 返回合法排序使组间组内均满足依赖，否则 []。
// 思路：两层拓扑排序——先对每组内项目做拓扑，再对组间做拓扑。
// 时间复杂度：O(n + m + E)，空间复杂度：O(n + m + E)

// 通用拓扑排序：返回合法序，有环返回 null
function topologicalSort(
  nodes: number[],
  graph: Map<number, number[]>,
  indegree: Map<number, number>,
): number[] | null {
  const queue: number[] = [];
  for (const node of nodes) {
    if ((indegree.get(node) ?? 0) === 0) queue.push(node);
  }
  const result: number[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    result.push(u);
    for (const v of graph.get(u) ?? []) {
      indegree.set(v, (indegree.get(v) ?? 0) - 1);
      if ((indegree.get(v) ?? 0) === 0) queue.push(v);
    }
  }
  return result.length === nodes.length ? result : null;
}

// 方法1：两层拓扑排序（推荐）
function sortItems(n: number, m: number, group: number[], beforeItems: number[][]): number[] {
  // 1. 给 group=-1 的项目分配独立组（用 m 起始的编号，避免与已有组冲突）
  const groupOf: number[] = new Array(n);
  let groupId = m;
  for (let i = 0; i < n; i++) {
    if (group[i] === -1) {
      groupOf[i] = groupId;
      groupId++;
    } else {
      groupOf[i] = group[i];
    }
  }

  // 2. 构建组内项目依赖图 + 组间依赖图
  const itemGraph: Map<number, number[]> = new Map();
  const itemIndegree: Map<number, number> = new Map();
  const groupGraph: Map<number, number[]> = new Map();
  const groupIndegree: Map<number, number> = new Map();
  const allGroups: Set<number> = new Set();

  for (let i = 0; i < n; i++) {
    itemGraph.set(i, []);
    itemIndegree.set(i, 0);
    allGroups.add(groupOf[i]);
  }
  for (const g of allGroups) {
    groupGraph.set(g, []);
    groupIndegree.set(g, 0);
  }

  const groupItems: Map<number, number[]> = new Map();
  for (let i = 0; i < n; i++) {
    if (!groupItems.has(groupOf[i])) groupItems.set(groupOf[i], []);
    groupItems.get(groupOf[i])!.push(i);
  }

  // 处理依赖：同组建 item 边，跨组建 group 边
  for (let i = 0; i < n; i++) {
    for (const before of beforeItems[i]) {
      const gBefore = groupOf[before];
      const gAfter = groupOf[i];
      if (gBefore === gAfter) {
        // 同组：before -> i
        itemGraph.get(before)!.push(i);
        itemIndegree.set(i, (itemIndegree.get(i) ?? 0) + 1);
      } else {
        // 跨组：gBefore -> gAfter（去重）
        const arr = groupGraph.get(gBefore)!;
        if (!arr.includes(gAfter)) {
          arr.push(gAfter);
          groupIndegree.set(gAfter, (groupIndegree.get(gAfter) ?? 0) + 1);
        }
      }
    }
  }

  // 3. 对每个组内做拓扑
  const sortedItemsInGroup: Map<number, number[]> = new Map();
  for (const g of allGroups) {
    const items = groupItems.get(g)!;
    // 只拷贝组内相关入度（已被全局计数）
    const localIndegree = new Map<number, number>();
    for (const it of items) localIndegree.set(it, itemIndegree.get(it) ?? 0);
    const localGraph = new Map<number, number[]>();
    for (const it of items) {
      localGraph.set(
        it,
        (itemGraph.get(it) ?? []).filter((v) => groupOf[v] === g),
      );
    }
    const sorted = topologicalSort(items, localGraph, localIndegree);
    if (sorted === null) return [];
    sortedItemsInGroup.set(g, sorted);
  }

  // 4. 对组间做拓扑
  const groupOrder = topologicalSort([...allGroups], groupGraph, new Map(groupIndegree));
  if (groupOrder === null) return [];

  // 5. 按组序拼接组内拓扑结果
  const result: number[] = [];
  for (const g of groupOrder) {
    result.push(...(sortedItemsInGroup.get(g) ?? []));
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 046. 项目管理 =====");
console.log(
  "用例1:",
  JSON.stringify(
    sortItems(8, 2, [-1, -1, 1, 0, 0, 1, 0, -1], [[], [6], [5], [6], [3, 6], [], [], []]),
  ),
); // 期望一种合法序，例如 [6,3,4,1,5,2,0,7]
console.log("用例2:", JSON.stringify(sortItems(2, 1, [0, 0], [[1], [0]]))); // 期望 []（同组内 0->1 与 1->0 形成环）

export {};
