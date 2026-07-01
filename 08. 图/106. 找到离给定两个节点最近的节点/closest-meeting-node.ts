// LC2359. 找到离给定两个节点最近的节点
// n 节点有向图, 每节点至多 1 出边, 给定 node1, node2
// 求 max(dist1[i], dist2[i]) 最小的节点 i, 下标最小
// 两次 BFS 求距离 + 枚举

type EdgeArr = number[];

// 方法1: 两次 BFS
function closestMeetingNode1(edges: EdgeArr, node1: number, node2: number): number {
  function bfs(start: number): number[] {
    const dist = new Array(edges.length).fill(Infinity);
    let d = 0,
      cur = start;
    while (cur !== -1 && dist[cur] === Infinity) {
      dist[cur] = d++;
      cur = edges[cur];
    }
    return dist;
  }
  const d1 = bfs(node1),
    d2 = bfs(node2);
  let ans = -1,
    best = Infinity;
  for (let i = 0; i < edges.length; i++) {
    const m = Math.max(d1[i], d2[i]);
    if (m < best) {
      best = m;
      ans = i;
    }
  }
  return ans;
}

// 方法2: DFS 标记距离
function closestMeetingNode2(edges: EdgeArr, node1: number, node2: number): number {
  function getDist(start: number): number[] {
    const dist = new Array(edges.length).fill(-1);
    let d = 0,
      cur = start;
    while (cur !== -1 && dist[cur] === -1) {
      dist[cur] = d++;
      cur = edges[cur];
    }
    return dist;
  }
  const d1 = getDist(node1),
    d2 = getDist(node2);
  let ans = -1,
    best = Infinity;
  for (let i = 0; i < edges.length; i++) {
    if (d1[i] !== -1 && d2[i] !== -1) {
      const m = Math.max(d1[i], d2[i]);
      if (m < best) {
        best = m;
        ans = i;
      }
    }
  }
  return ans;
}

// 测试
function test(): void {
  console.log(closestMeetingNode1([2, 2, 3, -1], 0, 1)); // 2
  console.log(closestMeetingNode1([1, 2, -1], 0, 2)); // 2
  console.log(closestMeetingNode2([2, 2, 3, -1], 0, 1)); // 2
  console.log(closestMeetingNode2([1, 2, -1], 0, 2)); // 2
}
test();

export {};
