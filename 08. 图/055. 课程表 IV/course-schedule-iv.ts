// ============================================================
// 055. 课程表 IV
// ============================================================
// LeetCode 1462. Course Schedule IV
// numCourses 门课，prerequisites[i]=[a,b] 表示 a 是 b 的先修课。
// queries[i]=[u,v] 询问 u 是否（直接或间接）是 v 的先修课。返回布尔数组。
// 时间复杂度：拓扑+位集合 O(n + E + n^2/word)；Floyd O(n^3)

// ============================================================
// 方法1：拓扑排序 + 位集合传递闭包（推荐）
// 时间复杂度：O(n + E + n^2)（位运算加速），空间复杂度：O(n^2 / 64)
// ============================================================
function checkIfPrerequisiteTopo(
  numCourses: number,
  prerequisites: number[][],
  queries: number[][],
): boolean[] {
  // 建邻接表与入度
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  const indeg = new Array(numCourses).fill(0);
  for (const [u, v] of prerequisites) {
    adj[u].push(v);
    indeg[v]++;
  }

  // isPre[u] 是位集合，记录 u 的所有后继（含间接）
  const isPre: bigint[] = new Array(numCourses).fill(0n);
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (indeg[i] === 0) queue.push(i);
  }

  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const v of adj[u]) {
      // v 的先修集合包含 u 本身，以及 u 的所有先修
      isPre[v] |= isPre[u];
      isPre[v] |= (1n << BigInt(u));
      indeg[v]--;
      if (indeg[v] === 0) queue.push(v);
    }
  }

  // 回答查询：u 是否为 v 的先修 -> 检查 isPre[v] 第 u 位
  return queries.map(([u, v]) => {
    return (isPre[v] & (1n << BigInt(u))) !== 0n;
  });
}

// ============================================================
// 方法2：Floyd 传递闭包
// 时间复杂度：O(n^3)，空间复杂度：O(n^2)
// ============================================================
function checkIfPrerequisiteFloyd(
  numCourses: number,
  prerequisites: number[][],
  queries: number[][],
): boolean[] {
  const reach: boolean[][] = Array.from({ length: numCourses }, () => new Array(numCourses).fill(false));
  for (const [u, v] of prerequisites) reach[u][v] = true;
  // Floyd：reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j])
  for (let k = 0; k < numCourses; k++) {
    for (let i = 0; i < numCourses; i++) {
      if (!reach[i][k]) continue;
      for (let j = 0; j < numCourses; j++) {
        if (reach[k][j]) reach[i][j] = true;
      }
    }
  }
  return queries.map(([u, v]) => reach[u][v]);
}

// 统一入口
function checkIfPrerequisite(
  numCourses: number,
  prerequisites: number[][],
  queries: number[][],
): boolean[] {
  return checkIfPrerequisiteTopo(numCourses, prerequisites, queries);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 055. 课程表 IV =====");
// 测试1: numCourses=2, pre=[[1,0]], queries=[[0,1],[1,0]] -> [false, true]
// 注意：prerequisites[a,b] 表示 a 是 b 的先修，即 a->b
console.log(checkIfPrerequisite(2, [[1, 0]], [[0, 1], [1, 0]])); // 期望 [false, true]
console.log(checkIfPrerequisiteFloyd(2, [[1, 0]], [[0, 1], [1, 0]])); // 期望 [false, true]
// 测试2: numCourses=2, pre=[], queries=[[1,0],[0,1]] -> [false, false]
console.log(checkIfPrerequisite(2, [], [[1, 0], [0, 1]])); // 期望 [false, false]
// 测试3: numCourses=3, pre=[[1,2],[1,0],[2,0]], queries=[[1,0],[1,2]] -> [true, true]
console.log(checkIfPrerequisite(3, [[1, 2], [1, 0], [2, 0]], [[1, 0], [1, 2]])); // 期望 [true, true]
console.log(checkIfPrerequisiteFloyd(3, [[1, 2], [1, 0], [2, 0]], [[1, 0], [1, 2]])); // 期望 [true, true]

export {};
