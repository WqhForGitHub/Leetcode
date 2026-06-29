// ============================================================
// 129. 查找两棵二叉搜索树之和
// ============================================================
// LeetCode 1214. Two Sum BSTs
// 给定两棵二叉搜索树的根节点 root1 和 root2，
// 判断是否存在一对节点（每棵树各一个），使得它们的值之和等于目标值 target。
// 时间复杂度：O(n + m)，空间复杂度：O(n + m)

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
// BST 中序遍历得到升序数组
// 将两棵树分别中序遍历得到 list1（升序）和 list2（升序）
// 用双指针：一个指向 list1 头，一个指向 list2 尾，根据和的大小移动指针
function twoSumBSTs(
  root1: TreeNode | null,
  root2: TreeNode | null,
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

function inorder(node: TreeNode | null, result: number[]): void {
  if (node === null) return;
  inorder(node.left, result);
  result.push(node.val);
  inorder(node.right, result);
}

// 方法2：哈希集合
// 将一棵树的所有值放入集合，遍历另一棵树，检查 target - val 是否在集合中
function twoSumBSTsHash(
  root1: TreeNode | null,
  root2: TreeNode | null,
  target: number
): boolean {
  const set = new Set<number>();
  // 中序遍历 root1 收集所有值
  function collect(node: TreeNode | null): void {
    if (node === null) return;
    collect(node.left);
    set.add(node.val);
    collect(node.right);
  }
  collect(root1);

  // 遍历 root2 检查
  function check(node: TreeNode | null): boolean {
    if (node === null) return false;
    if (set.has(target - node.val)) return true;
    return check(node.left) || check(node.right);
  }
  return check(root2);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 129. 查找两棵二叉搜索树之和 =====");

// 辅助函数：数组构建树（层序）
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (node !== null) {
      if (i < arr.length) {
        const leftVal = arr[i++];
        node.left = leftVal !== null ? new TreeNode(leftVal) : null;
        queue.push(node.left);
      }
      if (i < arr.length) {
        const rightVal = arr[i++];
        node.right = rightVal !== null ? new TreeNode(rightVal) : null;
        queue.push(node.right);
      }
    }
  }
  return root;
}

// 测试1: root1 = [2,1,4], root2 = [1,0,3], target = 5
// 2 + 3 = 5
console.log(
  "测试1 双指针:",
  twoSumBSTs(buildTree([2, 1, 4]), buildTree([1, 0, 3]), 5)
); // 期望 true
console.log(
  "测试1 哈希:",
  twoSumBSTsHash(buildTree([2, 1, 4]), buildTree([1, 0, 3]), 5)
); // 期望 true

// 测试2: root1 = [0,-10,10], root2 = [5,1,7,0,2], target = 18
console.log(
  "测试2 双指针:",
  twoSumBSTs(buildTree([0, -10, 10]), buildTree([5, 1, 7, 0, 2]), 18)
); // 期望 false

// 测试3: root1 = [0,-10,10], root2 = [5,1,7,0,2], target = 17
// 10 + 7 = 17
console.log(
  "测试3 双指针:",
  twoSumBSTs(buildTree([0, -10, 10]), buildTree([5, 1, 7, 0, 2]), 17)
); // 期望 true

export {};
