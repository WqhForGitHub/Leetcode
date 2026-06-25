// ============================================================
// 数据结构面试题（三）- TypeScript 解题合集
// 主题：二叉树的最大路径和 / 动物王国中的食物链（带权并查集）/
//       平衡树的基本实现与红黑树的区别
// ============================================================

// ============================================================
// 1. 二叉树的最大路径和
// LeetCode 124. Binary Tree Maximum Path Sum
//
// 路径定义：从树中任意节点出发，沿父-子连接到达任意节点的序列
//          同一节点在路径中至多出现一次
//          路径至少包含一个节点
//
// 核心思路：
//   DFS 后序遍历，对于每个节点计算两个值：
//   1. 以当前节点为起点的最大路径和（只能选左或右一条分支）—— 返回给父节点
//   2. 经过当前节点的最大路径和（左 + 当前 + 右）—— 更新全局最大值
//
//   关键：节点值可以为负，所以贡献值 < 0 时取 0（不如不选）
//
// 时间复杂度：O(n)
// 空间复杂度：O(h)，h 为树高
// ============================================================

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

// 方法1：DFS 后序遍历 + 全局最大值（推荐）
function maxPathSum(root: TreeNode | null): number {
  let maxSum = -Infinity;

  function dfs(node: TreeNode | null): number {
    if (!node) return 0;

    // 递归计算左右子树的最大贡献值
    // 如果贡献值为负，则取 0（不选该分支反而更好）
    const leftGain = Math.max(dfs(node.left), 0);
    const rightGain = Math.max(dfs(node.right), 0);

    // 经过当前节点的路径和 = 左贡献 + 当前值 + 右贡献
    const pathSum = leftGain + node.val + rightGain;
    maxSum = Math.max(maxSum, pathSum);

    // 返回当前节点对父节点的最大贡献（只能选一条分支）
    return node.val + Math.max(leftGain, rightGain);
  }

  dfs(root);
  return maxSum;
}

// 方法2：返回值解构（更清晰但稍冗余）
function maxPathSumV2(root: TreeNode | null): number {
  let maxSum = -Infinity;

  function dfs(node: TreeNode | null): { maxBranch: number; maxPath: number } {
    if (!node) return { maxBranch: 0, maxPath: -Infinity };

    const left = dfs(node.left);
    const right = dfs(node.right);

    // 以当前节点为根的最大分支贡献（只能选左或右）
    const leftBranch = Math.max(left.maxBranch, 0);
    const rightBranch = Math.max(right.maxBranch, 0);
    const maxBranch = node.val + Math.max(leftBranch, rightBranch);

    // 经过当前节点的路径和
    const maxPath = leftBranch + node.val + rightBranch;

    return { maxBranch, maxPath };
  }

  const result = dfs(root);
  return Math.max(
    result.maxPath,
    maxSum === -Infinity ? result.maxPath : maxSum,
  );
}

// ============================================================
// 2. 动物王国中的食物链
// POJ 1182 / 洛谷 P2024
//
// 题意：
//   有 N 只动物，编号 1~N，构成 A → B → C → A 的环形食物链
//   给出 K 条信息：
//     类型 1: X 和 Y 是同类
//     类型 2: X 吃 Y
//   判断有多少条信息是假的（与之前的信息矛盾）
//
// 核心思路：带权（关系）并查集
//   - parent[i]: i 的父节点
//   - relation[i]: i 到父节点的关系 d(i, parent[i])
//     d(x, y) 定义：0 = 同类，1 = x 吃 y，2 = y 吃 x（x 被吃）
//   - 关系合成：d(a, c) = (d(a, b) + d(b, c)) % 3
//   - 关系取逆：d(b, a) = (3 - d(a, b)) % 3
//
// 时间复杂度：O(K · α(N))，α 为反阿克曼函数
// 空间复杂度：O(N)
// ============================================================

class FoodChain {
  private parent: number[];
  private relation: number[]; // relation[i]: d(i, parent[i])，0=同类, 1=i吃父, 2=父吃i
  private lies: number; // 假话数量

