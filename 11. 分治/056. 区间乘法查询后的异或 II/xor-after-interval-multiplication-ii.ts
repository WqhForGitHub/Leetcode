// ============================================================
// 056. 区间乘法查询后的异或 II
// ============================================================
// LeetCode 56. XOR After Interval Multiplication II
// 与版本 I 相同题意，但数据规模更大（n, q 可达 10^5）。
// 给定数组 nums 和查询列表 queries，每个查询为 [l, r, k]：
// 将 nums[l..r] 的每个元素乘以 k，然后计算整个数组的异或值。
// 返回每次查询后的异或结果数组。
//
// 关键难点：XOR 与乘法不可组合，即 (a*k) XOR (b*k) 无法由 (a XOR b) 和 k 推出，
// 因此区间乘法后无法仅凭旧 XOR 和懒标记直接更新节点 XOR。
// 方法1采用懒标记线段树：区间乘法 O(log n) 设标记，
// 区间 XOR 查询时下推到叶子计算实际值。
// 方法1时间复杂度：O(q * n)（乘法 O(log n)，查询 O(n)），空间复杂度：O(n)
// 方法2时间复杂度：O(q * n)，空间复杂度：O(n)

// 方法1：懒标记线段树（区间乘法 + 区间 XOR 查询）（推荐）
// 每个节点存储：xor（初始构建的区间 XOR）、lazy（待下推的乘数）。
// 区间乘法：完全覆盖时仅设懒标记 O(log n)。
// 区间 XOR 查询：递归到叶子，实际值 = 基础值 × 累计乘数，再异或求和。
class LazyMulXorSegTree {
  private xor: number[]; // 节点区间 XOR（内部节点仅初始准确，叶子用于查询）
  private lazy: number[]; // 懒标记：乘数（默认 1）
  private n: number;

  constructor(nums: number[]) {
    this.n = nums.length;
    this.xor = new Array(4 * Math.max(this.n, 1)).fill(0);
    this.lazy = new Array(4 * Math.max(this.n, 1)).fill(1);
    if (this.n > 0) {
      this.build(1, 0, this.n - 1, nums);
    }
  }

  private build(node: number, l: number, r: number, nums: number[]): void {
    if (l === r) {
      this.xor[node] = nums[l];
      return;
    }
    const mid: number = (l + r) >> 1;
    this.build(node * 2, l, mid, nums);
    this.build(node * 2 + 1, mid + 1, r, nums);
    this.xor[node] = this.xor[node * 2] ^ this.xor[node * 2 + 1];
  }

  // 应用乘法懒标记：仅累乘 lazy，无法更新 xor（XOR 与乘法不可组合）
  private applyTag(node: number, k: number): void {
    this.lazy[node] *= k;
  }

  // 下推懒标记到子节点
  private pushDown(node: number): void {
    if (this.lazy[node] !== 1) {
      this.applyTag(node * 2, this.lazy[node]);
      this.applyTag(node * 2 + 1, this.lazy[node]);
      this.lazy[node] = 1;
    }
  }

  // 区间乘法：完全覆盖时设懒标记，部分覆盖时下推后递归
  private multiply(node: number, l: number, r: number, ql: number, qr: number, k: number): void {
    if (qr < l || r < ql) return;
    if (ql <= l && r <= qr) {
      this.applyTag(node, k);
      return;
    }
    this.pushDown(node);
    const mid: number = (l + r) >> 1;
    this.multiply(node * 2, l, mid, ql, qr, k);
    this.multiply(node * 2 + 1, mid + 1, r, ql, qr, k);
    // 内部节点 xor 无法由子节点准确重算（子节点可能有未下推标记），查询时下推到叶子
  }

  // 区间 XOR 查询：递归到叶子，实际值 = 基础值 × 累计乘数
  private queryXor(node: number, l: number, r: number, ql: number, qr: number): number {
    if (qr < l || r < ql) return 0;
    if (l === r) {
      // 叶子节点：基础值 × 路径上累计的乘数
      return this.xor[node] * this.lazy[node];
    }
    this.pushDown(node);
    const mid: number = (l + r) >> 1;
    return (
      this.queryXor(node * 2, l, mid, ql, qr) ^ this.queryXor(node * 2 + 1, mid + 1, r, ql, qr)
    );
  }

  rangeMultiply(ql: number, qr: number, k: number): void {
    if (this.n > 0) this.multiply(1, 0, this.n - 1, ql, qr, k);
  }

  rangeXor(ql: number, qr: number): number {
    if (this.n === 0) return 0;
    return this.queryXor(1, 0, this.n - 1, ql, qr);
  }
}

function xorAfterIntervalMultiplication2(nums: number[], queries: number[][]): number[] {
  const tree: LazyMulXorSegTree = new LazyMulXorSegTree(nums);
  const results: number[] = [];
  for (const query of queries) {
    const l: number = query[0];
    const r: number = query[1];
    const k: number = query[2];
    tree.rangeMultiply(l, r, k);
    // 全数组异或
    results.push(tree.rangeXor(0, nums.length - 1));
  }
  return results;
}

// 方法2：暴力模拟（适用于验证正确性 / 小规模数据）
function xorAfterIntervalMultiplication2Brute(nums: number[], queries: number[][]): number[] {
  const arr: number[] = [...nums];
  const results: number[] = [];
  for (const query of queries) {
    const l: number = query[0];
    const r: number = query[1];
    const k: number = query[2];
    for (let i = l; i <= r; i++) {
      arr[i] *= k;
    }
    let x: number = 0;
    for (const v of arr) {
      x ^= v;
    }
    results.push(x);
  }
  return results;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 056. 区间乘法查询后的异或 II =====");
const nums056: number[] = [1, 2, 3, 4];
const queries056: number[][] = [
  [0, 3, 2],
  [1, 2, 5],
];
// 查询1: [1,2,3,4] -> 区间[0,3]*2 -> [2,4,6,8] -> XOR = 2^4^6^8 = 8
// 查询2: [2,4,6,8] -> 区间[1,2]*5 -> [2,20,30,8] -> XOR = 2^20^30^8 = 0
console.log("方法1:", xorAfterIntervalMultiplication2(nums056, queries056)); // 期望结果: [8, 0]
console.log("方法2:", xorAfterIntervalMultiplication2Brute(nums056, queries056)); // 期望结果: [8, 0]

// 额外测试：含乘以 0 的情况
const nums056b: number[] = [5, 7, 9];
const queries056b: number[][] = [
  [0, 1, 0],
  [0, 2, 3],
];
// 查询1: [5,7,9] -> 区间[0,1]*0 -> [0,0,9] -> XOR = 0^0^9 = 9
// 查询2: [0,0,9] -> 区间[0,2]*3 -> [0,0,27] -> XOR = 0^0^27 = 27
console.log("方法1(含0):", xorAfterIntervalMultiplication2(nums056b, queries056b)); // 期望结果: [9, 27]
console.log("方法2(含0):", xorAfterIntervalMultiplication2Brute(nums056b, queries056b)); // 期望结果: [9, 27]

export {};
