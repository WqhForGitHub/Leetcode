// ============================================================
// 005. 火星词典
// ============================================================
// LeetCode 269. Alien Dictionary
// 给定按外星字母顺序排序的单词列表，推导字母顺序字符串；若非法（矛盾/前缀冲突）返回 ""。
// 时间复杂度：O(C + U)，C 为字符总数，U 为不同字母数
// 空间复杂度：O(U + min(U^2, C))

// 方法1：建图 + BFS 拓扑排序（Kahn）（推荐）
// 1) 收集所有出现字母；2) 相邻单词首不同字符建 a->b 边；3) 入度 0 入队输出；
// 4) 结果长度 != 字母总数则存在环；5) 处理前缀冲突（w2 是 w1 前缀但更短）。
function alienOrder(words: string[]): string {
  const adj = new Map<string, Set<string>>();
  const indegree = new Map<string, number>();
  for (const w of words) {
    for (const ch of w) {
      if (!adj.has(ch)) {
        adj.set(ch, new Set());
        indegree.set(ch, 0);
      }
    }
  }
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i];
    const w2 = words[i + 1];
    const minLen = Math.min(w1.length, w2.length);
    let foundDiff = false;
    for (let j = 0; j < minLen; j++) {
      if (w1[j] !== w2[j]) {
        if (!adj.get(w1[j])!.has(w2[j])) {
          adj.get(w1[j])!.add(w2[j]); // w1[j] 在 w2[j] 之前
          indegree.set(w2[j], indegree.get(w2[j])! + 1);
        }
        foundDiff = true;
        break;
      }
    }
    // w2 是 w1 的前缀但更短，非法（如 "abc" 排在 "ab" 前）
    if (!foundDiff && w1.length > w2.length) return "";
  }
  const queue: string[] = [];
  for (const [ch, d] of indegree) {
    if (d === 0) queue.push(ch);
  }
  let result = "";
  while (queue.length > 0) {
    const ch = queue.shift()!;
    result += ch;
    for (const next of adj.get(ch)!) {
      indegree.set(next, indegree.get(next)! - 1);
      if (indegree.get(next) === 0) queue.push(next);
    }
  }
  return result.length === indegree.size ? result : "";
}

// 方法2：建图 + DFS 三态标记
// 后序逆序得到拓扑序；访问中再次遇到说明有环。
function alienOrderDFS(words: string[]): string {
  const adj = new Map<string, Set<string>>();
  for (const w of words) {
    for (const ch of w) {
      if (!adj.has(ch)) adj.set(ch, new Set());
    }
  }
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i];
    const w2 = words[i + 1];
    const minLen = Math.min(w1.length, w2.length);
    let foundDiff = false;
    for (let j = 0; j < minLen; j++) {
      if (w1[j] !== w2[j]) {
        adj.get(w1[j])!.add(w2[j]);
        foundDiff = true;
        break;
      }
    }
    if (!foundDiff && w1.length > w2.length) return "";
  }
  const state = new Map<string, number>(); // 0 未访问, 1 访问中, 2 已完成
  const order: string[] = [];
  let hasCycle = false;
  const dfs = (u: string): void => {
    if (hasCycle) return;
    if (state.get(u) === 2) return;
    if (state.get(u) === 1) {
      hasCycle = true;
      return;
    }
    state.set(u, 1);
    for (const v of adj.get(u)!) dfs(v);
    state.set(u, 2);
    order.push(u); // 后序
  };
  for (const ch of adj.keys()) {
    if (state.get(ch) !== 2) dfs(ch);
  }
  return hasCycle ? "" : order.reverse().join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 005. 火星词典 =====");
console.log("BFS:", alienOrder(["wrt", "wrf", "er", "ett", "rftt"])); // 期望 "wertf"
console.log("DFS:", alienOrderDFS(["wrt", "wrf", "er", "ett", "rftt"])); // 期望 "wertf"
console.log("BFS:", alienOrder(["z", "x"])); // 期望 "zx"
console.log("DFS:", alienOrderDFS(["z", "x"])); // 期望 "zx"
console.log("BFS:", alienOrder(["z", "x", "z"])); // 期望 ""（存在环）
console.log("BFS:", alienOrder(["abc", "ab"])); // 期望 ""（前缀冲突）

export {};
