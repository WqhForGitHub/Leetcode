// ============================================================
// 006. 相同的树
// ============================================================
// LeetCode 100. Same Tree
// 给你两棵二叉树的根节点 p 和 q，编写函数来检验这两棵树是否相同。
// 时间复杂度：O(min(m, n))，空间复杂度：O(min(m, n))

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
// 两棵树相同当且仅当：根节点值相同 且 左子树相同 且 右子树相同
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  // 都为空则相同
  if (p === null && q === null) return true;
  // 只有一个为空则不同
  if (p === null || q === null) return false;
  // 值不同则不同
  if (p.val !== q.val) return false;
  // 递归比较左右子树
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

// 方法2：迭代 BFS
// 使用队列同时遍历两棵树
function isSameTreeBFS(p: TreeNode | null, q: TreeNode | null): boolean {
  const queue: (TreeNode | null)[] = [p, q];
  while (queue.length > 0) {
    const node1 = queue.shift()!;
    const node2 = queue.shift()!;
    // 都为空，继续
    if (node1 === null && node2 === null) continue;
    // 一个为空或值不同
    if (node1 === null || node2 === null) return false;
    if (node1.val !== node2.val) return false;
    // 将子节点成对入队
    queue.push(node1.left);
    queue.push(node2.left);
    queue.push(node1.right);
    queue.push(node2.right);
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 006. 相同的树 =====");
// 测试1: p=[1,2,3], q=[1,2,3] -> true
const p1 = new TreeNode(1, new TreeNode(2), new TreeNode(3));
const q1 = new TreeNode(1, new TreeNode(2), new TreeNode(3));
console.log("[1,2,3] vs [1,2,3] (递归):", isSameTree(p1, q1)); // true
console.log("[1,2,3] vs [1,2,3] (BFS):", isSameTreeBFS(p1, q1)); // true

// 测试2: p=[1,2], q=[1,null,2] -> false
const p2 = new TreeNode(1, new TreeNode(2));
const q2 = new TreeNode(1, null, new TreeNode(2));
console.log("[1,2] vs [1,null,2] (递归):", isSameTree(p2, q2)); // false
console.log("[1,2] vs [1,null,2] (BFS):", isSameTreeBFS(p2, q2)); // false

// 测试3: p=[1,2,1], q=[1,1,2] -> false
const p3 = new TreeNode(1, new TreeNode(2), new TreeNode(1));
const q3 = new TreeNode(1, new TreeNode(1), new TreeNode(2));
console.log("[1,2,1] vs [1,1,2] (递归):", isSameTree(p3, q3)); // false

// 测试4: 都为空 -> true
console.log("null vs null (递归):", isSameTree(null, null)); // true

export {};
