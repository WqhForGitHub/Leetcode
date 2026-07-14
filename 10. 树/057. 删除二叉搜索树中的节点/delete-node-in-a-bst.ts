// ============================================================
// 057. 删除二叉搜索树中的节点
// ============================================================
// LeetCode 450. Delete Node in a BST
// 给定一个二叉搜索树的根节点 root 和一个值 key，
// 删除二叉搜索树中的 key 对应的节点，并保证二叉搜索树的性质不变。
// 时间复杂度：O(h)，空间复杂度：O(h) （h为树高）

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
// 分三种情况：
// 1. 节点为空：返回 null
// 2. key 小于当前节点值：在左子树中删除
// 3. key 大于当前节点值：在右子树中删除
// 4. 找到目标节点：
//    a. 左子树为空：返回右子树
//    b. 右子树为空：返回左子树
//    c. 左右都不为空：找到右子树最小值替换当前节点，再删除右子树中的最小值
function deleteNode(root: TreeNode | null, key: number): TreeNode | null {
  if (root === null) return null;

  if (key < root.val) {
    root.left = deleteNode(root.left, key);
  } else if (key > root.val) {
    root.right = deleteNode(root.right, key);
  } else {
    // 找到目标节点
    if (root.left === null) {
      return root.right;
    }
    if (root.right === null) {
      return root.left;
    }
    // 左右子树都存在：找到右子树的最小节点
    let minNode = root.right;
    while (minNode.left !== null) {
      minNode = minNode.left;
    }
    // 用最小值替换当前节点的值
    root.val = minNode.val;
    // 删除右子树中的最小节点
    root.right = deleteNode(root.right, minNode.val);
  }
  return root;
}

// 方法2：迭代
// 迭代方式找到目标节点并删除，需要记录父节点
function deleteNodeIterative(root: TreeNode | null, key: number): TreeNode | null {
  if (root === null) return null;

  // 特殊处理：删除的是根节点
  if (root.val === key) {
    return removeNode(root);
  }

  let curr: TreeNode | null = root;
  while (curr !== null) {
    if (key < curr.val) {
      if (curr.left !== null && curr.left.val === key) {
        curr.left = removeNode(curr.left);
        break;
      }
      curr = curr.left;
    } else {
      if (curr.right !== null && curr.right.val === key) {
        curr.right = removeNode(curr.right);
        break;
      }
      curr = curr.right;
    }
  }
  return root;
}

// 删除节点并返回替换后的子树根
function removeNode(node: TreeNode): TreeNode | null {
  if (node.left === null) return node.right;
  if (node.right === null) return node.left;
  // 找右子树最小值
  let minNode = node.right;
  while (minNode.left !== null) {
    minNode = minNode.left;
  }
  minNode.left = node.left;
  return node.right;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 057. 删除二叉搜索树中的节点 =====");
// 辅助函数：中序遍历验证BST
function inorder(root: TreeNode | null): number[] {
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

// 构造BST: [5,3,6,2,4,null,7], key = 3
//       5
//      / \
//     3   6
//    / \   \
//   2   4   7
const tree1 = new TreeNode(5);
tree1.left = new TreeNode(3);
tree1.right = new TreeNode(6);
tree1.left.left = new TreeNode(2);
tree1.left.right = new TreeNode(4);
tree1.right.right = new TreeNode(7);

const result1 = deleteNode(tree1, 3);
console.log("递归删除3后中序:", inorder(result1)); // 期望结果 [2,4,5,6,7]

// 构造BST: [5,3,6,2,4,null,7], key = 0
const tree2 = new TreeNode(5);
tree2.left = new TreeNode(3);
tree2.right = new TreeNode(6);
tree2.left.left = new TreeNode(2);
tree2.left.right = new TreeNode(4);
tree2.right.right = new TreeNode(7);

const result2 = deleteNodeIterative(tree2, 0);
console.log("迭代删除0后中序:", inorder(result2)); // 期望结果 [2,3,4,5,6,7]

// 构造BST: [5,3,6,2,4,null,7], key = 5
const tree3 = new TreeNode(5);
tree3.left = new TreeNode(3);
tree3.right = new TreeNode(6);
tree3.left.left = new TreeNode(2);
tree3.left.right = new TreeNode(4);
tree3.right.right = new TreeNode(7);

const result3 = deleteNode(tree3, 5);
console.log("递归删除5后中序:", inorder(result3)); // 期望结果 [2,3,4,6,7]

export {};
