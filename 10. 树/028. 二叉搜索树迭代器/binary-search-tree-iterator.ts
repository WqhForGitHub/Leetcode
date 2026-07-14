// ============================================================
// 028. 二叉搜索树迭代器
// ============================================================
// LeetCode 173. Binary Search Tree Iterator
// 实现一个二叉搜索树迭代器类 BSTIterator，表示按中序遍历二叉搜索树的迭代器。
// next() 返回下一个最小元素，hasNext() 返回是否还有下一个元素。
// 时间复杂度：构造 O(h)，next 均摊 O(1)；空间复杂度：O(h)

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

// 方法1：栈模拟中序（推荐，空间 O(h)）
class BSTIterator {
  private stack: TreeNode[] = [];

  constructor(root: TreeNode | null) {
    // 将根节点及其左子链全部入栈
    this.pushLeft(root);
  }

  private pushLeft(node: TreeNode | null): void {
    while (node !== null) {
      this.stack.push(node);
      node = node.left;
    }
  }

  next(): number {
    const node = this.stack.pop()!;
    // 弹出节点后，将其右子树的最左链入栈
    this.pushLeft(node.right);
    return node.val;
  }

  hasNext(): boolean {
    return this.stack.length > 0;
  }
}

// 方法2：预先中序遍历存数组（空间 O(n)）
class BSTIteratorFlatten {
  private values: number[] = [];
  private index: number = 0;

  constructor(root: TreeNode | null) {
    this.inorder(root);
  }

  private inorder(node: TreeNode | null): void {
    if (node === null) return;
    this.inorder(node.left);
    this.values.push(node.val);
    this.inorder(node.right);
  }

  next(): number {
    return this.values[this.index++];
  }

  hasNext(): boolean {
    return this.index < this.values.length;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 028. 二叉搜索树迭代器 =====");
// BST: [7,3,15,null,null,9,20]
//        7
//       / \
//      3   15
//         /  \
//        9    20
// 中序: [3,7,9,15,20]
function buildTree028(): TreeNode {
  return new TreeNode(7, new TreeNode(3), new TreeNode(15, new TreeNode(9), new TreeNode(20)));
}

const iter1 = new BSTIterator(buildTree028());
const result1: number[] = [];
while (iter1.hasNext()) {
  result1.push(iter1.next());
}
console.log("栈模拟中序:", result1); // [3,7,9,15,20]

const iter2 = new BSTIteratorFlatten(buildTree028());
const result2: number[] = [];
while (iter2.hasNext()) {
  result2.push(iter2.next());
}
console.log("预存数组:", result2); // [3,7,9,15,20]

// 空树
const emptyIter = new BSTIterator(null);
console.log("空树 hasNext:", emptyIter.hasNext()); // false

export {};
