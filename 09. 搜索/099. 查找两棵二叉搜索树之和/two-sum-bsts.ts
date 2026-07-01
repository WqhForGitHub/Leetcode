// ============================================================
// 099. 查找两棵二叉搜索树之和
// ============================================================
// LeetCode 1214. Two Sum BSTs
// 两棵 BST 中各取一个节点，使和等于 target。

class TreeNode1214 {
  val: number;
  left: TreeNode1214 | null;
  right: TreeNode1214 | null;
  constructor(val?: number, left?: TreeNode1214 | null, right?: TreeNode1214 | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

// 方法1：中序遍历 + 双指针
function twoSumBSTs(
  root1: TreeNode1214 | null,
  root2: TreeNode1214 | null,
  target: number
): boolean {
  const list1: number[] = [];
  const list2: number[] = [];
  inorder(root1, list1);
  inorder(root2, list2);
  // 双指针
  let i = 0;
  let j = list2.length - 1;
  while (i < list1.length && j >= 0) {
    const sum = list1[i] + list2[j];
    if (sum === target) return true;
    if (sum < target) i++;
    else j--;
  }
  return false;
}

function inorder(node: TreeNode1214 | null, list: number[]): void {
  if (!node) return;
  inorder(node.left, list);
  list.push(node.val);
  inorder(node.right, list);
}

// 方法2：哈希集合 + 遍历
function twoSumBSTsHash(
  root1: TreeNode1214 | null,
  root2: TreeNode1214 | null,
  target: number
): boolean {
  const set = new Set<number>();
  function collect(node: TreeNode1214 | null): void {
    if (!node) return;
    set.add(node.val);
    collect(node.left);
    collect(node.right);
  }
  collect(root1);
  function find(node: TreeNode1214 | null): boolean {
    if (!node) return false;
    if (set.has(target - node.val)) return true;
    return find(node.left) || find(node.right);
  }
  return find(root2);
}

// 方法3：BST 搜索（对 root2 二分搜索）
function twoSumBSTsSearch(
  root1: TreeNode1214 | null,
  root2: TreeNode1214 | null,
  target: number
): boolean {
  function searchInBST(node: TreeNode1214 | null, val: number): boolean {
    if (!node) return false;
    if (node.val === val) return true;
    if (val < node.val) return searchInBST(node.left, val);
    return searchInBST(node.right, val);
  }
  function dfs(node: TreeNode1214 | null): boolean {
    if (!node) return false;
    if (searchInBST(root2, target - node.val)) return true;
    return dfs(node.left) || dfs(node.right);
  }
  return dfs(root1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 099. 查找两棵二叉搜索树之和 =====");
const bst1 = new TreeNode1214(2, new TreeNode1214(1), new TreeNode1214(4));
const bst2 = new TreeNode1214(1, new TreeNode1214(0), new TreeNode1214(3));
console.log("中序+双指针 5:", twoSumBSTs(bst1, bst2, 5)); // true
console.log("哈希 5:", twoSumBSTsHash(bst1, bst2, 5)); // true

export {};
