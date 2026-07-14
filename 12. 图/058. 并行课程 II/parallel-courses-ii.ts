// ============================================================
// 058. 并行课程 II
// ============================================================
// LeetCode 1494. Parallel Courses II
// n 门课（编号 1..n），relations[a,b] 表示 a 是 b 的先修课。每学期最多上 k 门。
// 求最少几个学期学完所有课程。
// 时间复杂度：O(3^n)（子集枚举），空间复杂度：O(2^n)
// 注意：课程编号 1..n，需转换为 0-indexed 位掩码。

function popcount(x: number): number {
  let c = 0;
  while (x > 0) {
    x &= x - 1;
    c++;
  }
  return c;
}

// ============================================================
// 方法1：状态压缩 DP（推荐）
// dp[mask] = 已学课程集合为 mask 时的最少学期数
// 转移：对当前 mask，计算"本学期可学"的课程集合 ready（未学且先修已全满足），
//       枚举 ready 中大小 <= k 的子集 sub，更新 dp[mask | sub]。
// 优化：当 |ready| <= k 时直接全部学完（多学不亏，因更大学期完成集只会让后续更轻松）。
// 时间复杂度：O(3^n)，空间复杂度：O(2^n)
// ============================================================
function minNumberOfSemestersDP(n: number, relations: number[][], k: number): number {
  // prereq[c]：课程 c 的所有先修课位掩码（0-indexed）
  const prereq = new Array(n).fill(0);
  for (const [a, b] of relations) {
    prereq[b - 1] |= 1 << (a - 1);
  }

  const FULL = (1 << n) - 1;
  const INF = Number.POSITIVE_INFINITY;
  const dp = new Array(1 << n).fill(INF);
  dp[0] = 0;

  for (let mask = 0; mask <= FULL; mask++) {
    if (dp[mask] === INF) continue;
    // 计算 ready：未学且先修课全部在 mask 中
    let ready = 0;
    for (let c = 0; c < n; c++) {
      if (mask & (1 << c)) continue; // 已学
      if ((prereq[c] & mask) === prereq[c]) {
        ready |= 1 << c; // 先修满足
      }
    }
    if (ready === 0) continue;

    // 枚举 ready 的所有非空子集（大小 <= k）
    for (let sub = ready; sub > 0; sub = (sub - 1) & ready) {
      if (popcount(sub) > k) continue;
      const next = mask | sub;
      if (dp[mask] + 1 < dp[next]) dp[next] = dp[mask] + 1;
    }
  }

  return dp[FULL];
}

// ============================================================
// 方法2：BFS（按学期分层）
// 时间复杂度：O(3^n)，空间复杂度：O(2^n)
// 每一层代表一个学期，从已学集合扩展到所有可达新集合。
// ============================================================
function minNumberOfSemestersBFS(n: number, relations: number[][], k: number): number {
  const prereq = new Array(n).fill(0);
  for (const [a, b] of relations) {
    prereq[b - 1] |= 1 << (a - 1);
  }
  const FULL = (1 << n) - 1;
  const visited = new Array(1 << n).fill(false);
  visited[0] = true;
  let layer: number[] = [0];
  let semesters = 0;

  while (layer.length > 0) {
    const nextLayer: number[] = [];
    for (const mask of layer) {
      if (mask === FULL) return semesters;
      let ready = 0;
      for (let c = 0; c < n; c++) {
        if (mask & (1 << c)) continue;
        if ((prereq[c] & mask) === prereq[c]) ready |= 1 << c;
      }
      if (ready === 0) continue;
      for (let sub = ready; sub > 0; sub = (sub - 1) & ready) {
        if (popcount(sub) > k) continue;
        const next = mask | sub;
        if (!visited[next]) {
          visited[next] = true;
          nextLayer.push(next);
        }
      }
    }
    layer = nextLayer;
    semesters++;
  }
  return semesters;
}

// 统一入口
function minNumberOfSemesters(n: number, relations: number[][], k: number): number {
  return minNumberOfSemestersDP(n, relations, k);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 058. 并行课程 II =====");
// 测试1: n=3, relations=[[1,3],[2,3]], k=2 -> 2（1,2 同学期；3 第二学期）
console.log(
  minNumberOfSemesters(
    3,
    [
      [1, 3],
      [2, 3],
    ],
    2,
  ),
); // 期望 2
console.log(
  minNumberOfSemestersBFS(
    3,
    [
      [1, 3],
      [2, 3],
    ],
    2,
  ),
); // 期望 2
// 测试2: n=3, relations=[[1,2],[2,3]], k=2 -> 3（链式必须 3 学期）
console.log(
  minNumberOfSemesters(
    3,
    [
      [1, 2],
      [2, 3],
    ],
    2,
  ),
); // 期望 3
// 测试3: n=3, relations=[[1,2],[2,3]], k=1 -> 3
console.log(
  minNumberOfSemesters(
    3,
    [
      [1, 2],
      [2, 3],
    ],
    1,
  ),
); // 期望 3
console.log(
  minNumberOfSemestersBFS(
    3,
    [
      [1, 2],
      [2, 3],
    ],
    1,
  ),
); // 期望 3
// 测试4: n=5, relations=[[1,2],[1,3],[2,4],[3,5]], k=2 -> 3
console.log(
  minNumberOfSemesters(
    5,
    [
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 5],
    ],
    2,
  ),
); // 期望 3
console.log(
  minNumberOfSemestersBFS(
    5,
    [
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 5],
    ],
    2,
  ),
); // 期望 3
// 测试5: n=4, relations=[], k=2 -> 2
console.log(minNumberOfSemesters(4, [], 2)); // 期望 2
console.log(minNumberOfSemestersBFS(4, [], 2)); // 期望 2

export {};
