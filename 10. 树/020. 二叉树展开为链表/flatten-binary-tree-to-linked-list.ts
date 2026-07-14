// ============================================================
// 020. 二叉树展开为链表
// ============================================================
// LeetCode 114. Flatten Binary Tree to Linked List
// 给你二叉树的根节点 root，将它展开为一个单链表（所有节点右子树链，左子树为 null）。
// 时间复杂度：O(n)，空间复杂度：O(n)

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

// 方法1：前序遍历递归，先收集再重组
function flatten(root: TreeNode | null): void {
  const list: TreeNode[] = [];
  function preorder(node: TreeNode | null): void {
    if (node === null) return;
    list.push(node);
    preorder(node.left);
    preorder(node.right);
  }
  preorder(root);
  for (let i = 1; i < list.length; i++) {
    const prev = list[i - 1];
    const curr = list[i];
    prev.left = null;
    prev.right = curr;
  }
}

// 方法2：迭代前序遍历（使用栈）
function flattenIterative(root: TreeNode | null): void {
  if (root === null) return;
  const stack: TreeNode[] = [root];
  let prev: TreeNode | null = null;
  while (stack.length > 0) {
    const curr = stack.pop()!;
    if (prev !== null) {
      prev.left = null;
      prev.right = curr;
    }
    // 先压右再压左，保证弹出顺序为前序
    if (curr.right !== null) stack.push(curr.right);
    if (curr.left !== null) stack.push(curr.left);
    prev = curr;
  }
}

// 方法3：前驱节点法（空间 O(1)，推荐）
// 对每个节点，找到左子树的最右节点，将右子树挂接到该最右节点的右子树
function flattenMorris(root: TreeNode | null): void {
  let curr = root;
  while (curr !== null) {
    if (curr.left !== null) {
      // 找到左子树的最右节点（前驱）
      let predecessor = curr.left;
      while (predecessor.right !== null) {
        predecessor = predecessor.right;
      }
      // 将当前右子树挂到前驱的右子树
      predecessor.right = curr.right;
      // 将左子树移到右子树
      curr.right = curr.left;
      curr.left = null;
    }
    // 移动到下一个节点（原右子树位置）
    curr = curr.right;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 020. 二叉树展开为链表 =====");
function buildTree020(): TreeNode {
  return new TreeNode(
    1,
    new TreeNode(2, new TreeNode(3), new TreeNode(4)),
    new TreeNode(5, null, new TreeNode(6)),
  );
}
function printFlattened(root: TreeNode | null): number[] {
  const result: number[] = [];
  let curr = root;
  while (curr !== null) {
    result.push(curr.val);
    if (curr.left !== null) result.push(-1); // 标记左指针未清空
    curr = curr.right;
  }
  return result;
}

// 测试方法1
const tree020a = buildTree020();
flatten(tree020a);
console.log("递归前序:", printFlattened(tree020a)); // [1,2,3,4,5,6]

// 测试方法2
const tree020b = buildTree020();
flattenIterative(tree020b);
console.log("迭代前序:", printFlattened(tree020b)); // [1,2,3,4,5,6]

// 测试方法3
const tree020c = buildTree020();
flattenMorris(tree020c);
console.log("前驱节点法:", printFlattened(tree020c)); // [1,2,3,4,5,6]

// 空树
const emptyTree: TreeNode | null = null;
flatten(emptyTree);
console.log("空树:", printFlattened(emptyTree)); // []

export {};