  constructor(private n: number) {
    this.parent = Array.from({ length: n + 1 }, (_, i) => i); // 1-indexed
    this.relation = new Array(n + 1).fill(0);
    this.lies = 0;
  }

  // 带路径压缩的查找，同时更新关系
  // 返回 { root, rel }，rel 为 x 到 root 的关系
  private find(x: number): { root: number; rel: number } {
    if (this.parent[x] === x) {
      return { root: x, rel: 0 };
    }

    const { root, rel: parentRel } = this.find(this.parent[x]);
    // x 到 root 的关系 = x 到 parent[x] 的关系 + parent[x] 到 root 的关系
    this.relation[x] = (this.relation[x] + parentRel) % 3;
    this.parent[x] = root;

    return { root, rel: this.relation[x] };
  }

  // 处理一条信息
  // type: 1 = 同类, 2 = X 吃 Y
  process(type: number, x: number, y: number): void {
    // 编号越界
    if (x < 1 || x > this.n || y < 1 || y > this.n) {
      this.lies++;
      return;
    }

    // 自己吃自己一定是假话
    if (type === 2 && x === y) {
      this.lies++;
      return;
    }

    const findX = this.find(x);
    const findY = this.find(y);

    if (findX.root !== findY.root) {
      // 还在同一集合中，无法判断，合并
      // 设 parent[findY.root] = findX.root
      // 需要: relation[findY.root] 使得条件满足
      this.parent[findY.root] = findX.root;

      if (type === 1) {
        // x 和 y 同类 → d(x, y) = 0
        // relation[findY.root] = (findX.rel - findY.rel + 3) % 3
        this.relation[findY.root] = (findX.rel - findY.rel + 3) % 3;
      } else {
        // x 吃 y → d(x, y) = 1
        // relation[findY.root] = (findX.rel - findY.rel - 1 + 3) % 3 = (findX.rel - findY.rel + 2) % 3
        this.relation[findY.root] = (findX.rel - findY.rel + 2 + 3) % 3;
      }
    } else {
      // 已经在同一集合，判断是否矛盾
      // d(x, y) = (findX.rel - findY.rel + 3) % 3
      const relXY = (findX.rel - findY.rel + 3) % 3;

      if (type === 1) {
        // 同类 → d(x,y) 应为 0
        if (relXY !== 0) this.lies++;
      } else {
        // x 吃 y → d(x,y) 应为 1
        if (relXY !== 1) this.lies++;
      }
    }
  }

  getLies(): number {
    return this.lies;
  }
}

// ============================================================
// 3. 平衡树的基本实现，与红黑树的区别
//
// 本节实现：
//   (a) AVL 树的基本操作（插入 + 旋转）
//   (b) 红黑树的基本操作（插入 + 旋转 + 变色）
//   (c) AVL 树 vs 红黑树的核心区别总结
// ============================================================

// ---------------------- (a) AVL 树 ----------------------
// AVL 树：严格平衡二叉搜索树
//   任意节点的左右子树高度差（平衡因子）绝对值 ≤ 1
//   插入/删除后通过旋转维持平衡

class AVLNode {
  val: number;
  left: AVLNode | null;
  right: AVLNode | null;
  height: number; // 节点高度

  constructor(val: number) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  root: AVLNode | null;

  constructor() {
    this.root = null;
  }

  // --- 辅助函数 ---

  private getHeight(node: AVLNode | null): number {
    return node ? node.height : 0;
  }

