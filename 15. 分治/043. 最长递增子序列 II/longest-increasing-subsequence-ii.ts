// ============================================================
// 043. 最长递增子序列 II
// ============================================================
// LeetCode 2407. Longest Increasing Subsequence II
// 给定整数数组 nums 和整数 k，找出 nums 中满足以下条件的最长子序列长度：
// 1) 子序列严格递增；2) 子序列中相邻元素的差值不超过 k。
// 即对相邻元素 a, b 满足 a < b 且 b - a <= k（亦即 a ∈ [b-k, b-1]）。
// 时间复杂度：O(n log m), 空间复杂度：O(m)（m 为不同的值域规模）

// 方法1：线段树 + 坐标压缩（推荐）
// dp[j] = 1 + max{ dp[i] : i<j, nums[i] ∈ [nums[j]-k, nums[j]-1] }。
// 对值域建立线段树（区间最大值、点更新），按原顺序遍历：
// 查询值落在 [nums[j]-k, nums[j]-1] 内的最大 dp，更新到 nums[j] 位置。
// 时间复杂度 O(n log m)，空间复杂度 O(m)
function lengthOfLIS(nums: number[], k: number): number {
  const n: number = nums.length;
  if (n === 0) return 0;
  // 坐标压缩
  const sorted: number[] = [...new Set<number>(nums)].sort((a: number, b: number): number => a - b);
  const m: number = sorted.length;

  const tree: number[] = new Array<number>(4 * m).fill(0);
  function update(node: number, l: number, r: number, pos: number, val: number): void {
    if (l === r) {
      if (val > tree[node]) tree[node] = val;
      return;
    }
    const mid: number = (l + r) >> 1;
    if (pos <= mid) update(node * 2, l, mid, pos, val);
    else update(node * 2 + 1, mid + 1, r, pos, val);
    tree[node] = Math.max(tree[node * 2], tree[node * 2 + 1]);
  }
  function query(node: number, l: number, r: number, ql: number, qr: number): number {
    if (qr < l || r < ql) return 0;
    if (ql <= l && r <= qr) return tree[node];
    const mid: number = (l + r) >> 1;
    return Math.max(query(node * 2, l, mid, ql, qr), query(node * 2 + 1, mid + 1, r, ql, qr));
  }

  // lowerBound：第一个 >= x 的下标（0-based，不存在则 m）
  function lowerBound(x: number): number {
    let lo: number = 0;
    let hi: number = m;
    while (lo < hi) {
      const mid: number = (lo + hi) >> 1;
      if (sorted[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  let res: number = 0;
  for (const num of nums) {
    // 查询值 ∈ [num-k, num-1]，即下标 ∈ [lowerBound(num-k), lowerBound(num)-1]
    const ql: number = lowerBound(num - k);
    const qr: number = lowerBound(num) - 1;
    let best: number = 0;
    if (ql <= qr) best = query(1, 0, m - 1, ql, qr);
    const cur: number = best + 1;
    update(1, 0, m - 1, lowerBound(num), cur);
    if (cur > res) res = cur;
  }
  return res;
}

// 方法2：CDQ 分治 + 线段树
// 按下标分治：先递归求解左半 [l,mid]，再用左半的 dp 通过线段树（按值）更新右半
// [mid+1,r]，最后递归求解右半。每个分治层使用一个可清空的线段树。
// 时间复杂度 O(n log n log m)，空间复杂度 O(m)
function lengthOfLISCDQ(nums: number[], k: number): number {
  const n: number = nums.length;
  if (n === 0) return 0;
  const sorted: number[] = [...new Set<number>(nums)].sort((a: number, b: number): number => a - b);
  const m: number = sorted.length;

  function lowerBound(x: number): number {
    let lo: number = 0;
    let hi: number = m;
    while (lo < hi) {
      const mid: number = (lo + hi) >> 1;
      if (sorted[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  const dp: number[] = new Array<number>(n).fill(1);
  const tree: number[] = new Array<number>(4 * m + 4).fill(0);
  const touched: number[] = []; // 记录本次修改过的节点，便于整体清空

  function update(node: number, l: number, r: number, pos: number, val: number): void {
    if (l === r) {
      if (val > tree[node]) tree[node] = val;
      touched.push(node);
      return;
    }
    const mid: number = (l + r) >> 1;
    if (pos <= mid) update(node * 2, l, mid, pos, val);
    else update(node * 2 + 1, mid + 1, r, pos, val);
    tree[node] = Math.max(tree[node * 2], tree[node * 2 + 1]);
    touched.push(node);
  }
  function query(node: number, l: number, r: number, ql: number, qr: number): number {
    if (qr < l || r < ql) return 0;
    if (ql <= l && r <= qr) return tree[node];
    const mid: number = (l + r) >> 1;
    return Math.max(query(node * 2, l, mid, ql, qr), query(node * 2 + 1, mid + 1, r, ql, qr));
  }
  function clearTree(): void {
    for (const node of touched) tree[node] = 0;
    touched.length = 0;
  }

  function cdq(l: number, r: number): void {
    if (l === r) return;
    const mid: number = (l + r) >> 1;
    cdq(l, mid);
    // 左半按下标顺序插入线段树（按值的位置）
    for (let i: number = l; i <= mid; i++) {
      update(1, 0, m - 1, lowerBound(nums[i]), dp[i]);
    }
    // 用左半更新右半每个 j：查询值 ∈ [nums[j]-k, nums[j]-1] 的最大 dp
    for (let j: number = mid + 1; j <= r; j++) {
      const ql: number = lowerBound(nums[j] - k);
      const qr: number = lowerBound(nums[j]) - 1;
      if (ql <= qr) {
        const best: number = query(1, 0, m - 1, ql, qr);
        if (best + 1 > dp[j]) dp[j] = best + 1;
      }
    }
    clearTree();
    cdq(mid + 1, r);
  }

  cdq(0, n - 1);
  let res: number = 0;
  for (let i: number = 0; i < n; i++) if (dp[i] > res) res = dp[i];
  return res;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 043. 最长递增子序列 II =====");
console.log(lengthOfLIS([4, 2, 1, 4, 3, 4, 5, 8, 15], 3)); // 期望结果: 5
console.log(lengthOfLIS([7, 4, 5, 1, 8, 12, 4, 7], 5)); // 期望结果: 4
console.log(lengthOfLIS([1, 5, 8, 10, 13], 4)); // 期望结果: 5
console.log("--- 方法2测试 ---");
console.log(lengthOfLISCDQ([4, 2, 1, 4, 3, 4, 5, 8, 15], 3)); // 期望结果: 5
console.log(lengthOfLISCDQ([7, 4, 5, 1, 8, 12, 4, 7], 5)); // 期望结果: 4
console.log(lengthOfLISCDQ([1, 5, 8, 10, 13], 4)); // 期望结果: 5

export {};
