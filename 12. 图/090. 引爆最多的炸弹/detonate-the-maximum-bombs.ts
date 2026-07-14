// ============================================================
// 090. 引爆最多的炸弹
// ============================================================
// LeetCode 2101. Detonate the Maximum Bombs
// bombs = [x, y, r] 表示位置和引爆半径，连锁引爆。每个炸弹 i 引爆范围内（距离 <= r）
// 的炸弹 j。建有向图，从每个点 BFS 取最大引爆数。
// 时间复杂度：O(n^3)，空间复杂度：O(n^2)

function maximumDetonation(bombs: number[][]): number {
  const n: number = bombs.length;
  // 建有向图：i 能引爆 j 则 i -> j
  const g: number[][] = Array.from({ length: n }, () => []);
  for (let i: number = 0; i < n; i++) {
    const [xi, yi, ri]: number[] = bombs[i];
    for (let j: number = 0; j < n; j++) {
      if (i === j) continue;
      const [xj, yj]: number[] = bombs[j];
      const dx: number = xi - xj;
      const dy: number = yi - yj;
      // 注意用平方比较避免浮点误差：dx*dx+dy*dy <= ri*ri
      if (BigInt(dx) * BigInt(dx) + BigInt(dy) * BigInt(dy) <= BigInt(ri) * BigInt(ri)) {
        g[i].push(j);
      }
    }
  }
  // 从每个点 BFS 求能引爆的数量
  const bfs = (start: number): number => {
    const visited: boolean[] = new Array(n).fill(false);
    visited[start] = true;
    const queue: number[] = [start];
    let head: number = 0;
    let cnt: number = 1;
    while (head < queue.length) {
      const u: number = queue[head++];
      for (const v of g[u]) {
        if (!visited[v]) {
          visited[v] = true;
          queue.push(v);
          cnt++;
        }
      }
    }
    return cnt;
  };
  let ans: number = 1;
  for (let i: number = 0; i < n; i++) ans = Math.max(ans, bfs(i));
  return ans;
}

// 方法1：建图 + BFS 枚举起点
function f1(bombs: number[][]): number {
  return maximumDetonation(bombs);
}

// 方法2：建图 + DFS 枚举起点
function f2(bombs: number[][]): number {
  const n: number = bombs.length;
  const g: number[][] = Array.from({ length: n }, () => []);
  for (let i: number = 0; i < n; i++) {
    const [xi, yi, ri]: number[] = bombs[i];
    for (let j: number = 0; j < n; j++) {
      if (i === j) continue;
      const [xj, yj]: number[] = bombs[j];
      const dx: number = xi - xj;
      const dy: number = yi - yj;
      if (BigInt(dx) * BigInt(dx) + BigInt(dy) * BigInt(dy) <= BigInt(ri) * BigInt(ri)) {
        g[i].push(j);
      }
    }
  }
  const dfs = (start: number): number => {
    const visited: boolean[] = new Array(n).fill(false);
    visited[start] = true;
    let cnt: number = 1;
    const stack: number[] = [start];
    while (stack.length > 0) {
      const u: number = stack.pop()!;
      for (const v of g[u]) {
        if (!visited[v]) {
          visited[v] = true;
          cnt++;
          stack.push(v);
        }
      }
    }
    return cnt;
  };
  let ans: number = 1;
  for (let i: number = 0; i < n; i++) ans = Math.max(ans, dfs(i));
  return ans;
}

console.log("===== 090. 引爆最多的炸弹 =====");
// 测试
console.log(
  f1([
    [2, 1, 3],
    [6, 1, 4],
  ]),
); // 2
console.log(
  f2([
    [2, 1, 3],
    [6, 1, 4],
  ]),
); // 2
console.log(
  f1([
    [1, 1, 5],
    [10, 10, 5],
  ]),
); // 1
console.log(
  f2([
    [1, 1, 5],
    [10, 10, 5],
  ]),
); // 1
console.log(
  f1([
    [1, 2, 3],
    [2, 3, 1],
    [3, 4, 2],
    [4, 5, 3],
    [5, 6, 4],
  ]),
); // 5
console.log(
  f2([
    [1, 2, 3],
    [2, 3, 1],
    [3, 4, 2],
    [4, 5, 3],
    [5, 6, 4],
  ]),
); // 5

export {};
