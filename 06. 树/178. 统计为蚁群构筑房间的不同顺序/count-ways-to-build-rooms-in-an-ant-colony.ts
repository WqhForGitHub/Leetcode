// ============================================================
// 178. 统计为蚁群构筑房间的不同顺序
// ============================================================
// LeetCode 1916. Count Ways to Build Rooms in an Ant Colony
// 给定一个数组 prevRoom，表示每个房间的上一个房间。
// 返回构筑所有房间的不同顺序数（对 10^9+7 取模）。
// 时间复杂度：O(n)，空间复杂度：O(n)

const MOD = 1000000007n;

// 方法1：DFS+组合数+逆元（推荐）
// 思路：
// 1. 建树：prevRoom[i] 是 i 的父节点
// 2. 对每棵子树，计算构筑顺序数
// 3. 合并子树时，用多重组合：在 size[u] 个位置中分配各子树
//    f[u] = f[u] * C(size[u]-1, size[v]) * f[v]（依次合并每个子树）
// 4. 用费马小定理预处理阶乘和逆元
function waysToBuildRooms(prevRoom: number[]): number {
  const n = prevRoom.length;
  // 建邻接表（树）
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) {
    adj[prevRoom[i]].push(i);
  }

  // 预处理阶乘和逆元阶乘
  const fact: bigint[] = new Array(n + 1);
  const invFact: bigint[] = new Array(n + 1);
  fact[0] = 1n;
  for (let i = 1; i <= n; i++) {
    fact[i] = (fact[i - 1] * BigInt(i)) % MOD;
  }
  invFact[n] = modPow(fact[n], MOD - 2n);
  for (let i = n - 1; i >= 0; i--) {
    invFact[i] = (invFact[i + 1] * BigInt(i + 1)) % MOD;
  }

  // C(n, r) = n! / (r! * (n-r)!)
  function comb(n: number, r: number): bigint {
    if (r < 0 || r > n) return 0n;
    return (((fact[n] * invFact[r]) % MOD) * invFact[n - r]) % MOD;
  }

  // DFS 返回 [方案数, 子树大小]
  const result = dfs(0);
  return Number(result[0]);

  function dfs(u: number): [bigint, bigint] {
    let ways = 1n;
    let size = 0n;
    for (const v of adj[u]) {
      const [childWays, childSize] = dfs(v);
      // 合并子树 v：从 size + childSize 个位置中选 childSize 个给 v
      // ways = ways * childWays * C(size + childSize, childSize)
      const total = size + childSize;
      ways = (((ways * childWays) % MOD) * comb(Number(total), Number(childSize))) % MOD;
      size = total;
    }
    // 加上当前节点
    size += 1n;
    return [ways, size];
  }

  function modPow(base: bigint, exp: bigint): bigint {
    let result = 1n;
    let b = base % MOD;
    let e = exp;
    while (e > 0n) {
      if (e & 1n) result = (result * b) % MOD;
      b = (b * b) % MOD;
      e >>= 1n;
    }
    return result;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 178. 统计为蚁群构筑房间的不同顺序 =====");

// 测试1: prevRoom = [-1,0,1]
// 树: 0 -> 1 -> 2
// 构筑顺序必须先父后子，唯一顺序 [0,1,2]
console.log("测试1:", waysToBuildRooms([-1, 0, 1])); // 1

// 测试2: prevRoom = [-1,0,0,1,2]
// 树:
//     0
//    / \
//   1   (0的另一个孩子?)
// 实际上 prevRoom = [-1,0,0,1,2]
// 节点1 父=0, 节点2 父=0, 节点3 父=1, 节点4 父=2
//     0
//    / \
//   1   2
//   |   |
//   3   4
// 顺序：0 必须先，然后 1 和 2 可任意顺序，1后才能3，2后才能4
// 可能顺序：0,1,2,3,4 / 0,1,2,4,3 / 0,2,1,3,4 / 0,2,1,4,3 / ...
console.log("测试2:", waysToBuildRooms([-1, 0, 0, 1, 2])); // 6

// 测试3: prevRoom = [-1,0,1,2,3]
// 链: 0->1->2->3->4，唯一顺序
console.log("测试3:", waysToBuildRooms([-1, 0, 1, 2, 3])); // 1

// 测试4: prevRoom = [-1,0,0,0]
// 0 有三个独立孩子 1,2,3，顺序数 = 3! = 6
console.log("测试4:", waysToBuildRooms([-1, 0, 0, 0])); // 6

export {};
