// LC2316. 统计无向图中无法互相到达点对数
// n 节点无向图 edges, 求无法互相到达的点对数
// 并查集求连通块大小 + 组合数

type EdgeList = number[][];

// 方法1: 并查集 + 组合数
function countPairs1(n: number, edges: EdgeList): number {
  const parent = new Array(n).fill(0).map((_, i) => i);
  const size = new Array(n).fill(1);
  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(x: number, y: number): void {
    const rx = find(x),
      ry = find(y);
    if (rx === ry) return;
    if (size[rx] < size[ry]) {
      parent[rx] = ry;
      size[ry] += size[rx];
    } else {
      parent[ry] = rx;
      size[rx] += size[ry];
    }
  }
  for (const [u, v] of edges) union(u, v);
  const seen = new Set<number>();
  let total = 0;
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const r = find(i);
    if (seen.has(r)) continue;
    seen.add(r);
    total += acc * size[r];
    acc += size[r];
  }
  return total;
}

// 方法2: BFS 求连通块
function countPairs2(n: number, edges: EdgeList): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const visited = new Array(n).fill(false);
  const sizes: number[] = [];
  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    let cnt = 0;
    const q: number[] = [i];
    visited[i] = true;
    while (q.length) {
      const u = q.shift()!;
      cnt++;
      for (const v of adj[u]) {
        if (!visited[v]) {
          visited[v] = true;
          q.push(v);
        }
      }
    }
    sizes.push(cnt);
  }
  let total = 0,
    acc = 0;
  for (const s of sizes) {
    total += acc * s;
    acc += s;
  }
  return total;
}

// 测试
function test(): void {
  console.log(
    countPairs1(3, [
      [0, 1],
      [0, 2],
      [1, 2],
    ]),
  ); // 0
  console.log(
    countPairs1(7, [
      [0, 2],
      [0, 5],
      [2, 4],
      [1, 6],
      [5, 4],
    ]),
  ); // 14
  console.log(
    countPairs2(3, [
      [0, 1],
      [0, 2],
      [1, 2],
    ]),
  ); // 0
  console.log(
    countPairs2(7, [
      [0, 2],
      [0, 5],
      [2, 4],
      [1, 6],
      [5, 4],
    ]),
  ); // 14
}
test();

export {};
