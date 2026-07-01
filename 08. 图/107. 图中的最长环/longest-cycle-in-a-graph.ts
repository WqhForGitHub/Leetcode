// LC2360. 图中的最长环
// n 节点有向图, 每节点至多 1 出边, 求最长环长度, 无环返回 -1
// 时间戳 DFS

type EdgeArr = number[];

// 方法1: 时间戳 DFS
function longestCycle1(edges: EdgeArr): number {
  const n = edges.length;
  const time = new Array(n).fill(-1); // 首次访问时间
  let clock = 0;
  let ans = -1;
  for (let i = 0; i < n; i++) {
    if (time[i] !== -1) continue;
    const start = clock;
    let cur = i;
    while (cur !== -1 && time[cur] === -1) {
      time[cur] = clock++;
      cur = edges[cur];
    }
    if (cur !== -1 && time[cur] >= start) {
      ans = Math.max(ans, clock - time[cur]);
    }
  }
  return ans;
}

// 方法2: 入度拓扑消环
function longestCycle2(edges: EdgeArr): number {
  const n = edges.length;
  const indeg = new Array(n).fill(0);
  for (const e of edges) if (e !== -1) indeg[e]++;
  const q: number[] = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  const visited = new Array(n).fill(false);
  while (q.length) {
    const u = q.shift()!;
    visited[u] = true;
    const v = edges[u];
    if (v !== -1) {
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  let ans = -1;
  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    let len = 0,
      cur = i;
    while (!visited[cur]) {
      visited[cur] = true;
      len++;
      cur = edges[cur];
    }
    ans = Math.max(ans, len);
  }
  return ans;
}

// 测试
function test(): void {
  console.log(longestCycle1([3, 3, 4, 2, 3])); // 3
  console.log(longestCycle1([2, -1, 1, 2])); // -1
  console.log(longestCycle2([3, 3, 4, 2, 3])); // 3
  console.log(longestCycle2([2, -1, 1, 2])); // -1
}
test();

export {};
