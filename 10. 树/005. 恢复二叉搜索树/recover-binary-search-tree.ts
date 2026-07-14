// ============================================================
// 005. 恢复二叉搜索树
// ============================================================
// LeetCode 99. Recover Binary Search Tree
// 给你二叉搜索树的根节点 root，该树中的恰好两个节点的值被错误地交换。请恢复这棵树。
// 时间复杂度：O(n)，空间复杂度：O(h) 递归 / O(1) Morris

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

// 方法1：中序遍历找交换节点（推荐）
// 中序遍历 BST 应为递增序列，找出两个逆序点交换
function recoverTree(root: TreeNode | null): void {
  let first: TreeNode | null = null;
  let second: TreeNode | null = null;
  let prev: TreeNode | null = null;

  function inorder(node: TreeNode | null): void {
    if (node === null) return;
    inorder(node.left);
    // 检查逆序
    if (prev !== null && prev.val > node.val) {
      // 第一次逆序：first 记录前一个节点，second 记录当前节点
      // 第二次逆序：只需更新 second
      if (first === null) {
        first = prev;
      }
      second = node;
    }
    prev = node;
    inorder(node.right);
  }

  inorder(root);
  // 交换两个节点的值（闭包内赋值 TS 无法跟踪，使用类型断言）
  if (first !== null && second !== null) {
    const f = first as TreeNode;
    const s = second as TreeNode;
    const tmp = f.val;
    f.val = s.val;
    s.val = tmp;
  }
}

// 方法2：Morris 中序遍历
// 使用线索化实现 O(1) 空间中序遍历
function recoverTreeMorris(root: TreeNode | null): void {
  let first: TreeNode | null = null;
  let second: TreeNode | null = null;
  let prev: TreeNode | null = null;
  let curr: TreeNode | null = root;

  while (curr !== null) {
    if (curr.left === null) {
      // 访问当前节点
      if (prev !== null && prev.val > curr.val) {
        if (first === null) first = prev;
        second = curr;
      }
      prev = curr;
      curr = curr.right;
    } else {
      // 找到 curr 的前驱节点（左子树最右节点）
      let predecessor = curr.left;
      while (predecessor.right !== null && predecessor.right !== curr) {
        predecessor = predecessor.right;
      }
      if (predecessor.right === null) {
        // 建立线索
        predecessor.right = curr;
        curr = curr.left;
      } else {
        // 断开线索，访问当前节点
        predecessor.right = null;
        if (prev !== null && prev.val > curr.val) {
          if (first === null) first = prev;
          second = curr;
        }
        prev = curr;
        curr = curr.right;
      }
    }
  }

  // 交换两个节点的值
  if (first !== null && second !== null) {
    const tmp = first.val;
    first.val = second.val;
    second.val = tmp;
  }
}

// 辅助函数：中序遍历转为数组
function inorderArray(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }
  dfs(root);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 005. 恢复二叉搜索树 =====");
// 测试1: [1,3,null,null,2] -> 恢复为 [3,1,null,null,2]
const tree1 = new TreeNode(1, new TreeNode(3, null, new TreeNode(2)));
console.log("恢复前中序:", inorderArray(tree1)); // [1,3,2]
recoverTree(tree1);
console.log("恢复后中序:", inorderArray(tree1)); // [1,2,3]

// 测试2: [3,1,4,null,null,2] -> 恢复为 [2,1,4,null,null,3]
const tree2 = new TreeNode(3, new TreeNode(1), new TreeNode(4, new TreeNode(2)));
console.log("恢复前中序:", inorderArray(tree2)); // [1,3,2,4]
recoverTreeMorris(tree2);
console.log("恢复后中序 (Morris):", inorderArray(tree2)); // [1,2,3,4]

export {};
