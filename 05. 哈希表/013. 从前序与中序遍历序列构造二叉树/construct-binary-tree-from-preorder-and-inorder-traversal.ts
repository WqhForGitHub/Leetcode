// ============================================================
// 013. 从前序与中序遍历序列构造二叉树
// ============================================================
// LeetCode 105. Construct Binary Tree from Preorder and Inorder Traversal
// 给定一棵树的前序与中序遍历，构造二叉树并返回其根节点。
// 使用哈希表存储中序遍历中值到索引的映射，递归构造。
// 时间复杂度：O(n)，空间复杂度：O(n)

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

function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  // 哈希表：中序遍历值 -> 索引
  const indexMap = new Map<number, number>();
  for (let i = 0; i < inorder.length; i++) {
    indexMap.set(inorder[i], i);
  }

  // 递归构造子树，返回在 preorder[preStart..] 中根节点对应的子树
  const build = (
    preStart: number,
    inStart: number,
    inEnd: number,
  ): TreeNode | null => {
    if (inStart > inEnd) return null;

    // 前序第一个就是当前子树根节点
    const rootVal = preorder[preStart];
    const root = new TreeNode(rootVal);

    // 在中序中找到根节点位置，划分左右子树
    const inRoot = indexMap.get(rootVal)!;
    const leftSize = inRoot - inStart;

    root.left = build(preStart + 1, inStart, inRoot - 1);
    root.right = build(preStart + 1 + leftSize, inRoot + 1, inEnd);

    return root;
  };

  return build(0, 0, inorder.length - 1);
}

// 辅助函数：层序遍历打印二叉树（用于测试）
function serialize(root: TreeNode | null): (number | null)[] {
  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) {
      result.push(null);
    } else {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  // 去掉末尾多余的 null
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 013. 从前序与中序遍历序列构造二叉树 =====");
console.log(serialize(buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]))); // [3,9,20,null,null,15,7]
console.log(serialize(buildTree([-1], [-1]))); // [-1]
console.log(serialize(buildTree([1, 2, 3], [2, 1, 3]))); // [1,2,3]

export {};
