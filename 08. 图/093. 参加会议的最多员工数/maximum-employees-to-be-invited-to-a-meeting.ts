// ============================================================
// 093. 参加会议的最多员工数
// ============================================================
// LeetCode 2127. Maximum Employees to Be Invited to a Meeting
// favorite[i] 表示 i 喜欢坐其旁边的人。圆桌安排使每人旁边是其喜欢的人。求最多员工数。
// 解法：所有"基环 > 2 的环"取最大环长度；所有"二元环带挂链"可两两拼桌，链长相加。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：拓扑排序处理挂链 + 环检测（推荐）
function maximumInvitations(favorite: number[]): number {
  const n = favorite.length;
  const indeg = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) indeg[favorite[i]]++;

  // 拓扑排序剥离"挂链"，统计每个节点在二元环外的最长链 dp[i]
  const dp = new Array<number>(n).fill(1);
  const queue: number[] = [];
  for (let i = 0; i < n; i++) {
    if (indeg[i] === 0) queue.push(i);
  }
  while (queue.length > 0) {
    const u = queue.shift()!;
    const v = favorite[u];
    dp[v] = Math.max(dp[v], dp[u] + 1);
    if (--indeg[v] === 0) queue.push(v);
  }

  // 处理环
  let maxCycle = 0; // 环长 > 2 的最大环
  let pairSum = 0; // 二元环带挂链总和
  for (let i = 0; i < n; i++) {
    if (indeg[i] === 0) continue; // 已被拓扑剥除
    // 找环
    let len = 0;
    let j = i;
    while (indeg[j] !== 0) {
      indeg[j] = 0; // 标记已访问
      j = favorite[j];
      len++;
    }
    if (len === 2) {
      // 二元环：可加两侧挂链 dp[i] + dp[j]
      pairSum += dp[i] + dp[favorite[i]];
    } else {
      maxCycle = Math.max(maxCycle, len);
    }
  }
  return Math.max(maxCycle, pairSum);
}

// 方法2：显式建图 + DFS 找环（教学参考，思路直观但常数较大）
function maximumInvitationsDFS(favorite: number[]): number {
  const n = favorite.length;
  const visited = new Array<number>(n).fill(0); // 0 未访问，1 访问中，2 完成
  let maxCycle = 0;
  const twoCycleChains: number[] = [];

  for (let i = 0; i < n; i++) {
    if (visited[i] !== 0) continue;
    const path: number[] = [];
    let cur = i;
    while (visited[cur] === 0) {
      visited[cur] = 1;
      path.push(cur);
      cur = favorite[cur];
    }
    if (visited[cur] === 1) {
      // 找到环
      let idx = path.indexOf(cur);
      const cycleLen = path.length - idx;
      if (cycleLen === 2) {
        // 二元环带挂链，单独处理链长度
        // 计算除环外的最长挂链
        const a = path[idx];
        const b = path[idx + 1];
        const chainLen = longestChainTo(a, b, favorite) + longestChainTo(b, a, favorite);
        twoCycleChains.push(chainLen + 2);
      } else {
        maxCycle = Math.max(maxCycle, cycleLen);
      }
    }
    for (const node of path) visited[node] = 2;
  }

  const pairSum = twoCycleChains.reduce((s, v) => s + v, 0);
  return Math.max(maxCycle, pairSum);
}

// 计算从 (excluding, target] 反向到达 target 的最长链（不含 target 自身）
function longestChainTo(target: number, excluding: number, favorite: number[]): number {
  const n = favorite.length;
  // 反图
  const rev: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) rev[favorite[i]].push(i);
  let best = 0;
  const dfs = (u: number, ban: number, depth: number) => {
    if (u === ban) return;
    best = Math.max(best, depth);
    for (const v of rev[u]) {
      if (v === ban) continue;
      dfs(v, ban, depth + 1);
    }
  };
  for (const v of rev[target]) {
    if (v === excluding) continue;
    dfs(v, excluding, 1);
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 093. 参加会议的最多员工数 =====");
console.log(maximumInvitations([2, 2, 1, 2])); // 期望: 3
console.log(maximumInvitations([1, 2, 0])); // 期望: 3
console.log(maximumInvitations([3, 0, 1, 4, 1])); // 期望: 4
console.log(maximumInvitationsDFS([2, 2, 1, 2])); // 期望: 3
console.log(maximumInvitationsDFS([3, 0, 1, 4, 1])); // 期望: 4

export {};
