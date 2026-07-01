// ============================================================
// 029. 喧闹和富有
// ============================================================
// LeetCode 851. Loud and Rich
// richer = [a, b] 表示 a 比 b 富。quiet[i] 为 i 的安静值。
// 对每个人，在其自身及所有比他富的人中，求安静值最小的编号。
// 时间复杂度：O(V+E)，空间复杂度：O(V+E)

// 方法1：记忆化 DFS（推荐）
// 思路：建图 b -> a（指向比自己富的人）。answer[x] = x 及所有可达（更富）节点中
// quiet 最小者的编号。DFS 时递归求邻居的 answer，取最优，记忆化避免重复计算。
function loudAndRichDFS(richer: number[][], quiet: number[]): number[] {
  const n = quiet.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of richer) adj[b].push(a); // b -> a（更富方向）

  const answer: number[] = new Array(n).fill(-1);

  function dfs(x: number): number {
    if (answer[x] !== -1) return answer[x];
    let best = x; // 至少包含自己
    for (const richerNode of adj[x]) {
      const cand = dfs(richerNode);
      if (quiet[cand] < quiet[best]) best = cand;
    }
    answer[x] = best;
    return best;
  }

  for (let i = 0; i < n; i++) dfs(i);
  return answer;
}

// 方法2：拓扑排序（Kahn）
// 思路：从最富的人（出度为 0，无人更富）开始处理。最富者 answer = 自己。
// 向较穷的前驱传播：answer[p] = min(answer[p], answer[u])（按 quiet 比较）。
// 出度归零的前驱入队。
function loudAndRichTopo(richer: number[][], quiet: number[]): number[] {
  const n = quiet.length;
  const adj: number[][] = Array.from({ length: n }, () => []); // b -> a
  const radj: number[][] = Array.from({ length: n }, () => []); // a -> b（更穷的前驱）
  const outdeg: number[] = new Array(n).fill(0);

  for (const [a, b] of richer) {
    adj[b].push(a);
    radj[a].push(b);
    outdeg[b]++;
  }

  const answer: number[] = Array.from({ length: n }, (_, i) => i);
  const queue: number[] = [];
  for (let i = 0; i < n; i++) {
    if (outdeg[i] === 0) queue.push(i); // 最富者
  }

  while (queue.length > 0) {
    const u = queue.shift()!;
    // 向更穷的前驱 b 传播
    for (const b of radj[u]) {
      if (quiet[answer[u]] < quiet[answer[b]]) {
        answer[b] = answer[u];
      }
      outdeg[b]--;
      if (outdeg[b] === 0) queue.push(b);
    }
  }
  return answer;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 029. 喧闹和富有 =====");

// richer=[[1,0],[2,1],[3,1],[3,7],[4,3],[5,3],[6,3]], quiet=[3,2,5,4,6,1,7,0]
console.log(
  loudAndRichDFS(
    [
      [1, 0],
      [2, 1],
      [3, 1],
      [3, 7],
      [4, 3],
      [5, 3],
      [6, 3],
    ],
    [3, 2, 5, 4, 6, 1, 7, 0],
  ),
); // 期望: [5,5,2,5,4,5,6,7]

console.log(
  loudAndRichTopo(
    [
      [1, 0],
      [2, 1],
      [3, 1],
      [3, 7],
      [4, 3],
      [5, 3],
      [6, 3],
    ],
    [3, 2, 5, 4, 6, 1, 7, 0],
  ),
); // 期望: [5,5,2,5,4,5,6,7]

console.log(loudAndRichDFS([], [0])); // 期望: [0]

export {};
