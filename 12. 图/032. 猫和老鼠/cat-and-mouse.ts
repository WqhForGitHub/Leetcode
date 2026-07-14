// ============================================================
// 032. 猫和老鼠
// ============================================================
// LeetCode 913. Cat and Mouse
// 迷宫无向图 graph，老鼠从 1 出发、猫从 2 出发，轮流移动（老鼠先手）。
// 老鼠进洞 0 赢，猫抓到老鼠（同位置，猫不能进洞 0）赢。双方最优。
// 返回 0 平局 / 1 鼠赢 / 2 猫赢。
// 时间复杂度：O(N^3)，空间复杂度：O(N^2)

// 方法1：minimax + 记忆化（推荐）
// 思路：状态=(mouse, cat, turn)。回合数超过 2N 视为平局。
// 老鼠回合选最有利于鼠的结果(1>0>2)，猫回合选最有利于猫的结果(2>0>1)。
function catMouseGameMemo(graph: number[][]): number {
  const n = graph.length;
  const memo = new Map<string, number>();

  function dfs(mouse: number, cat: number, turn: number): number {
    if (turn >= 2 * n) return 0; // 回合过多视为平局
    if (mouse === 0) return 1; // 老鼠进洞，鼠赢
    if (mouse === cat) return 2; // 猫抓到鼠，猫赢
    const key = `${mouse},${cat},${turn}`;
    if (memo.has(key)) return memo.get(key)!;

    let result: number;
    if (turn % 2 === 0) {
      // 老鼠回合：偏好 1 > 0 > 2
      result = 2;
      for (const nm of graph[mouse]) {
        const r = dfs(nm, cat, turn + 1);
        if (r === 1) {
          result = 1;
          break;
        }
        if (r === 0) result = 0;
      }
    } else {
      // 猫回合：偏好 2 > 0 > 1（猫不能进洞 0）
      result = 1;
      for (const nc of graph[cat]) {
        if (nc === 0) continue;
        const r = dfs(mouse, nc, turn + 1);
        if (r === 2) {
          result = 2;
          break;
        }
        if (r === 0) result = 0;
      }
    }
    memo.set(key, result);
    return result;
  }

  return dfs(1, 2, 0);
}

// 方法2：BFS 逆推（拓扑排序求博弈结果）
// 思路：把博弈状态图做拓扑排序。已知终态（鼠在洞=1，鼠猫同位=2）入队，
// 逆向传播：若当前决策者能走到自己赢的状态则标记为赢；否则度数减一，
// 度数归零说明所有后继都已确定且无己方赢，则判为对方赢。未确定的为平局。
function catMouseGameBFS(graph: number[][]): number {
  const n = graph.length;
  // res[m][c][turn], turn 0=鼠回合 1=猫回合, c 从 1 开始（猫不在洞 0）
  const res: number[][][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => [0, 0]),
  );
  const degree: number[][][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => [0, 0]),
  );
  for (let m = 0; m < n; m++) {
    for (let c = 1; c < n; c++) {
      degree[m][c][0] = graph[m].length;
      degree[m][c][1] = graph[c].filter((x) => x !== 0).length;
    }
  }

  const queue: Array<[number, number, number]> = [];
  // 终态：鼠在洞 0 => 鼠赢
  for (let c = 1; c < n; c++) {
    res[0][c][0] = 1;
    res[0][c][1] = 1;
    queue.push([0, c, 0], [0, c, 1]);
  }
  // 终态：鼠猫同位 => 猫赢
  for (let m = 1; m < n; m++) {
    res[m][m][0] = 2;
    res[m][m][1] = 2;
    queue.push([m, m, 0], [m, m, 1]);
  }

  while (queue.length > 0) {
    const [m, c, turn] = queue.shift()!;
    const r = res[m][c][turn];
    // 求前驱状态：能走到当前状态的状态
    const parents: Array<[number, number, number]> = [];
    if (turn === 1) {
      // 当前是猫回合，说明鼠刚从 pm 走到 m
      for (const pm of graph[m]) parents.push([pm, c, 0]);
    } else {
      // 当前是鼠回合，说明猫刚从 pc 走到 c（pc 不能是 0）
      for (const pc of graph[c]) {
        if (pc === 0) continue;
        parents.push([m, pc, 1]);
      }
    }
    for (const [pm, pc, pturn] of parents) {
      if (res[pm][pc][pturn] !== 0) continue;
      const moverWin = pturn === 0 ? 1 : 2; // 前驱决策者的胜利值
      if (r === moverWin) {
        // 决策者能走到自己赢的后继
        res[pm][pc][pturn] = moverWin;
        queue.push([pm, pc, pturn]);
      } else {
        degree[pm][pc][pturn] -= 1;
        if (degree[pm][pc][pturn] === 0) {
          // 所有后继都已确定且无己方赢 => 对方赢
          res[pm][pc][pturn] = pturn === 0 ? 2 : 1;
          queue.push([pm, pc, pturn]);
        }
      }
    }
  }
  return res[1][2][0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 032. 猫和老鼠 =====");
// 例1：双方最优下形成平局循环，期望 0
console.log("记忆化:", catMouseGameMemo([[2, 5], [3], [0, 4, 5], [1, 4, 5], [2, 3], [0, 2, 3]])); // 期望 0
console.log("BFS:", catMouseGameBFS([[2, 5], [3], [0, 4, 5], [1, 4, 5], [2, 3], [0, 2, 3]])); // 期望 0
// 例2：老鼠可达洞 0，期望 1
console.log("记忆化:", catMouseGameMemo([[1, 3], [0], [3], [0, 2]])); // 期望 1
console.log("BFS:", catMouseGameBFS([[1, 3], [0], [3], [0, 2]])); // 期望 1
// 例3：老鼠首步被迫走到猫的位置（无向图），期望 2
console.log("记忆化:", catMouseGameMemo([[2], [2], [0, 1, 3], [2]])); // 期望 2
console.log("BFS:", catMouseGameBFS([[2], [2], [0, 1, 3], [2]])); // 期望 2

export {};
