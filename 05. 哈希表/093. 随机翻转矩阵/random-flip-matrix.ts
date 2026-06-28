// ============================================================
// 093. 随机翻转矩阵
// ============================================================
// LeetCode 519. Random Flip Matrix
// 设计一个数据结构，能随机将 m x n 矩阵中的 0 翻转为 1，
// 并支持 reset 将矩阵重置为全 0。使用哈希表实现虚拟映射。
// 时间复杂度：O(1) 均摊，空间复杂度：O(min(m*n, 操作次数))

class Solution {
  private rows: number;
  private cols: number;
  private total: number; // 剩余可翻转的位置数
  private map: Map<number, number>; // 虚拟映射：索引 -> 实际索引

  constructor(m: number, n: number) {
    this.rows = m;
    this.cols = n;
    this.total = m * n;
    this.map = new Map();
  }

  // Fisher-Yates 洗牌思想：把已访问的索引映射到未访问的索引
  flip(): number[] {
    if (this.total <= 0) return [];
    // 在 [0, total) 中随机选一个索引
    const r = Math.floor(Math.random() * this.total);
    this.total--;
    // 取出该位置真实对应的索引
    const idx = this.map.get(r) ?? r;
    // 将 r 位置映射到末尾未使用的索引
    const tail = this.map.get(this.total) ?? this.total;
    this.map.set(r, tail);
    this.map.delete(this.total);
    // 转换为二维坐标
    return [Math.floor(idx / this.cols), idx % this.cols];
  }

  // 重置：清空映射，恢复可翻转位置数
  reset(): void {
    this.map.clear();
    this.total = this.rows * this.cols;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 093. 随机翻转矩阵 =====");
// 测试 1: 3x1 矩阵翻转 3 次应覆盖所有位置
const sol1 = new Solution(3, 1);
const pos1: number[][] = [];
pos1.push(sol1.flip());
pos1.push(sol1.flip());
pos1.push(sol1.flip());
console.log("3x1 三次 flip:", pos1);
// 期望: 三组坐标覆盖所有 (0,0),(1,0),(2,0)
// 测试 2: reset 后可重新翻转
sol1.reset();
console.log("reset 后 flip:", sol1.flip());
// 期望: 返回任一坐标
// 测试 3: 1x1 矩阵
const sol3 = new Solution(1, 1);
console.log("1x1 flip:", sol3.flip());
// 期望: [0,0]

export {};
