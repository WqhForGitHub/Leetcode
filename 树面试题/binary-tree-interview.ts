// ============================================================
// 树面试题 - TypeScript 解题合集
// 主题：前/中/后序遍历 / 深度 / 翻转 / 对称 / 路径总和 /
//       所有路径 / 层序遍历 / 直径 / 最近公共祖先 /
//       序列化与反序列化 / 构造二叉树 / 验证BST /
//       右视图 / 最大路径和
// ============================================================

// ============================================================
// 涉及的核心数据结构：
//   - 二叉树（TreeNode）
// ============================================================

// -------------------- 二叉树节点定义 --------------------
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

// -------------------- 辅助函数：层序数组转二叉树 --------------------
function createTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift();
    if (node) {
      if (i < arr.length && arr[i] !== null) {
        node.left = new TreeNode(arr[i]!);
      }
      queue.push(node.left);
      i++;
      if (i < arr.length && arr[i] !== null) {
        node.right = new TreeNode(arr[i]!);
      }
      queue.push(node.right);
      i++;
    }
  }
  return root;
}

// ============================================================
// 1. 二叉树的前序遍历
// LeetCode 144. Binary Tree Preorder Traversal
//
// 核心思路：
//   前序遍历顺序：根 → 左 → 右
//   递归最简洁；迭代用栈模拟递归调用栈
//
// 时间复杂度：O(n)
// 空间复杂度：O(h)，h 为树高
// ============================================================

// 方法1：递归（推荐）
function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (!node) return;
    result.push(node.val); // 根
    dfs(node.left);        // 左
    dfs(node.right);       // 右
  }
  dfs(root);
  return result;
}

// 方法2：迭代（栈）
function preorderTraversalIterative(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (!root) return result;
  const stack: TreeNode[] = [root];
  while (stack.length) {
    const node = stack.pop()!;
    result.push(node.val);
    if (node.right) stack.push(node.right); // 右先入栈，左后入栈
    if (node.left) stack.push(node.left);
  }
  return result;
}

// ============================================================
// 2. 二叉树的中序遍历
// LeetCode 94. Binary Tree Inorder Traversal
//
// 核心思路：
//   中序遍历顺序：左 → 根 → 右
//   对 BST 做中序遍历得到递增序列
//
// 时间复杂度：O(n)
// 空间复杂度：O(h)
// ============================================================

// 方法1：递归（推荐）
function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (!node) return;
    dfs(node.left);        // 左
    result.push(node.val); // 根
    dfs(node.right);       // 右
  }
  dfs(root);
  return result;
}

// 方法2：迭代（栈）
function inorderTraversalIterative(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  let curr = root;
  while (curr || stack.length) {
    while (curr) {
      stack.push(curr);
      curr = curr.left; // 一路向左
    }
    curr = stack.pop()!;
    result.push(curr.val);
    curr = curr.right; // 转向右子树
  }
  return result;
}

// ============================================================
// 3. 二叉树的后序遍历
// LeetCode 145. Binary Tree Postorder Traversal
//
// 核心思路：
//   后序遍历顺序：左 → 右 → 根
//   迭代方法：前序(根→右→左)翻转 = 后序(左→右→根)
//
// 时间复杂度：O(n)
// 空间复杂度：O(h)
// ============================================================

// 方法1：递归（推荐）
function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (!node) return;
    dfs(node.left);        // 左
    dfs(node.right);       // 右
    result.push(node.val); // 根
  }
  dfs(root);
  return result;
}

// 方法2：迭代（前序翻转法）
function postorderTraversalIterative(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (!root) return result;
  const stack: TreeNode[] = [root];
  while (stack.length) {
    const node = stack.pop()!;
    result.push(node.val);
    if (node.left) stack.push(node.left);  // 左先入栈
    if (node.right) stack.push(node.right); // 右后入栈
    // 得到 根→右→左，最后翻转
  }
  return result.reverse();
}

// ============================================================
// 4. 二叉树的最大深度
// LeetCode 104. Maximum Depth of Binary Tree
//
// 核心思路：
//   DFS 递归：深度 = 1 + max(左子树深度, 右子树深度)
//   BFS 层序：层数即为最大深度
//
// 时间复杂度：O(n)
// 空间复杂度：O(h)（递归）/ O(w)（BFS，w 为最大宽度）
// ============================================================