  private getBalance(node: AVLNode | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  private updateHeight(node: AVLNode): void {
    node.height =
      1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  // 右旋（LL 型失衡）
  //       y              x
  //      / \            / \
  //     x   T3  →     T1  y
  //    / \                / \
  //   T1  T2            T2  T3
  private rotateRight(y: AVLNode): AVLNode {
    const x = y.left!;
    const t2 = x.right;

    x.right = y;
    y.left = t2;

    this.updateHeight(y);
    this.updateHeight(x);
    return x;
  }

  // 左旋（RR 型失衡）
  //     x                y
  //    / \              / \
  //   T1  y    →      x   T3
  //      / \         / \
  //     T2  T3     T1  T2
  private rotateLeft(x: AVLNode): AVLNode {
    const y = x.right!;
    const t2 = y.left;

    y.left = x;
    x.right = t2;

    this.updateHeight(x);
    this.updateHeight(y);
    return y;
  }

  // 插入
  insert(val: number): void {
    this.root = this.insertNode(this.root, val);
  }

  private insertNode(node: AVLNode | null, val: number): AVLNode {
    // 1. 标准 BST 插入
    if (!node) return new AVLNode(val);

    if (val < node.val) {
      node.left = this.insertNode(node.left, val);
    } else if (val > node.val) {
      node.right = this.insertNode(node.right, val);
    } else {
      return node; // 不插入重复值
    }

    // 2. 更新高度
    this.updateHeight(node);

    // 3. 获取平衡因子，检查是否失衡
    const balance = this.getBalance(node);

    // LL 型：左子树高，新节点在左子树的左边
    if (balance > 1 && val < node.left!.val) {
      return this.rotateRight(node);
    }

    // RR 型：右子树高，新节点在右子树的右边
    if (balance < -1 && val > node.right!.val) {
      return this.rotateLeft(node);
    }

    // LR 型：左子树高，新节点在左子树的右边
    if (balance > 1 && val > node.left!.val) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    // RL 型：右子树高，新节点在右子树的左边
    if (balance < -1 && val < node.right!.val) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }

  // 中序遍历（验证 BST 性质）
  inorder(): number[] {
    const result: number[] = [];
    function traverse(node: AVLNode | null) {
      if (!node) return;
      traverse(node.left);
      result.push(node.val);
      traverse(node.right);
    }
    traverse(this.root);
    return result;
  }
}

// ---------------------- (b) 红黑树 ----------------------
// 红黑树五条性质：
//   1. 每个节点是红色或黑色
//   2. 根节点是黑色
//   3. 每个叶子节点（NIL）是黑色
//   4. 红色节点的两个子节点都是黑色（不能有连续红节点）
//   5. 从任一节点到其所有叶子节点的路径都包含相同数目的黑色节点

enum Color {
  RED,
  BLACK,
}

// 红黑树使用 NIL 哨兵节点替代 null，简化空指针判断
// 所有 RBNode 的 left/right/parent 都指向 NIL 或实际节点，不会为 null
class RBNode {
  val: number;
  color: Color;
  left: RBNode;
  right: RBNode;
  parent: RBNode;

  constructor(
    val: number,
    color: Color = Color.RED,
    nil: RBNode | null = null,
  ) {
    this.val = val;
    this.color = color;
    // 如果提供了 nil 哨兵，用它初始化；否则指向自身（用于创建 NIL 节点本身）
    this.left = nil ?? this;
    this.right = nil ?? this;
    this.parent = nil ?? this;
  }
}

class RedBlackTree {
  root: RBNode;
  private readonly NIL: RBNode; // 哨兵节点

  constructor() {
    // NIL 节点为黑色，left/right/parent 指向自身
    this.NIL = new RBNode(0, Color.BLACK);
    this.NIL.left = this.NIL;
    this.NIL.right = this.NIL;
    this.NIL.parent = this.NIL;
    this.root = this.NIL;
  }

  // 左旋
  private rotateLeft(x: RBNode): void {
    const y = x.right;
    x.right = y.left;

    if (y.left !== this.NIL) {
      y.left.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === this.NIL) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;
  }

  // 右旋
  private rotateRight(y: RBNode): void {
    const x = y.left;
    y.left = x.right;

    if (x.right !== this.NIL) {
      x.right.parent = y;
    }

    x.parent = y.parent;

    if (y.parent === this.NIL) {
      this.root = x;
    } else if (y === y.parent.left) {
      y.parent.left = x;
    } else {
      y.parent.right = x;
    }

    x.right = y;
    y.parent = x;
  }

  // 插入
  insert(val: number): void {
    const newNode = new RBNode(val, Color.RED, this.NIL);

    // 标准 BST 插入
    let parent = this.NIL;
    let current = this.root;

    while (current !== this.NIL) {
      parent = current;
      if (newNode.val < current.val) {
        current = current.left;
      } else if (newNode.val > current.val) {
        current = current.right;
      } else {
        return; // 不插入重复值
      }
    }

    newNode.parent = parent;

    if (parent === this.NIL) {
      this.root = newNode;
    } else if (newNode.val < parent.val) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    // 修复红黑树性质
    this.insertFixup(newNode);
  }

  // 插入修复
  private insertFixup(z: RBNode): void {
    // 当 z 的父节点是红色时，违反性质 4
    while (z.parent.color === Color.RED) {
      if (z.parent === z.parent.parent.left) {
        const uncle = z.parent.parent.right;

        // Case 1: 叔叔是红色 → 变色
        if (uncle.color === Color.RED) {
          z.parent.color = Color.BLACK;
          uncle.color = Color.BLACK;
          z.parent.parent.color = Color.RED;
          z = z.parent.parent;
        } else {
          // Case 2: 叔叔是黑色，z 是右孩子 → 左旋变为 Case 3
          if (z === z.parent.right) {
            z = z.parent;
            this.rotateLeft(z);
          }
          // Case 3: 叔叔是黑色，z 是左孩子 → 变色 + 右旋
          z.parent.color = Color.BLACK;
          z.parent.parent.color = Color.RED;
          this.rotateRight(z.parent.parent);
        }
      } else {
        // 镜像情况：父节点是祖父的右孩子
        const uncle = z.parent.parent.left;

        if (uncle.color === Color.RED) {
          z.parent.color = Color.BLACK;
          uncle.color = Color.BLACK;
          z.parent.parent.color = Color.RED;
          z = z.parent.parent;
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            this.rotateRight(z);
          }
          z.parent.color = Color.BLACK;
          z.parent.parent.color = Color.RED;
          this.rotateLeft(z.parent.parent);
        }
      }
    }

    // 性质 2: 根节点必须是黑色
    this.root.color = Color.BLACK;
  }

  // 中序遍历
  inorder(): number[] {
    const result: number[] = [];
    const traverse = (node: RBNode) => {
      if (node === this.NIL) return;
      traverse(node.left);
      result.push(node.val);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  // 验证红黑树性质
  isValid(): boolean {
    if (this.root === this.NIL) return true;

    // 性质 2: 根是黑色
    if (this.root.color !== Color.BLACK) return false;

    // 性质 4 & 5
    const check = (node: RBNode): { valid: boolean; blackHeight: number } => {
      if (node === this.NIL) return { valid: true, blackHeight: 1 }; // NIL 为黑色

      // 性质 4: 红色节点不能有红色子节点
      if (node.color === Color.RED) {
        if (node.left.color === Color.RED || node.right.color === Color.RED) {
          return { valid: false, blackHeight: 0 };
        }
      }

      const left = check(node.left);
      const right = check(node.right);

      if (!left.valid || !right.valid) return { valid: false, blackHeight: 0 };

      // 性质 5: 左右黑高相同
      if (left.blackHeight !== right.blackHeight) {
        return { valid: false, blackHeight: 0 };
      }

      return {
        valid: true,
        blackHeight: left.blackHeight + (node.color === Color.BLACK ? 1 : 0),
      };
    };

    return check(this.root).valid;
  }
}

// ---------------------- (c) AVL 树 vs 红黑树 区别总结 ----------------------
//
// ┌──────────────────┬──────────────────────────────┬──────────────────────────────────┐
// │      特性         │          AVL 树              │           红黑树                  │
// ├──────────────────┼──────────────────────────────┼──────────────────────────────────┤
// │ 平衡标准          │ 严格平衡：|平衡因子| ≤ 1     │ 弱平衡：黑高相同即可              │
// │ 最大高度          │ O(1.44 log n)                │ O(2 log n)                       │
// │ 查找效率          │ 更优（更矮）                 │ 稍逊（可能更高）                  │
// │ 插入旋转次数      │ 最多 O(log n) 次旋转         │ 最多 2 次旋转 + O(log n) 次变色   │
// │ 删除旋转次数      │ 最多 O(log n) 次旋转         │ 最多 3 次旋转 + O(log n) 次变色   │
// │ 插入/删除效率     │ 旋转多，写操作慢              │ 旋转少，写操作快                  │
// │ 适用场景          │ 读多写少（查找密集型）        │ 读写均衡（插入/删除频繁）          │
// │ 实现复杂度        │ 较简单                       │ 较复杂（变色 + 旋转 + 哨兵）      │
// │ 典型应用          │ Windows 进程地址空间管理、    │ Linux 进程调度 CFS、Java TreeMap、│
// │                  │ SQLite 内部索引               │ C++ std::map、Linux epoll        │
// └──────────────────┴──────────────────────────────┴──────────────────────────────────┘
//
// 核心区别一句话总结：
//   AVL 树追求"严格平衡"以优化查找，代价是写操作需要更多旋转；
//   红黑树追求"弱平衡"以减少旋转次数，牺牲少量查找效率换取更快的写操作。
//
// 面试口诀：读多用 AVL，写多用红黑树。

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 二叉树的最大路径和 =====");
// 构造树：
//       -10
//       /  \
//      9   20
//          / \
//         15  7
const tree1 = new TreeNode(
  -10,
  new TreeNode(9),
  new TreeNode(20, new TreeNode(15), new TreeNode(7)),
);
console.log(maxPathSum(tree1)); // 42 (15 + 20 + 7)

// 构造树：只有右子树链 2 → -1 → -3
const tree2 = new TreeNode(2, null, new TreeNode(-1, null, new TreeNode(-3)));
console.log(maxPathSum(tree2)); // 2（只取根节点）

// 构造树：单节点
const tree3 = new TreeNode(-3);
console.log(maxPathSum(tree3)); // -3

// 构造树：
//        5
//       / \
//      4   8
//     /   / \
//    11  13  4
//   /  \      \
//  7    2      1
const tree4 = new TreeNode(
  5,
  new TreeNode(4, new TreeNode(11, new TreeNode(7), new TreeNode(2))),
  new TreeNode(8, new TreeNode(13), new TreeNode(4, null, new TreeNode(1))),
);
console.log(maxPathSum(tree4)); // 48 (11 → 4 → 5 → 8 → 13 → ... 实际 7+11+4+5+8+13=48)

console.log("\n===== 2. 动物王国中的食物链 =====");
// 经典测试用例：N=5, K 条信息
const fc = new FoodChain(5);
fc.process(1, 1, 2); // 1 和 2 同类 → 真
fc.process(2, 1, 3); // 1 吃 3 → 真（与 1、2 同类一致：2 也吃 3）
fc.process(2, 3, 5); // 3 吃 5 → 真
fc.process(1, 5, 1); // 5 和 1 同类 → 假（1 吃 3，3 吃 5 → 1 吃 5，不能同类）
fc.process(2, 1, 2); // 1 吃 2 → 假（1 和 2 是同类）
fc.process(2, 1, 1); // 1 吃 1 → 假（自己吃自己）
console.log("假话数量:", fc.getLies()); // 3

// 补充测试
const fc2 = new FoodChain(3);
fc2.process(1, 1, 2); // 同类
fc2.process(2, 2, 3); // 2 吃 3
fc2.process(2, 3, 1); // 3 吃 1 → 假（1和2同类，2吃3，3应被1吃，不能吃1）
console.log("假话数量:", fc2.getLies()); // 1

console.log("\n===== 3. AVL 树 =====");
const avl = new AVLTree();
const insertOrder = [10, 20, 30, 40, 50, 25];
for (const val of insertOrder) {
  avl.insert(val);
}
console.log("AVL 中序遍历:", avl.inorder()); // [10, 20, 25, 30, 40, 50]
// 插入后应该是平衡的

console.log("\n===== 4. 红黑树 =====");
const rbt = new RedBlackTree();
const rbInsertOrder = [10, 20, 30, 15, 25, 5, 8, 12];
for (const val of rbInsertOrder) {
  rbt.insert(val);
}
console.log("红黑树中序遍历:", rbt.inorder()); // [5, 8, 10, 12, 15, 20, 25, 30]
console.log("红黑树性质验证:", rbt.isValid()); // true

export {};
