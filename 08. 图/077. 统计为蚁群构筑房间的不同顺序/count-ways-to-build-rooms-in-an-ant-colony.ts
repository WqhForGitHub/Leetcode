// ============================================================
// 077. 统计为蚁群构筑房间的不同顺序
// ============================================================
// LeetCode 1916. Count Ways to Build Rooms in an Ant Colony
// n 个房间构成一棵以 0 为根的树（prevRoom[i] 表示房间 i 的父房间）。
// 每次只能建造"已建好的父房间"的直接子房间。返回不同建造顺序数 mod 1e9+7。
// 时间复杂度：O(N)，空间复杂度：O(N)
// 注意：模乘运算两因子接近 1e9+7 时乘积超过 Number.MAX_SAFE_INTEGER，
//       因此使用 BigInt 内部运算，最后转回 Number。

const MOD77 = 1000000007n;

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  let b = base % mod;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % mod;
    b = (b * b) % mod;
    e >>= 1n;
  }
  return result;
}

// 方法1：树形 DP + 乘法逆元组合数（推荐）
function waysToBuildRooms(prevRoom: number[]): number {
  const n = prevRoom.length;
  const g: number[][] = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) g[prevRoom[i]].push(i);

  // 预处理阶乘与逆阶乘（BigInt 保证精度）
  const fact = new Array<bigint>(n + 1);
  const invFact = new Array<bigint>(n + 1);
  fact[0] = 1n;
  for (let i = 1; i <= n; i++) fact[i] = (fact[i - 1] * BigInt(i)) % MOD77;
  invFact[n] = modPow(fact[n], MOD77 - 2n, MOD77);
  for (let i = n - 1; i >= 0; i--) invFact[i] = (invFact[i + 1] * BigInt(i + 1)) % MOD77;

  function C(a: number, b: number): bigint {
    if (b < 0 || b > a) return 0n;
    return (((fact[a] * invFact[b]) % MOD77) * invFact[a - b]) % MOD77;
  }

  const size = new Array<number>(n).fill(0);
  const dp = new Array<bigint>(n).fill(1n);

  // 显式栈收集节点顺序，逆序处理实现自底向上（避免递归过深）
  const order: number[] = [];
  const stack: number[] = [0];
  while (stack.length > 0) {
    const u = stack.pop()!;
    order.push(u);
    for (const v of g[u]) stack.push(v);
  }
  for (let i = order.length - 1; i >= 0; i--) {
    const u = order[i];
    size[u] = 1;
    for (const v of g[u]) {
      // dp[u] = dp[u] * dp[v] * C(size[u]+size[v]-1, size[v])
      const choose = C(size[u] + size[v] - 1, size[v]);
      dp[u] = (((dp[u] * dp[v]) % MOD77) * choose) % MOD77;
      size[u] += size[v];
    }
  }
  return Number(dp[0]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 077. 统计为蚁群构筑房间的不同顺序 =====");
console.log(waysToBuildRooms([-1, 0, 1])); // 期望 1
console.log(waysToBuildRooms([-1, 0, 0, 1, 2])); // 期望 6
console.log(waysToBuildRooms([-1, 0, 0, 0])); // 期望 6
console.log(waysToBuildRooms([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8])); // 链式，期望 1

export {};