// 方法1：递归 DFS（推荐）
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// 方法2：BFS 层序遍历
function maxDepthBFS(root: TreeNode | null): number {
  if (!root) return 0;
  let depth = 0;
  const queue: TreeNode[] = [root];
  while (queue.length) {
    depth++;
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return depth;
}

// ============================================================
// 5. 二叉树的最小深度
// LeetCode 111. Minimum Depth of Binary Tree
//
// 核心思路：
//   最小深度 = 根到最近叶子节点的最短路径上的节点数
//   注意：只有一边有子树时，不能取 0，要取有子树那边的深度
//
// 时间复杂度：O(n)
// 空间复杂度：O(h)
// ============================================================

// 方法1：递归 DFS（推荐）
function minDepth(root: TreeNode | null): number {
  if (!root) return 0;
  if (!root.left && !root.right) return 1; // 叶子节点
  if (!root.left) return 1 + minDepth(root.right); // 只有右子树
  if (!root.right) return 1 + minDepth(root.left); // 只有左子树
  return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}

// 方法2：BFS 层序遍历（遇到第一个叶子节点即可返回）
function minDepthBFS(root: TreeNode | null): number {
  if (!root) return 0;
  let depth = 0;
  const queue: TreeNode[] = [root];
  while (queue.length) {
    depth++;
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      if (!node.left && !node.right) return depth; // 第一个叶子节点
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return depth;
}

// ============================================================
// 6. 翻转二叉树
// LeetCode 226. Invert Binary Tree
//
// 核心思路：
//   递归交换每个节点的左右子树
//   著名面试题："Max Howell 用 Homebrew 的作者，Google 拒绝了他
//   因为不会翻转二叉树"
//
// 时间复杂度：O(n)
// 空间复杂度：O(h)
// ============================================================

// 方法1：递归（推荐）
function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  const temp = root.left;
  root.left = root.right;
  root.right = temp;
  invertTree(root.left);
  invertTree(root.right);
  return root;
}

// 方法2：BFS 层序遍历
function invertTreeBFS(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  const queue: TreeNode[] = [root];
  while (queue.length) {
    const node = queue.shift()!;
    const temp = node.left;
    node.left = node.right;
    node.right = temp;
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return root;
}

// ============================================================
// 7. 对称二叉树
// LeetCode 101. Symmetric Tree
//
// 核心思路：
//   左子树的左 = 右子树的右，左子树的右 = 右子树的左
//   递归比较两棵子树是否互为镜像
//
// 时间复杂度：O(n)
// 空间复杂度：O(h)
// ============================================================

// 方法1：递归（推荐）
function isSymmetric(root: TreeNode | null): boolean {
  if (!root) return true;
  function isMirror(a: TreeNode | null, b: TreeNode | null): boolean {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.val === b.val
      && isMirror(a.left, b.right)
      && isMirror(a.right, b.left);
  }
  return isMirror(root.left, root.right);
}

// 方法2：迭代（队列）
function isSymmetricIterative(root: TreeNode | null): boolean {
  if (!root) return true;
  const queue: (TreeNode | null)[] = [root.left, root.right];
  while (queue.length) {
    const a = queue.shift();
    const b = queue.shift();
    if (!a && !b) continue;
    if (!a || !b || a.val !== b.val) return false;
    queue.push(a.left, b.right);
    queue.push(a.right, b.left);
  }
  return true;
}

// ============================================================
// 8. 路径总和
// LeetCode 112. Path Sum
//
// 核心思路：
//   从根到叶子节点的路径上所有节点值之和是否等于 targetSum
//   递归到叶子节点时判断剩余值是否为 0
//
// 时间复杂度：O(n)
// 空间复杂度：O(h)
// ============================================================

// 方法1：递归 DFS（推荐）
function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === targetSum; // 叶子节点
  const remaining = targetSum - root.val;
  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}

// 方法2：迭代（栈，同时记录当前路径和）
function hasPathSumIterative(root: TreeNode | null, targetSum: number): boolean {
  if (!root) return false;
  const stack: [TreeNode, number][] = [[root, root.val]];
  while (stack.length) {
    const [node, sum] = stack.pop()!;
    if (!node.left && !node.right && sum === targetSum) return true;
    if (node.right) stack.push([node.right, sum + node.right.val]);
    if (node.left) stack.push([node.left, sum + node.left.val]);
  }
  return false;
}

// ============================================================
// 9. 二叉树的所有路径
// LeetCode 257. Binary Tree Paths
//
// 核心思路：
//   DFS 遍历，记录从根到每个叶子节点的路径
//   到叶子节点时将路径加入结果
//
// 时间复杂度：O(n²)，每条路径复制需 O(n)
// 空间复杂度：O(h)
// ============================================================

// 方法1：递归（推荐）
function binaryTreePaths(root: TreeNode | null): string[] {
  const result: string[] = [];
  function dfs(node: TreeNode | null, path: string): void {
    if (!node) return;
    const currentPath = path ? `${path}->${node.val}` : `${node.val}`;
    if (!node.left && !node.right) {
      result.push(currentPath); // 叶子节点，记录路径
      return;
    }
    dfs(node.left, currentPath);
    dfs(node.right, currentPath);
  }
  dfs(root, "");
  return result;
}

// 方法2：迭代（栈）
function binaryTreePathsIterative(root: TreeNode | null): string[] {
  const result: string[] = [];
  if (!root) return result;
  const stack: [TreeNode, string][] = [[root, `${root.val}`]];
  while (stack.length) {
    const [node, path] = stack.pop()!;
    if (!node.left && !node.right) {
      result.push(path);
      continue;
    }
    if (node.right) stack.push([node.right, `${path}->${node.right.val}`]);
    if (node.left) stack.push([node.left, `${path}->${node.left.val}`]);
  }
  return result;
}

// ============================================================
// 10. 二叉树的层序遍历
// LeetCode 102. Binary Tree Level Order Traversal
//
// 核心思路：
//   BFS 使用队列，逐层遍历，每层收集节点值
//   是树面试最基础的题型之一
//
// 时间复杂度：O(n)
// 空间复杂度：O(w)，w 为最大宽度
// ============================================================

// 方法1：BFS 队列（推荐）
function levelOrder(root: TreeNode | null): number[][] {
  const result: number[][] = [];
  if (!root) return result;
  const queue: TreeNode[] = [root];
  while (queue.length) {
    const level: number[] = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}

// 方法2：DFS 递归（用深度区分层级）
function levelOrderDFS(root: TreeNode | null): number[][] {
  const result: number[][] = [];
  function dfs(node: TreeNode | null, depth: number): void {
    if (!node) return;
    if (result.length === depth) result.push([]); // 新层级
    result[depth].push(node.val);
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  }
  dfs(root, 0);
  return result;
}

// ============================================================
// 11. 二叉树的直径
// LeetCode 543. Diameter of Binary Tree
//
// 核心思路：
//   直径 = 左子树最大深度 + 右子树最大深度
//   在 DFS 计算深度的过程中更新全局最大值
//   注意：直径不一定经过根节点
//
// 时间复杂度：O(n)
// 空间复杂度：O(h)
// ============================================================

function diameterOfBinaryTree(root: TreeNode | null): number {
  let maxDiameter = 0;
  function depth(node: TreeNode | null): number {
    if (!node) return 0;
    const leftDepth = depth(node.left);
    const rightDepth = depth(node.right);
    maxDiameter = Math.max(maxDiameter, leftDepth + rightDepth); // 更新直径
    return 1 + Math.max(leftDepth, rightDepth); // 返回深度
  }
  depth(root);
  return maxDiameter;
}

// ============================================================
// 12. 二叉树的最近公共祖先
// LeetCode 236. Lowest Common Ancestor of a Binary Tree
//
// 核心思路：
//   后序遍历，若当前节点为 p 或 q 直接返回
//   左右子树分别查找：
//     - 左右都有结果 → 当前节点就是 LCA
//     - 只有一边有结果 → 返回那一边
//     - 两边都没结果 → 返回 null
//
// 时间复杂度：O(n)
// 空间复杂度：O(h)
// ============================================================

function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode | null,
  q: TreeNode | null
): TreeNode | null {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root; // 左右都找到了，当前节点就是 LCA
  return left ? left : right; // 返回非空的那一边
}

// ============================================================
// 13. 二叉树的序列化与反序列化
// LeetCode 297. Serialize and Deserialize Binary Tree
//
// 核心思路：
//   序列化：前序遍历，用 "null" 表示空节点，逗号分隔
//   反序列化：按前序顺序重建，遇到 "null" 返回 null
//
// 时间复杂度：O(n)
// 空间复杂度：O(n)
// ============================================================

function serialize(root: TreeNode | null): string {
  const parts: string[] = [];
  function dfs(node: TreeNode | null): void {
    if (!node) {
      parts.push("null");
      return;
    }
    parts.push(`${node.val}`);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return parts.join(",");
}

function deserialize(data: string): TreeNode | null {
  const parts = data.split(",");
  let index = 0;
  function dfs(): TreeNode | null {
    if (parts[index] === "null") {
      index++;
      return null;
    }
    const node = new TreeNode(parseInt(parts[index]));
    index++;
    node.left = dfs();
    node.right = dfs();
    return node;
  }
  return dfs();
}

// ============================================================
// 14. 从前序与中序遍历序列构造二叉树
// LeetCode 105. Construct Binary Tree from Preorder and Inorder Traversal
//
// 核心思路：
//   前序第一个元素为根，在中序中找到根的位置
//   左边为左子树，右边为右子树，递归构造
//   用哈希表加速中序中查找根的位置
//
// 时间复杂度：O(n)
// 空间复杂度：O(n)（哈希表 + 递归栈）
// ============================================================

function buildTreeFromPreIn(preorder: number[], inorder: number[]): TreeNode | null {
  const inorderMap = new Map<number, number>();
  for (let i = 0; i < inorder.length; i++) {
    inorderMap.set(inorder[i], i);
  }
  let preIndex = 0;
  function build(inStart: number, inEnd: number): TreeNode | null {
    if (inStart > inEnd) return null;
    const rootVal = preorder[preIndex++];
    const root = new TreeNode(rootVal);
    const inIndex = inorderMap.get(rootVal)!;
    root.left = build(inStart, inIndex - 1);
    root.right = build(inIndex + 1, inEnd);
    return root;
  }
  return build(0, inorder.length - 1);
}

// ============================================================
// 15. 从中序与后序遍历序列构造二叉树
// LeetCode 106. Construct Binary Tree from Inorder and Postorder Traversal
//
// 核心思路：
//   后序最后一个元素为根，在中序中找到根的位置
//   注意：先构造右子树再构造左子树（因为后序从后往前取根）
//
// 时间复杂度：O(n)
// 空间复杂度：O(n)
// ============================================================

function buildTreeFromInPost(inorder: number[], postorder: number[]): TreeNode | null {
  const inorderMap = new Map<number, number>();
  for (let i = 0; i < inorder.length; i++) {
    inorderMap.set(inorder[i], i);
  }
  let postIndex = postorder.length - 1;
  function build(inStart: number, inEnd: number): TreeNode | null {
    if (inStart > inEnd) return null;
    const rootVal = postorder[postIndex--];
    const root = new TreeNode(rootVal);
    const inIndex = inorderMap.get(rootVal)!;
    // 先构造右子树，再构造左子树
    root.right = build(inIndex + 1, inEnd);
    root.left = build(inStart, inIndex - 1);
    return root;
  }
  return build(0, inorder.length - 1);
}

// ============================================================
// 16. 验证二叉搜索树
// LeetCode 98. Validate Binary Search Tree
//
// 核心思路：
//   BST 定义：左子树所有节点 < 根 < 右子树所有节点
//   方法1：递归时传递有效范围 (min, max)
//   方法2：中序遍历检查是否严格递增
//
// 时间复杂度：O(n)
// 空间复杂度：O(h)
// ============================================================

// 方法1：递归范围检查（推荐）
function isValidBST(root: TreeNode | null): boolean {
  function validate(node: TreeNode | null, min: number | null, max: number | null): boolean {
    if (!node) return true;
    if (min !== null && node.val <= min) return false;
    if (max !== null && node.val >= max) return false;
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, null, null);
}

// 方法2：中序遍历检查递增
function isValidBSTInorder(root: TreeNode | null): boolean {
  let prev: number | null = null;
  function inorder(node: TreeNode | null): boolean {
    if (!node) return true;
    if (!inorder(node.left)) return false;
    if (prev !== null && node.val <= prev) return false;
    prev = node.val;
    return inorder(node.right);
  }
  return inorder(root);
}

// ============================================================
// 17. 二叉树的右视图
// LeetCode 199. Binary Tree Right Side View
//
// 核心思路：
//   BFS 层序遍历，每层最后一个节点即为右视图可见节点
//   DFS 也可以：首次到达某深度时记录该节点（先右后左）
//
// 时间复杂度：O(n)
// 空间复杂度：O(h)
// ============================================================

// 方法1：BFS 层序遍历（推荐）
function rightSideView(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (!root) return result;
  const queue: TreeNode[] = [root];
  while (queue.length) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      if (i === size - 1) result.push(node.val); // 每层最后一个
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return result;
}

// 方法2：DFS（先右后左，首次到达某深度即记录）
function rightSideViewDFS(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null, depth: number): void {
    if (!node) return;
    if (result.length === depth) result.push(node.val); // 该深度首次访问
    dfs(node.right, depth + 1); // 先右
    dfs(node.left, depth + 1);  // 后左
  }
  dfs(root, 0);
  return result;
}

// ============================================================
// 18. 二叉树的最大路径和
// LeetCode 124. Binary Tree Maximum Path Sum
//
// 核心思路：
//   路径定义为任意节点到任意节点的序列（不一定经过根）
//   DFS 后序遍历，对每个节点：
//     - 计算贡献值：max(左贡献, 右贡献, 0) + node.val
//       （负贡献不如不走，所以和 0 取 max）
//     - 更新全局最大值：左贡献 + 右贡献 + node.val
//
// 时间复杂度：O(n)
// 空间复杂度：O(h)
// ============================================================

function maxPathSum(root: TreeNode | null): number {
  let maxSum = -Infinity;
  function gain(node: TreeNode | null): number {
    if (!node) return 0;
    const leftGain = Math.max(gain(node.left), 0);  // 负贡献不如不走
    const rightGain = Math.max(gain(node.right), 0);
    // 以当前节点为拐点的路径和
    const currentPathSum = node.val + leftGain + rightGain;
    maxSum = Math.max(maxSum, currentPathSum);
    // 返回向上贡献的值（只能选一边）
    return node.val + Math.max(leftGain, rightGain);
  }
  gain(root);
  return maxSum;
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 二叉树的前序遍历 =====");
{
  const tree = createTree([1, null, 2, 3]); // 1 → (null, 2) → 2 → (3, null)
  console.log(preorderTraversal(tree));           // [1, 2, 3]
  console.log(preorderTraversalIterative(tree));  // [1, 2, 3]
}

console.log("\n===== 2. 二叉树的中序遍历 =====");
{
  const tree = createTree([1, null, 2, 3]);
  console.log(inorderTraversal(tree));            // [1, 3, 2]
  console.log(inorderTraversalIterative(tree));   // [1, 3, 2]
}

console.log("\n===== 3. 二叉树的后序遍历 =====");
{
  const tree = createTree([1, null, 2, 3]);
  console.log(postorderTraversal(tree));          // [3, 2, 1]
  console.log(postorderTraversalIterative(tree)); // [3, 2, 1]
}

console.log("\n===== 4. 二叉树的最大深度 =====");
{
  const tree = createTree([3, 9, 20, null, null, 15, 7]);
  console.log(maxDepth(tree));    // 3
  console.log(maxDepthBFS(tree)); // 3
}

console.log("\n===== 5. 二叉树的最小深度 =====");
{
  const tree = createTree([3, 9, 20, null, null, 15, 7]);
  console.log(minDepth(tree));    // 2
  console.log(minDepthBFS(tree)); // 2
}

console.log("\n===== 6. 翻转二叉树 =====");
{
  const tree = createTree([4, 2, 7, 1, 3, 6, 9]);
  const inverted = invertTree(tree);
  console.log(levelOrder(inverted)); // [[4], [7, 2], [9, 6, 3, 1]]

  const tree2 = createTree([4, 2, 7, 1, 3, 6, 9]);
  const inverted2 = invertTreeBFS(tree2);
  console.log(levelOrder(inverted2)); // [[4], [7, 2], [9, 6, 3, 1]]
}

console.log("\n===== 7. 对称二叉树 =====");
{
  const tree1 = createTree([1, 2, 2, 3, 4, 4, 3]);
  console.log(isSymmetric(tree1));              // true
  console.log(isSymmetricIterative(tree1));     // true
  const tree2 = createTree([1, 2, 2, null, 3, null, 3]);
  console.log(isSymmetric(tree2));              // false
}

console.log("\n===== 8. 路径总和 =====");
{
  const tree = createTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]);
  console.log(hasPathSum(tree, 22));            // true (5→4→11→2 = 22)
  console.log(hasPathSumIterative(tree, 22));   // true
  console.log(hasPathSum(tree, 26));            // true (5→8→13 = 26)
  console.log(hasPathSum(tree, 5));             // false
}

