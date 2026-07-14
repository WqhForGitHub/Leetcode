// ============================================================
// 015. 区域和检索 - 数组可修改
// ============================================================
// LeetCode 307. Range Sum Query - Mutable
// 设计一个数据结构，支持两个操作：
//   update(index, val)：将 nums[index] 更新为 val
//   sumRange(left, right)：返回 nums[left..right] 的和
// 时间复杂度：O(log n) / O(log n) / O(sqrt n) 每次操作, 空间复杂度：O(n)

// 方法1：线段树（分治）（推荐）
// 用数组存储完全二叉树，叶子在 [n, 2n-1]，更新与查询均为 O(log n)
class NumArray1 {
  private n: number;
  private tree: number[];

  constructor(nums: number[]) {
    this.n = nums.length;
    this.tree = new Array(2 * this.n);
    // 叶子节点存储原数组
    for (let i: number = 0; i < this.n; i++) {
      this.tree[this.n + i] = nums[i];
    }
    // 自底向上构建内部节点（分治合并）
    for (let i: number = this.n - 1; i > 0; i--) {
      this.tree[i] = this.tree[2 * i] + this.tree[2 * i + 1];
    }
  }

  update(index: number, val: number): void {
    let pos: number = index + this.n;
    this.tree[pos] = val;
    // 向上更新所有祖先节点
    while (pos > 1) {
      pos >>= 1;
      this.tree[pos] = this.tree[2 * pos] + this.tree[2 * pos + 1];
    }
  }

  sumRange(left: number, right: number): number {
    let l: number = left + this.n;
    let r: number = right + this.n;
    let sum: number = 0;
    while (l <= r) {
      if (l % 2 === 1) sum += this.tree[l++]; // l 是右儿子，单独累加
      if (r % 2 === 0) sum += this.tree[r--]; // r 是左儿子，单独累加
      l >>= 1;
      r >>= 1;
    }
    return sum;
  }
}

// 方法2：树状数组（Fenwick Tree）
// 利用 lowbit 维护前缀和，更新与查询均为 O(log n)
class NumArray2 {
  private n: number;
  private tree: number[];
  private nums: number[];

  constructor(nums: number[]) {
    this.n = nums.length;
    this.nums = [...nums];
    this.tree = new Array(this.n + 1).fill(0);
    for (let i: number = 0; i < this.n; i++) {
      this.add(i + 1, nums[i]);
    }
  }

  private add(i: number, delta: number): void {
    while (i <= this.n) {
      this.tree[i] += delta;
      i += i & -i;
    }
  }

  private prefixSum(i: number): number {
    let sum: number = 0;
    while (i > 0) {
      sum += this.tree[i];
      i -= i & -i;
    }
    return sum;
  }

  update(index: number, val: number): void {
    const delta: number = val - this.nums[index];
    this.nums[index] = val;
    this.add(index + 1, delta);
  }

  sumRange(left: number, right: number): number {
    return this.prefixSum(right + 1) - this.prefixSum(left);
  }
}

// 方法3：分块（sqrt 分解）
// 将数组分成长度 sqrt(n) 的若干块，更新 O(1)，查询 O(sqrt n)
class NumArray3 {
  private n: number;
  private block: number;
  private blocks: number[];
  private nums: number[];

  constructor(nums: number[]) {
    this.n = nums.length;
    this.nums = [...nums];
    this.block = Math.max(1, Math.ceil(Math.sqrt(this.n)));
    this.blocks = new Array(Math.ceil(this.n / this.block)).fill(0);
    for (let i: number = 0; i < this.n; i++) {
      this.blocks[Math.floor(i / this.block)] += nums[i];
    }
  }

  update(index: number, val: number): void {
    const b: number = Math.floor(index / this.block);
    this.blocks[b] += val - this.nums[index];
    this.nums[index] = val;
  }

  sumRange(left: number, right: number): number {
    let sum: number = 0;
    const bL: number = Math.floor(left / this.block);
    const bR: number = Math.floor(right / this.block);
    if (bL === bR) {
      // 同一块内逐个累加
      for (let i: number = left; i <= right; i++) sum += this.nums[i];
    } else {
      // 左侧不完整块
      for (let i: number = left; i < (bL + 1) * this.block; i++) sum += this.nums[i];
      // 中间完整块
      for (let b: number = bL + 1; b < bR; b++) sum += this.blocks[b];
      // 右侧不完整块
      for (let i: number = bR * this.block; i <= right; i++) sum += this.nums[i];
    }
    return sum;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 015. 区域和检索 - 数组可修改 =====");
const na1: NumArray1 = new NumArray1([1, 3, 5]);
console.log("线段树 sumRange(0,2):", na1.sumRange(0, 2)); // 期望结果: 9
na1.update(1, 2);
console.log("线段树 update(1,2) 后 sumRange(0,2):", na1.sumRange(0, 2)); // 期望结果: 8

const na2: NumArray2 = new NumArray2([1, 3, 5]);
console.log("树状数组 sumRange(0,2):", na2.sumRange(0, 2)); // 期望结果: 9
na2.update(1, 2);
console.log("树状数组 update(1,2) 后 sumRange(0,2):", na2.sumRange(0, 2)); // 期望结果: 8

const na3: NumArray3 = new NumArray3([1, 3, 5, 7, 9, 11]);
console.log("分块 sumRange(0,5):", na3.sumRange(0, 5)); // 期望结果: 36
na3.update(3, 10);
console.log("分块 update(3,10) 后 sumRange(0,5):", na3.sumRange(0, 5)); // 期望结果: 39
console.log("分块 sumRange(2,4):", na3.sumRange(2, 4)); // 期望结果: 24

export {};
