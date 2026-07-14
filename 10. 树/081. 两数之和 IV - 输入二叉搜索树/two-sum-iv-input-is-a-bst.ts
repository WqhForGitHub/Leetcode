// ============================================================
// 081. 两数之和 IV - 输入二叉搜索树
// ============================================================
// LeetCode 653. Two Sum IV - Input is a BST
// 给定一个二叉搜索树 root 和一个目标结果 k，
// 如果 BST 中存在两个元素且它们的和等于给定的目标结果，则返回 true。
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

// 方法1：中序遍历+双指针（推荐）
// BST中序遍历得到升序数组，然后用双指针查找两数之和
function findTarget(root: TreeNode | null, k: number): boolean {
  const nums: number[] = [];
  function inorder(node: TreeNode | null): void {
    if (node === null) return;
    inorder(node.left);
    nums.push(node.val);
    inorder(node.right);
  }
  inorder(root);
  // 双指针
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === k) return true;
    if (sum < k) left++;
    else right--;
  }
  return false;
}

// 方法2：哈希集合（不限于BST）
// 遍历每个节点，检查 k - val 是否已在集合中
function findTargetHash(root: TreeNode | null, k: number): boolean {
  const seen = new Set<number>();
  function dfs(node: TreeNode | null): boolean {
    if (node === null) return false;
    const complement = k - node.val;
    if (seen.has(complement)) return true;
    seen.add(node.val);
    return dfs(node.left) || dfs(node.right);
  }
  return dfs(root);
}

// 方法3：BST迭代器双向扫描（进阶，O(h)空间）
// 这里用两个迭代器分别从最小和最大开始
// 略，作为思考扩展

// ============================================================
// 测试
// ============================================================
console.log("===== 081. 两数之和 IV - 输入二叉搜索树 =====");

// 测试1: root = [5,3,6,2,4,null,7], k = 9
//        5
//       / \
//      3   6
//     / \   \
//    2   4   7
const tree1 = new TreeNode(5);
tree1.left = new TreeNode(3);
tree1.right = new TreeNode(6);
tree1.left.left = new TreeNode(2);
tree1.left.right = new TreeNode(4);
tree1.right.right = new TreeNode(7);
console.log("双指针 k=9:", findTarget(tree1, 9)); // 期望 true (3+6 或 2+7)
console.log("哈希 k=9:", findTargetHash(tree1, 9)); // 期望 true

// 测试2: k = 28
console.log("双指针 k=28:", findTarget(tree1, 28)); // 期望 false
console.log("哈希 k=28:", findTargetHash(tree1, 28)); // 期望 false

// 测试3: root = [2,1,3], k = 4
const tree2 = new TreeNode(2);
tree2.left = new TreeNode(1);
tree2.right = new TreeNode(3);
console.log("双指针 k=4:", findTarget(tree2, 4)); // 期望 true (1+3)
console.log("哈希 k=4:", findTargetHash(tree2, 4)); // 期望 true

// 测试4: root = [2,1,3], k = 1
console.log("双指针 k=1:", findTarget(tree2, 1)); // 期望 false
console.log("哈希 k=1:", findTargetHash(tree2, 1)); // 期望 false

// 测试5: 单节点 root = [1], k = 2
const tree3 = new TreeNode(1);
console.log("双指针 k=2:", findTarget(tree3, 2)); // 期望 false
console.log("哈希 k=2:", findTargetHash(tree3, 2)); // 期望 false

export {};
