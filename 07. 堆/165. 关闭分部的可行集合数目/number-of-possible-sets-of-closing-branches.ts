// ============================================================
// 165. 关闭分部的可行集合数目
// ============================================================
// LeetCode 2959. Number of Possible Sets of Closing Branches
// 给定无向完全图，选一些节点关闭，使剩余节点间最短路都不超过 maxDistance。
// 时间复杂度：O(2^n * n^2)，空间复杂度：O(n^2)

// 方法1：枚举子集 + Floyd
function numberOfSets(n: number, maxDistance: number, roads: number[][]): number {
  let result = 0;
  // 枚举所有子集
  for (let mask = 0; mask < 1 << n; mask++) {
    // 建图
    const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(Infinity));
    for (let i = 0; i < n; i++) dist[i][i] = 0;
    for (const [u, v, w] of roads) {
      if (mask & (1 << u) && mask & (1 << v)) {
        dist[u][v] = Math.min(dist[u][v], w);
        dist[v][u] = Math.min(dist[v][u], w);
      }
    }
    // Floyd
    for (let k = 0; k < n; k++) {
      if (!(mask & (1 << k))) continue;
      for (let i = 0; i < n; i++) {
        if (!(mask & (1 << i))) continue;
        for (let j = 0; j < n; j++) {
          if (!(mask & (1 << j))) continue;
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
          }
        }
      }
    }
    // 检查
    let valid = true;
    for (let i = 0; i < n && valid; i++) {
      if (!(mask & (1 << i))) continue;
      for (let j = 0; j < n; j++) {
        if (!(mask & (1 << j))) continue;
        if (dist[i][j] > maxDistance) {
          valid = false;
          break;
        }
      }
    }
    if (valid) result++;
  }
  return result;
}

// 方法2：枚举子集 + Dijkstra
function numberOfSetsDijkstra(n: number, maxDistance: number, roads: number[][]): number {
  const adjList: Map<number, Array<[number, number]>> = new Map();
  for (let i = 0; i < n; i++) adjList.set(i, []);
  for (const [u, v, w] of roads) {
    adjList.get(u)!.push([v, w]);
    adjList.get(v)!.push([u, w]);
  }
  let result = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    let valid = true;
    for (let i = 0; i < n && valid; i++) {
      if (!(mask & (1 << i))) continue;
      const dist: number[] = new Array(n).fill(Infinity);
      dist[i] = 0;
      const heap: Array<[number, number]> = [[0, i]];
      while (heap.length > 0) {
        let minIdx = 0;
        for (let j = 1; j < heap.length; j++) {
          if (heap[j][0] < heap[minIdx][0]) minIdx = j;
        }
        const [d, u] = heap[minIdx];
        heap.splice(minIdx, 1);
        if (d > dist[u]) continue;
        for (const [v, w] of adjList.get(u) ?? []) {
          if (!(mask & (1 << v))) continue;
          if (d + w < dist[v]) {
            dist[v] = d + w;
            heap.push([d + w, v]);
          }
        }
      }
      for (let j = 0; j < n; j++) {
        if (!(mask & (1 << j))) continue;
        if (dist[j] > maxDistance) {
          valid = false;
          break;
        }
      }
    }
    if (valid) result++;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 165. 关闭分部的可行集合数目 =====");
console.log(
  "Floyd:",
  numberOfSets(3, 5, [
    [0, 1, 2],
    [1, 2, 10],
    [0, 2, 10],
  ]),
); // 期望 5
console.log(
  "Floyd:",
  numberOfSets(3, 5, [
    [0, 1, 20],
    [0, 1, 10],
    [1, 2, 2],
    [0, 2, 2],
  ]),
); // 期望 7

export {};
