// ============================================================
// 135. 两棵二叉搜索树中的所有元素
// ============================================================
// LeetCode 1305. All Elements in Two Binary Search Trees
// 给你两棵二叉搜索树的根节点 root1 和 root2，请你返回一个列表，
// 包含两棵树中的所有整数并按升序排列。
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

// 方法1：中序遍历+归并（推荐）
// BST 中序遍历得到升序数组，再对两个升序数组归并
function getAllElements(root1: TreeNode | null, root2: TreeNode | null): number[] {
  const list1: number[] = [];
  const list2: number[] = [];
  inorder(root1, list1);
  inorder(root2, list2);

  // 归并两个升序数组
  const result: number[] = [];
  let i = 0;
  let j = 0;
  while (i < list1.length && j < list2.length) {
    if (list1[i] <= list2[j]) {
      result.push(list1[i++]);
    } else {
      result.push(list2[j++]);
    }
  }
  while (i < list1.length) result.push(list1[i++]);
  while (j < list2.length) result.push(list2[j++]);
  return result;
}

function inorder(node: TreeNode | null, result: number[]): void {
  if (node === null) return;
  inorder(node.left, result);
  result.push(node.val);
  inorder(node.right, result);
}

// 方法2：中序遍历+排序
// 直接收集两棵树所有值，然后排序
function getAllElementsSort(root1: TreeNode | null, root2: TreeNode | null): number[] {
  const result: number[] = [];
  collect(root1, result);
  collect(root2, result);
  result.sort((a, b) => a - b);
  return result;
}

function collect(node: TreeNode | null, result: number[]): void {
  if (node === null) return;
  collect(node.left, result);
  result.push(node.val);
  collect(node.right, result);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 135. 两棵二叉搜索树中的所有元素 =====");

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

// 测试1: root1 = [2,1,4], root2 = [1,0,3]
// 合并后升序：[0,1,1,2,3,4]
console.log("测试1 归并:", getAllElements(buildTree([2, 1, 4]), buildTree([1, 0, 3])));
// 期望 [0,1,1,2,3,4]
console.log("测试1 排序:", getAllElementsSort(buildTree([2, 1, 4]), buildTree([1, 0, 3])));

// 测试2: root1 = [1,null,8], root2 = [8,1]
// root1 升序：[1,8], root2 升序：[1,8]
// 合并：[1,1,8,8]
console.log("测试2 归并:", getAllElements(buildTree([1, null, 8]), buildTree([8, 1])));
// 期望 [1,1,8,8]

// 测试3: root1 = null, root2 = [5,1,7]
console.log("测试3 归并:", getAllElements(null, buildTree([5, 1, 7])));
// 期望 [1,5,7]

// 测试4: 两棵都空
console.log("测试4 归并:", getAllElements(null, null));
// 期望 []

export {};
