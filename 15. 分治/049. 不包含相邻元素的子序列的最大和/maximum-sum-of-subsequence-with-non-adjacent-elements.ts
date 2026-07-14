// ============================================================
// 049. 不包含相邻元素的子序列的最大和
// ============================================================
// LeetCode 3165. Maximum Sum of Subsequence With Non-Adjacent Elements
// 给定数组 nums 和查询数组 queries，queries[i] = [posi, xi]。对每个查询：
// 先将 nums[posi] 设为 xi，再求 nums 中“不包含相邻元素”的子序列的最大和（允许空子序列，和为 0）。
// 返回所有查询答案之和对 10^9+7 取模的结果。
// 时间复杂度：O((n + q) log n), 空间复杂度：O(n)

const MOD_SUB: number = 1e9 + 7;
const NINF: number = Number.NEGATIVE_INFINITY;

// 方法1：线段树 + 分治合并（推荐）
// 每个节点维护 4 个值 m[a][b]（a=段首是否选, b=段尾是否选）表示该段在对应边界条件下
// “不选相邻元素”的最大子序列和。两段合并时禁止“左段尾选且右段首选”（二者相邻）。
// 叶子值 x：m00=0（不选）, m11=x（选）, m01=m10=-∞（单元素首尾必须一致）。
// 整段答案 = max(根的 4 个值)。点更新 O(log n)。
// 时间复杂度 O((n+q) log n)，空间复杂度 O(n)
function getMaximumSum(nums: number[], queries: number[][]): number {
  const n: number = nums.length;
  // tree[node] = [m00, m01, m10, m11]
  const tree: number[][] = new Array<number[]>(4 * Math.max(n, 1))
    .fill([])
    .map((): number[] => [0, NINF, NINF, 0]);

  function combine(L: number[], R: number[]): number[] {
    return [
      Math.max(L[0] + R[0], L[0] + R[2], L[1] + R[0]),
      Math.max(L[0] + R[1], L[0] + R[3], L[1] + R[1]),
      Math.max(L[2] + R[0], L[2] + R[2], L[3] + R[0]),
      Math.max(L[2] + R[1], L[2] + R[3], L[3] + R[1]),
    ];
  }

  function build(node: number, l: number, r: number): void {
    if (l === r) {
      tree[node] = [0, NINF, NINF, nums[l]];
      return;
    }
    const mid: number = (l + r) >> 1;
    build(node * 2, l, mid);
    build(node * 2 + 1, mid + 1, r);
    tree[node] = combine(tree[node * 2], tree[node * 2 + 1]);
  }

  function update(node: number, l: number, r: number, pos: number, val: number): void {
    if (l === r) {
      tree[node] = [0, NINF, NINF, val];
      return;
    }
    const mid: number = (l + r) >> 1;
    if (pos <= mid) update(node * 2, l, mid, pos, val);
    else update(node * 2 + 1, mid + 1, r, pos, val);
    tree[node] = combine(tree[node * 2], tree[node * 2 + 1]);
  }

  if (n > 0) build(1, 0, n - 1);

  let ans: number = 0;
  for (const q of queries) {
    const pos: number = q[0];
    const x: number = q[1];
    update(1, 0, n - 1, pos, x);
    const root: number[] = tree[1];
    const cur: number = Math.max(root[0], root[1], root[2], root[3]);
    ans = (ans + cur) % MOD_SUB;
  }
  return ans;
}

// 方法2：每次查询后整体做一次“打家劫舍”DP（O(n)/查询）
// 不使用线段树：每次更新后，用滚动 DP 求整段“不选相邻元素”的最大和。
// prevNo = 不选当前位置的最大和，prevYes = 选当前位置的最大和；允许空（和 0）。
// 时间复杂度 O(n q)，空间复杂度 O(1)
function getMaximumSumNaive(nums: number[], queries: number[][]): number {
  const n: number = nums.length;
  const arr: number[] = [...nums];
  let ans: number = 0;
  for (const q of queries) {
    arr[q[0]] = q[1];
    let prevNo: number = 0; // 不选上一个时的最优
    let prevYes: number = 0; // 选上一个时的最优
    for (let i: number = 0; i < n; i++) {
      const v: number = arr[i];
      const newYes: number = prevNo + v; // 选当前则不能选上一个
      const newNo: number = Math.max(prevNo, prevYes); // 不选当前
      prevNo = newNo;
      prevYes = newYes;
    }
    const cur: number = Math.max(prevNo, prevYes);
    ans = (ans + cur) % MOD_SUB;
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 049. 不包含相邻元素的子序列的最大和 =====");
console.log(
  getMaximumSum(
    [3, 5, 9],
    [
      [1, -2],
      [0, -3],
    ],
  ),
); // 期望结果: 21
console.log(getMaximumSum([0, -1], [[0, -5]])); // 期望结果: 0
console.log("--- 方法2测试 ---");
console.log(
  getMaximumSumNaive(
    [3, 5, 9],
    [
      [1, -2],
      [0, -3],
    ],
  ),
); // 期望结果: 21
console.log(getMaximumSumNaive([0, -1], [[0, -5]])); // 期望结果: 0

export {};
