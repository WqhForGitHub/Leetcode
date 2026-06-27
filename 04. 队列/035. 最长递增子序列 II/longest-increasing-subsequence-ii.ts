// ============================================================
// 035. 最长递增子序列 II
// ============================================================
// LeetCode 2407. Longest Increasing Subsequence II
// 给定数组 nums 和整数 k，找到最长递增子序列，要求相邻元素差不超过 k。

// ------------------------------------------------------------
// 方法1：线段树优化 DP
// ------------------------------------------------------------
// dp[v] = 以值 v 结尾的最长 LIS 长度。
// dp[v] = 1 + max(dp[v-k..v-1])，用线段树维护区间最大值。
// 时间 O(n log U)，U 为值域。
class SegTree {
  private tree: number[];
  private n: number;
  private offset: number;

  constructor(maxVal: number) {
    this.n = 1;
    while (this.n < maxVal + 1) this.n <<= 1;
    this.tree = new Array(2 * this.n).fill(0);
    this.offset = 0;
  }

  update(index: number, val: number): void {
    index += this.n + this.offset;
    if (this.tree[index] >= val) return;
    this.tree[index] = val;
    index >>= 1;
    while (index > 0) {
      this.tree[index] = Math.max(
        this.tree[2 * index],
        this.tree[2 * index + 1],
      );
      index >>= 1;
    }
  }

  query(l: number, r: number): number {
    l += this.n + this.offset;
    r += this.n + this.offset + 1;
    let result = 0;
    while (l < r) {
      if (l & 1) result = Math.max(result, this.tree[l++]);
      if (r & 1) result = Math.max(result, this.tree[--r]);
      l >>= 1;
      r >>= 1;
    }
    return result;
  }
}

function lengthOfLIS1(nums: number[], k: number): number {
  const maxVal = Math.max(...nums);
  const seg = new SegTree(maxVal);
  let result = 0;
  for (const num of nums) {
    const lo = Math.max(1, num - k);
    const hi = num - 1;
    const best = hi >= lo ? seg.query(lo, hi) : 0;
    seg.update(num, best + 1);
    result = Math.max(result, best + 1);
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：分块（块内最大值）
// ------------------------------------------------------------
// 将值域分块，每块维护最大值，查询时整块取块最大值，零散块逐个查询。
// 时间 O(n sqrt(U))，空间 O(U)。
function lengthOfLIS2(nums: number[], k: number): number {
  const maxVal = Math.max(...nums);
  const blockSize = Math.ceil(Math.sqrt(maxVal));
  const numBlocks = Math.ceil((maxVal + 1) / blockSize);
  const blockMax: number[] = new Array(numBlocks).fill(0);
  const val: number[] = new Array(maxVal + 1).fill(0);
  let result = 0;

  const query = (l: number, r: number): number => {
    if (l > r) return 0;
    let res = 0;
    const lb = Math.floor(l / blockSize);
    const rb = Math.floor(r / blockSize);
    if (lb === rb) {
      for (let i = l; i <= r; i++) res = Math.max(res, val[i]);
    } else {
      for (let i = l; i < (lb + 1) * blockSize; i++)
        res = Math.max(res, val[i]);
      for (let b = lb + 1; b < rb; b++) res = Math.max(res, blockMax[b]);
      for (let i = rb * blockSize; i <= r; i++) res = Math.max(res, val[i]);
    }
    return res;
  };

  const update = (index: number, v: number): void => {
    if (val[index] >= v) return;
    val[index] = v;
    const b = Math.floor(index / blockSize);
    blockMax[b] = Math.max(blockMax[b], v);
  };

  for (const num of nums) {
    const lo = Math.max(1, num - k);
    const hi = num - 1;
    const best = query(lo, hi);
    update(num, best + 1);
    result = Math.max(result, best + 1);
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log(
    "测试1:",
    lengthOfLIS1([4, 2, 1, 4, 3, 4, 5, 8, 15], 3),
    "期望: 5",
  );
  console.log("测试2:", lengthOfLIS1([7, 4, 5, 1, 8, 12, 4, 7], 5), "期望: 4");
  console.log("测试3:", lengthOfLIS1([1, 5], 1), "期望: 1");
  console.log(
    "测试4:",
    lengthOfLIS2([4, 2, 1, 4, 3, 4, 5, 8, 15], 3),
    "期望: 5",
  );
  console.log("测试5:", lengthOfLIS2([7, 4, 5, 1, 8, 12, 4, 7], 5), "期望: 4");
}

test();

export {};
