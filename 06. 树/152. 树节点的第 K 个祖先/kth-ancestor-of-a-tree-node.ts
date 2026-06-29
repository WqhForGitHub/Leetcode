// ============================================================
// 152. 树节点的第 K 个祖先
// ============================================================
// LeetCode 1483. Kth Ancestor of a Tree Node
// 给定一棵树，树中的节点编号为 0 到 n-1。实现 TreeAncestor 类，
// 能够返回节点的第 k 个祖先。
// 时间复杂度：预处理 O(n log k)，查询 O(log k)，空间复杂度：O(n log k)

// 方法1：二进制提升（倍增）
// up[i][j] 表示节点 i 的第 2^j 个祖先
// up[i][j] = up[ up[i][j-1] ][j-1]
class TreeAncestor {
  // up[i][j] = 节点 i 的第 2^j 个祖先
  private up: number[][];
  private log: number;

  constructor(n: number, parent: number[]) {
    // log 为 n 的二进制位数上限
    this.log = Math.floor(Math.log2(n)) + 1;
    this.up = Array.from({ length: n }, () => new Array(this.log).fill(-1));

    // j = 0：直接父节点
    for (let i = 0; i < n; i++) {
      this.up[i][0] = parent[i];
    }

    // 递推：j > 0
    for (let j = 1; j < this.log; j++) {
      for (let i = 0; i < n; i++) {
        const mid = this.up[i][j - 1];
        if (mid !== -1) {
          this.up[i][j] = this.up[mid][j - 1];
        } else {
          this.up[i][j] = -1;
        }
      }
    }
  }

  getKthAncestor(node: number, k: number): number {
    // 将 k 拆成 2 的幂次之和，依次跳跃
    for (let j = 0; j < this.log; j++) {
      if ((k >> j) & 1) {
        node = this.up[node][j];
        if (node === -1) return -1;
      }
    }
    return node;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 152. 树节点的第 K 个祖先 =====");

// 树结构：
//        0
//       /|\
//      1 2 3
//     /|  |
//    4 5  6
//   /
//  7
const tree = new TreeAncestor(8, [-1, 0, 0, 0, 1, 1, 2, 4]);
console.log("getKthAncestor(7,3):", tree.getKthAncestor(7, 3)); // 期望 0
console.log("getKthAncestor(7,2):", tree.getKthAncestor(7, 2)); // 期望 1
console.log("getKthAncestor(7,1):", tree.getKthAncestor(7, 1)); // 期望 4
console.log("getKthAncestor(5,2):", tree.getKthAncestor(5, 2)); // 期望 -1
console.log("getKthAncestor(3,1):", tree.getKthAncestor(3, 1)); // 期望 0
console.log("getKthAncestor(0,1):", tree.getKthAncestor(0, 1)); // 期望 -1

export {};