console.log("\n===== 9. 二叉树的所有路径 =====");
{
  const tree = createTree([1, 2, 3, null, 5]);
  console.log(binaryTreePaths(tree));           // ["1->2->5", "1->3"]
  console.log(binaryTreePathsIterative(tree));  // ["1->2->5", "1->3"]
}

console.log("\n===== 10. 二叉树的层序遍历 =====");
{
  const tree = createTree([3, 9, 20, null, null, 15, 7]);
  console.log(levelOrder(tree));                // [[3], [9, 20], [15, 7]]
  console.log(levelOrderDFS(tree));             // [[3], [9, 20], [15, 7]]
}

console.log("\n===== 11. 二叉树的直径 =====");
{
  const tree = createTree([1, 2, 3, 4, 5]);
  console.log(diameterOfBinaryTree(tree));      // 3 (路径 4→2→1→3 或 5→2→1→3)
}

console.log("\n===== 12. 二叉树的最近公共祖先 =====");
{
  const root = createTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4])!;
  const p = root.left!;  // 节点 5
  const q = root.right!; // 节点 1
  console.log(lowestCommonAncestor(root, p, q)?.val); // 3
  const p2 = root.left!.right!.left!;   // 节点 7
  const q2 = root.left!.right!.right!;  // 节点 4
  console.log(lowestCommonAncestor(root, p2, q2)?.val); // 2
}

