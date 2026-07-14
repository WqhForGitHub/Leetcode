// ============================================================
// 116. 树节点的第 K 个祖先
// ============================================================
// LeetCode 1483. Kth Ancestor of a Tree Node
// 树中节点的第 k 个祖先。

// 方法1：二进制提升（Binary Lifting）
class TreeAncestor {
  private ancestors: number[][]; // ancestors[i][j] = 节点 i 的第 2^j 个祖先

  constructor(n: number, parent: number[]) {
    const maxLevel = Math.floor(Math.log2(n)) + 1;
    this.ancestors = new Array(n);
    for (let i = 0; i < n; i++) {
      this.ancestors[i] = new Array(maxLevel).fill(-1);
      this.ancestors[i][0] = parent[i];
    }
    // 预处理
    for (let j = 1; j < maxLevel; j++) {
      for (let i = 0; i < n; i++) {
        if (this.ancestors[i][j - 1] !== -1) {
          this.ancestors[i][j] = this.ancestors[this.ancestors[i][j - 1]][j - 1];
        }
      }
    }
  }

  getKthAncestor(node: number, k: number): number {
    while (k > 0 && node !== -1) {
      const level = Math.floor(Math.log2(k));
      node = this.ancestors[node][level];
      if (node === -1) return -1;
      k -= 1 << level;
    }
    return node;
  }
}

// 方法2：暴力向上跳（O(k) 每次，仅用于小数据）
class TreeAncestorBrute {
  private parent: number[];

  constructor(n: number, parent: number[]) {
    this.parent = parent;
  }

  getKthAncestor(node: number, k: number): number {
    while (k > 0 && node !== -1) {
      node = this.parent[node];
      k--;
    }
    return node;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 116. 树节点的第 K 个祖先 =====");
const ta = new TreeAncestor(7, [-1, 0, 0, 1, 1, 2, 2]);
console.log("getKth(3,1):", ta.getKthAncestor(3, 1)); // 1
console.log("getKth(5,2):", ta.getKthAncestor(5, 2)); // 0
console.log("getKth(6,3):", ta.getKthAncestor(6, 3)); // -1

export {};
