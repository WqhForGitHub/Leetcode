// ============================================================
// 055. 区间乘法查询后的异或 I
// ============================================================
// LeetCode 55. XOR After Interval Multiplication I
// 给定数组 nums（数据规模较小）和查询列表 queries，每个查询为 [l, r, k]：
// 将 nums[l..r] 的每个元素乘以 k，然后计算整个数组的异或值。
// 返回每次查询后的异或结果数组。
// 方法1时间复杂度：O(q * n)，空间复杂度：O(n)
// 方法2时间复杂度：O(q * n)（建树 O(n)，每次区间乘 O(n)、查询 O(1)），空间复杂度：O(n)

// 方法1：直接模拟（推荐，小规模数据最直观）
// 每次查询：区间逐元素乘以 k，再遍历求异或。
function xorAfterIntervalMultiplication1(nums: number[], queries: number[][]): number[] {
  const arr: number[] = [...nums];
  const results: number[] = [];
  for (const query of queries) {
    const l: number = query[0];
    const r: number = query[1];
    const k: number = query[2];
    // 区间乘法
    for (let i = l; i <= r; i++) {
      arr[i] *= k;
    }
    // 计算全数组异或
    let x: number = 0;
    for (const v of arr) {
      x ^= v;
    }
    results.push(x);
  }
  return results;
}

// 方法2：线段树（区间乘法下推到叶子 + 维护区间 XOR）
// 每个节点存储其区间内元素的 XOR。区间乘法时递归到叶子更新值，
// 回溯时从子节点重新计算 XOR。区间 XOR 查询可利用节点缓存 O(log n)，
// 全数组异或直接取根节点 O(1)。
class MulXorSegTree {
  private xor: number[];
  private n: number;

  constructor(nums: number[]) {
    this.n = nums.length;
    this.xor = new Array(4 * Math.max(this.n, 1)).fill(0);
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

  // 区间乘法：递归到叶子更新，回溯重算 XOR
  private multiply(node: number, l: number, r: number, ql: number, qr: number, k: number): void {
    if (qr < l || r < ql) return;
    if (l === r) {
      this.xor[node] *= k;
      return;
    }
    const mid: number = (l + r) >> 1;
    this.multiply(node * 2, l, mid, ql, qr, k);
    this.multiply(node * 2 + 1, mid + 1, r, ql, qr, k);
    this.xor[node] = this.xor[node * 2] ^ this.xor[node * 2 + 1];
  }

  // 区间 XOR 查询
  private queryXor(node: number, l: number, r: number, ql: number, qr: number): number {
    if (qr < l || r < ql) return 0;
    if (ql <= l && r <= qr) return this.xor[node];
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

function xorAfterIntervalMultiplication1Seg(nums: number[], queries: number[][]): number[] {
  const tree: MulXorSegTree = new MulXorSegTree(nums);
  const results: number[] = [];
  for (const query of queries) {
    const l: number = query[0];
    const r: number = query[1];
    const k: number = query[2];
    tree.rangeMultiply(l, r, k);
    // 全数组异或 = 根节点 XOR
    results.push(tree.rangeXor(0, nums.length - 1));
  }
  return results;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 055. 区间乘法查询后的异或 I =====");
const nums055: number[] = [1, 2, 3];
const queries055: number[][] = [
  [0, 1, 2],
  [1, 2, 3],
];
// 查询1: [1,2,3] -> 区间[0,1]*2 -> [2,4,3] -> XOR = 2^4^3 = 5
// 查询2: [2,4,3] -> 区间[1,2]*3 -> [2,12,9] -> XOR = 2^12^9 = 7
console.log("方法1:", xorAfterIntervalMultiplication1(nums055, queries055)); // 期望结果: [5, 7]
console.log("方法2:", xorAfterIntervalMultiplication1Seg(nums055, queries055)); // 期望结果: [5, 7]

export {};
