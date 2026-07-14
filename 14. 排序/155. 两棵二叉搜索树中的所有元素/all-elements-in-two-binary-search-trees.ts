// ============================================================
// 155. 两棵二叉搜索树中的所有元素
// ============================================================
// LeetCode 1305. All Elements in Two Binary Search Trees
// 给定两棵二叉搜索树，返回所有元素升序排列。

// 二叉树节点定义
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

// 方法1：中序遍历两棵树 + 归并（O(n + m)）
// BST 中序遍历得到升序序列，再双指针归并两个有序数组。
function getAllElements(root1: TreeNode | null, root2: TreeNode | null): number[] {
  const inorder = (root: TreeNode | null): number[] => {
    const res: number[] = [];
    const stack: TreeNode[] = [];
    let curr: TreeNode | null = root;
    while (curr !== null || stack.length > 0) {
      while (curr !== null) {
        stack.push(curr);
        curr = curr.left;
      }
      curr = stack.pop()!;
      res.push(curr.val);
      curr = curr.right;
    }
    return res;
  };

  const a = inorder(root1);
  const b = inorder(root2);
  const result: number[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) result.push(a[i++]);
    else result.push(b[j++]);
  }
  while (i < a.length) result.push(a[i++]);
  while (j < b.length) result.push(b[j++]);
  return result;
}

// 方法2：中序遍历收集 + 排序（O((n+m) log(n+m))）
function getAllElements2(root1: TreeNode | null, root2: TreeNode | null): number[] {
  const result: number[] = [];
  const inorder = (root: TreeNode | null): void => {
    if (root === null) return;
    inorder(root.left);
    result.push(root.val);
    inorder(root.right);
  };
  inorder(root1);
  inorder(root2);
  result.sort((a, b) => a - b);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 155. 两棵二叉搜索树中的所有元素 =====");
// root1:      2          root2:      1
//           /   \                 /   \
//          1     4               0     3
const root1 = new TreeNode(2, new TreeNode(1), new TreeNode(4));
const root2 = new TreeNode(1, new TreeNode(0), new TreeNode(3));
console.log("方法1:", getAllElements(root1, root2)); // [0,1,1,2,3,4]
console.log("方法2:", getAllElements2(root1, root2)); // [0,1,1,2,3,4]
console.log("方法1 空树:", getAllElements(null, null)); // []

export {};
