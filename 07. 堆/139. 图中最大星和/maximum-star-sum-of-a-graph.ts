// ============================================================
// 139. 图中最大星和
// ============================================================
// LeetCode 2497. Maximum Star Sum of a Graph
// 给定图，选一个中心节点和最多 k 个邻居，使节点值之和最大。
// 时间复杂度：O(E log V)，空间复杂度：O(V + E)

// 方法1：最大堆
function maxStarSum(vals: number[], edges: number[][], k: number): number {
  const n = vals.length;
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    graph[a].push(b);
    graph[b].push(a);
  }
  let result = -Infinity;
  for (let i = 0; i < n; i++) {
    // 最大堆，选正数邻居
    const heap: number[] = [];
    for (const neighbor of graph[i]) {
      if (vals[neighbor] > 0) {
        heap.push(vals[neighbor]);
        let idx = heap.length - 1;
        while (idx > 0) {
          const p = (idx - 1) >> 1;
          if (heap[idx] > heap[p]) { [heap[idx], heap[p]] = [heap[p], heap[idx]]; idx = p; }
          else break;
        }
      }
    }
    let sum = vals[i];
    let count = 0;
    while (heap.length > 0 && count < k) {
      sum += heap[0];
      count++;
      heap[0] = heap[heap.length - 1];
      heap.pop();
      if (heap.length > 0) {
        let idx = 0;
        const len = heap.length;
        while (true) {
          let s = idx;
          const l = 2 * idx + 1, r = 2 * idx + 2;
          if (l < len && heap[l] > heap[s]) s = l;
          if (r < len && heap[r] > heap[s]) s = r;
          if (s !== idx) { [heap[idx], heap[s]] = [heap[s], heap[idx]]; idx = s; }
          else break;
        }
      }
    }
    result = Math.max(result, sum);
  }
  return result;
}

// 方法2：排序
function maxStarSumSort(vals: number[], edges: number[][], k: number): number {
  const n = vals.length;
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    graph[a].push(b);
    graph[b].push(a);
  }
  let result = -Infinity;
  for (let i = 0; i < n; i++) {
    const neighbors = graph[i].map(j => vals[j]).filter(v => v > 0).sort((a, b) => b - a);
    let sum = vals[i];
    for (let j = 0; j < Math.min(k, neighbors.length); j++) {
      sum += neighbors[j];
    }
    result = Math.max(result, sum);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 139. 图中最大星和 =====");
console.log("堆:", maxStarSum([1, 2, 3, 4, 10, -10, -20], [[0, 1], [1, 2], [1, 3], [3, 4], [3, 5], [3, 6]], 2)); // 期望 16
console.log("排序:", maxStarSumSort([-5], [], 1)); // 期望 -5

export {};