console.log("\n===== 13. 二叉树的序列化与反序列化 =====");
{
  const tree = createTree([1, 2, 3, null, null, 4, 5]);
  const serialized = serialize(tree);
  console.log(serialized);                          // "1,2,null,null,3,4,null,null,5,null,null"
  const deserialized = deserialize(serialized);
  console.log(levelOrder(deserialized));            // [[1], [2, 3], [4, 5]]
}

console.log("\n===== 14. 从前序与中序遍历序列构造二叉树 =====");
{
  const tree = buildTreeFromPreIn([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
  console.log(levelOrder(tree));                 // [[3], [9, 20], [15, 7]]
}

console.log("\n===== 15. 从中序与后序遍历序列构造二叉树 =====");
{
  const tree = buildTreeFromInPost([9, 3, 15, 20, 7], [9, 15, 7, 20, 3]);
  console.log(levelOrder(tree));                 // [[3], [9, 20], [15, 7]]
}

console.log("\n===== 16. 验证二叉搜索树 =====");
{
  const tree1 = createTree([2, 1, 3]);
  console.log(isValidBST(tree1));                // true
  console.log(isValidBSTInorder(tree1));         // true
  const tree2 = createTree([5, 1, 4, null, null, 3, 6]);
  console.log(isValidBST(tree2));                // false (3 < 5)
  console.log(isValidBSTInorder(tree2));         // false
}

console.log("\n===== 17. 二叉树的右视图 =====");
{
  const tree = createTree([1, 2, 3, null, 5, null, 4]);
  console.log(rightSideView(tree));              // [1, 3, 4]
  console.log(rightSideViewDFS(tree));           // [1, 3, 4]
}

console.log("\n===== 18. 二叉树的最大路径和 =====");
{
  const tree1 = createTree([1, 2, 3]);
  console.log(maxPathSum(tree1));                // 6 (2→1→3)
  const tree2 = createTree([-10, 9, 20, null, null, 15, 7]);
  console.log(maxPathSum(tree2));                // 42 (15→20→7)
  const tree3 = createTree([-3]);
  console.log(maxPathSum(tree3));                // -3
}

export {};
