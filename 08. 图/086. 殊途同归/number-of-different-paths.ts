// ============================================================
// 086. 殊途同归
// ============================================================
// 自定义题。n 个节点无向图 edges，求从 0 到 n-1 的简单路径数 mod 1e9+7。
// DFS 回溯，visited 标记避免重复访问。
// 时间复杂度：O(指数级)，空间复杂度：O(n + m)

const MOD_86: number = 1e9 + 7;

function countPaths(n: number, edges: number[][]): number {
  // 建图
  const g: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    g[u].push(v);
    g[v].push(u);
  }
  const visited: boolean[] = new Array(n).fill(false);
  visited[0] = true;
  let ans: number = 0;
  const dfs = (u: number): void => {
    if (u === n - 1) {
      ans = (ans + 1) % MOD_86;
      return;
    }
    for (const v of g[u]) {
      if (!visited[v]) {
        visited[v] = true;
        dfs(v);
        visited[v] = false;
      }
    }
  };
  dfs(0);
  return ans;
}

// 方法1：DFS 回溯统计简单路径数
function f1(n: number, edges: number[][]): number {
  return countPaths(n, edges);
}

// 方法2：DFS 回溯 + Set 记录访问节点
function f2(n: number, edges: number[][]): number {
  const g: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    g[u].push(v);
    g[v].push(u);
  }
  const seen: Set<number> = new Set([0]);
  let ans: number = 0;
  const dfs = (u: number): void => {
    if (u === n - 1) {
      ans = (ans + 1) % MOD_86;
      return;
    }
    for (const v of g[u]) {
      if (!seen.has(v)) {
        seen.add(v);
        dfs(v);
        seen.delete(v);
      }
    }
  };
  dfs(0);
  return ans;
}

console.log("===== 086. 殊途同归 =====");
// 测试
console.log(
  f1(5, [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
  ]),
); // 2
console.log(
  f2(5, [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
  ]),
); // 2
console.log(
  f1(3, [
    [0, 1],
    [1, 2],
  ]),
); // 1
console.log(
  f2(3, [
    [0, 1],
    [1, 2],
  ]),
); // 1

export {};
