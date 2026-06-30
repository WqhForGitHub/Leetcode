// ============================================================
// 015. 省份数量
// ============================================================
// LeetCode 547. Number of Provinces
// isConnected[i][j]=1 表示城市 i 与 j 直接相连，返回省份数（连通分量数）
// 时间复杂度：并查集 O(n^2·α(n))；DFS/BFS O(n^2)；空间 O(n)

// 方法1：并查集（推荐）
function findCircleNum(isConnected: number[][]): number {
  const n = isConnected.length;
  const parent: number[] = new Array(n);
  for (let i = 0; i < n; i++) parent[i] = i;

  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const union = (x: number, y: number): void => {
    const rx = find(x);
    const ry = find(y);
    if (rx !== ry) parent[rx] = ry;
  };

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i][j] === 1) union(i, j);
    }
  }
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (parent[i] === i) count++;
  }
  return count;
}

// 方法2：DFS
function findCircleNumDFS(isConnected: number[][]): number {
  const n = isConnected.length;
  const visited: boolean[] = new Array(n).fill(false);
  let count = 0;

  const dfs = (u: number): void => {
    for (let v = 0; v < n; v++) {
      if (isConnected[u][v] === 1 && !visited[v]) {
        visited[v] = true;
        dfs(v);
      }
    }
  };

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      visited[i] = true;
      dfs(i);
      count++;
    }
  }
  return count;
}

// 方法3：BFS
function findCircleNumBFS(isConnected: number[][]): number {
  const n = isConnected.length;
  const visited: boolean[] = new Array(n).fill(false);
  let count = 0;

  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    count++;
    const queue: number[] = [i];
    visited[i] = true;
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (let v = 0; v < n; v++) {
        if (isConnected[u][v] === 1 && !visited[v]) {
          visited[v] = true;
          queue.push(v);
        }
      }
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 015. 省份数量 =====");
const c1 = [
  [1, 1, 0],
  [1, 1, 0],
  [0, 0, 1],
];
console.log(findCircleNum(c1)); // 2
console.log(findCircleNumDFS(c1)); // 2
console.log(findCircleNumBFS(c1)); // 2

const c2 = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];
console.log(findCircleNum(c2)); // 3
console.log(findCircleNumDFS(c2)); // 3
console.log(findCircleNumBFS(c2)); // 3

export {};
