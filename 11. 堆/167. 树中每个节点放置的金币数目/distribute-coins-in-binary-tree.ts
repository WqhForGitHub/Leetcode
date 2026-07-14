// ============================================================
// 167. 树中每个节点放置的金币数目
// ============================================================
// LeetCode 3069. Distribute Elements Into Two Arrays II (变形)
// 在二叉树中分配金币，使每个节点恰好有一枚金币。
// 时间复杂度：O(n)，空间复杂度：O(h)

// 方法1：DFS 后序遍历
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

function distributeCoins(root: TreeNode | null): number {
  let moves = 0;
  const dfs = (node: TreeNode | null): number => {
    if (!node) return 0;
    const left = dfs(node.left);
    const right = dfs(node.right);
    moves += Math.abs(left) + Math.abs(right);
    return node.val + left + right - 1;
  };
  dfs(root);
  return moves;
}

// 方法2：BFS + 统计
function distributeCoinsBFS(root: TreeNode | null): number {
  if (!root) return 0;
  let moves = 0;
  const stack: Array<{
    node: TreeNode | null;
    done: boolean;
    leftResult?: number;
    rightResult?: number;
  }> = [];
  const results: Map<TreeNode, number> = new Map();
  stack.push({ node: root, done: false });
  while (stack.length > 0) {
    const top = stack[stack.length - 1];
    if (!top.node) {
      stack.pop();
      stack[stack.length - 1].done = true;
      continue;
    }
    if (top.done) {
      const left = top.node.left ? (results.get(top.node.left) ?? 0) : 0;
      const right = top.node.right ? (results.get(top.node.right) ?? 0) : 0;
      moves += Math.abs(left) + Math.abs(right);
      results.set(top.node, top.node.val + left + right - 1);
      stack.pop();
      if (stack.length > 0) stack[stack.length - 1].done = true;
    } else {
      stack.push({ node: top.node.right, done: false });
      stack.push({ node: top.node.left, done: false });
    }
  }
  return moves;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 167. 树中每个节点放置的金币数目 =====");
const tree1 = new TreeNode(3, new TreeNode(0), new TreeNode(0));
console.log("DFS:", distributeCoins(tree1)); // 期望 2

export {};
