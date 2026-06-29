// ============================================================
// 176. 互质树
// ============================================================
// LeetCode 1766. Tree of Coprimes
// 给定一棵树（用边表示）和节点值数组 nums，返回数组 ans，
// 其中 ans[i] 是节点 i 的祖先中与 nums[i] 互质的最近节点。
// 时间复杂度：O(n * C)，其中 C = 50（值域）；空间复杂度：O(n + C)

// 方法1：DFS递归+互质祖先栈（推荐）
// 关键观察：nums 值域为 1..50
// 维护一个数组 last[1..50]，记录每个值最近出现的节点及深度
// DFS 时，对于当前节点，遍历所有可能的值 v (1..50)，
// 若 gcd(v, nums[node]) === 1，则 last[v] 记录的节点是候选祖先
// 取深度最大的（最近的）候选
function getCoprimes(nums: number[], edges: number[][]): number[] {
  const n = nums.length;
  // 建邻接表
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // 预处理 gcd
  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };
  // 预处理互质表
  const coprime: number[][] = Array.from({ length: 51 }, () => []);
  for (let i = 1; i <= 50; i++) {
    for (let j = 1; j <= 50; j++) {
      if (gcd(i, j) === 1) coprime[i].push(j);
    }
  }

  const ans: number[] = new Array(n).fill(-1);
  // last[v] = [node, depth] 表示值 v 最近出现的位置和深度
  const last: [number, number][] = Array.from({ length: 51 }, () => [-1, -1]);

  function dfs(node: number, parent: number, depth: number): void {
    const val = nums[node];
    // 在互质值中找深度最大的祖先
    let bestNode = -1;
    let bestDepth = -1;
    for (const v of coprime[val]) {
      if (last[v][0] !== -1 && last[v][1] > bestDepth) {
        bestDepth = last[v][1];
        bestNode = last[v][0];
      }
    }
    ans[node] = bestNode;

    // 保存当前值的状态，DFS 后恢复（回溯）
    const prev = last[val];
    last[val] = [node, depth];

    for (const child of adj[node]) {
      if (child !== parent) {
        dfs(child, node, depth + 1);
      }
    }

    // 回溯
    last[val] = prev;
  }

  dfs(0, -1, 0);
  return ans;
}

// 方法2：DFS + 栈模拟（显式记录路径上各值的出现位置）
function getCoprimesStack(nums: number[], edges: number[][]): number[] {
  const n = nums.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  const ans: number[] = new Array(n).fill(-1);
  // 路径栈：记录从根到当前节点的路径
  const path: [number, number][] = []; // [node, val]

  function dfs(node: number, parent: number, depth: number): void {
    const val = nums[node];
    // 在路径栈中找最近的互质祖先
    let bestNode = -1;
    let bestDepth = -1;
    for (let i = path.length - 1; i >= 0; i--) {
      if (gcd(val, path[i][1]) === 1) {
        bestNode = path[i][0];
        break;
      }
    }
    ans[node] = bestNode;

    path.push([node, val]);
    for (const child of adj[node]) {
      if (child !== parent) {
        dfs(child, node, depth + 1);
      }
    }
    path.pop();
  }

  dfs(0, -1, 0);
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 176. 互质树 =====");

// 测试1:
// nums = [2,3,3,2], edges = [[0,1],[1,2],[1,3]]
// 树:
//     0(2)
//     |
//     1(3)
//    / \
//   2(3) 3(2)
// 节点0是根，无祖先 -> -1
// 节点1: 祖先[0(2)], gcd(3,2)=1 -> 0
// 节点2: 祖先[0(2),1(3)], gcd(3,2)=1 -> 0 (最近互质是0)
//        但 1(3) 和 2(3) 不互质，所以找 0(2)
// 节点3: 祖先[0(2),1(3)], gcd(2,3)=1 -> 1
console.log(
  "测试1:",
  getCoprimes(
    [2, 3, 3, 2],
    [
      [0, 1],
      [1, 2],
      [1, 3],
    ],
  ),
);
// 期望 [-1,0,0,1]

// 测试2:
// nums = [5,6,10,2,3,6,15], edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]]
console.log(
  "测试2:",
  getCoprimes(
    [5, 6, 10, 2, 3, 6, 15],
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
      [2, 6],
    ],
  ),
);
// 期望 [-1,0,-1,0,0,0,-1]

// 测试3: 单节点
console.log("测试3:", getCoprimes([1], [])); // 期望 [-1]

export {};
