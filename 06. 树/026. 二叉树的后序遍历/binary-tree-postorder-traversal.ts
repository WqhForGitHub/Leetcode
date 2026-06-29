// ============================================================
// 026. 二叉树的后序遍历
// ============================================================
// LeetCode 145. Binary Tree Postorder Traversal
// 给你二叉树的根节点 root，返回它节点值的后序遍历（左 -> 右 -> 根）。
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

// 方法1：递归（推荐）
function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    dfs(node.left);
    dfs(node.right);
    result.push(node.val);
  }
  dfs(root);
  return result;
}

// 方法2：迭代栈（修改前序 根->右->左 后反转）
function postorderTraversalIterative(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (root === null) return result;
  const stack: TreeNode[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node.val);
    // 先压左再压右，弹出顺序为右在前 -> 得到 根->右->左
    if (node.left !== null) stack.push(node.left);
    if (node.right !== null) stack.push(node.right);
  }
  // 反转得到 左->右->根
  result.reverse();
  return result;
}

// 方法3：Morris 遍历（空间 O(1)）
// 利用前驱线索，倒序输出右子树路径上的节点
function postorderTraversalMorris(root: TreeNode | null): number[] {
  const result: number[] = [];
  // 哨兵节点
  const dummy = new TreeNode(0);
  dummy.left = root;
  let curr: TreeNode | null = dummy;
  while (curr !== null) {
    if (curr.left === null) {
      curr = curr.right;
    } else {
      let prev: TreeNode | null = curr.left;
      while (prev.right !== null && prev.right !== curr) {
        prev = prev.right;
      }
      if (prev.right === null) {
        prev.right = curr;
        curr = curr.left;
      } else {
        // 倒序输出 curr.left 到 prev 路径上的节点
        const temp: number[] = [];
        let p: TreeNode | null = curr.left;
        while (p !== null && p !== curr) {
          temp.push(p.val);
          p = p.right;
        }
        while (temp.length > 0) {
          result.push(temp.pop()!);
        }
        prev.right = null;
        curr = curr.right;
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 026. 二叉树的后序遍历 =====");
// 树: [1,null,2,3]
const tree026 = new TreeNode(1, null, new TreeNode(2, new TreeNode(3)));
console.log("递归:", postorderTraversal(tree026)); // [3,2,1]
console.log("迭代:", postorderTraversalIterative(tree026)); // [3,2,1]
console.log("Morris:", postorderTraversalMorris(tree026)); // [3,2,1]

// 树: [1,2,3,4,5,null,6]
const tree026b = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5)),
  new TreeNode(3, null, new TreeNode(6)),
);
console.log("递归 [1,2,3,4,5,null,6]:", postorderTraversal(tree026b)); // [4,5,2,6,3,1]
console.log("迭代 [1,2,3,4,5,null,6]:", postorderTraversalIterative(tree026b)); // [4,5,2,6,3,1]
console.log("Morris [1,2,3,4,5,null,6]:", postorderTraversalMorris(tree026b)); // [4,5,2,6,3,1]

console.log("空树:", postorderTraversal(null)); // []
console.log("空树:", postorderTraversalIterative(null)); // []
console.log("空树:", postorderTraversalMorris(null)); // []

export {};
