// ============================================================
// 145. 找出克隆二叉树中的相同节点
// ============================================================
// LeetCode 1379. Find a Corresponding Node of a Binary Tree in a Clone of That Tree
// 给定两棵树 original 和 cloned，以及 original 中的一个目标节点 target，
// 返回 cloned 中对应的节点（引用）。
// 时间复杂度：O(n)，空间复杂度：O(h)

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

// 方法1：DFS递归（推荐）
// 在 original 和 cloned 上同步遍历，当 original 节点等于 target 时返回 cloned 对应节点
function getTargetCopy(
  original: TreeNode | null,
  cloned: TreeNode | null,
  target: TreeNode | null
): TreeNode | null {
  if (original === null || cloned === null) return null;
  if (original === target) return cloned;

  // 在左子树中找
  const left = getTargetCopy(original.left, cloned.left, target);
  if (left !== null) return left;
  // 在右子树中找
  return getTargetCopy(original.right, cloned.right, target);
}

// 方法2：BFS迭代
// 同步层序遍历两棵树
function getTargetCopyBFS(
  original: TreeNode | null,
  cloned: TreeNode | null,
  target: TreeNode | null
): TreeNode | null {
  if (original === null || cloned === null) return null;

  const queueO: (TreeNode | null)[] = [original];
  const queueC: (TreeNode | null)[] = [cloned];

  while (queueO.length > 0) {
    const nodeO = queueO.shift()!;
    const nodeC = queueC.shift()!;

    if (nodeO === target) return nodeC;

    if (nodeO.left) {
      queueO.push(nodeO.left);
      queueC.push(nodeC!.left);
    }
    if (nodeO.right) {
      queueO.push(nodeO.right);
      queueC.push(nodeC!.right);
    }
  }

  return null;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 145. 找出克隆二叉树中的相同节点 =====");

function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i] as number);
      queue.push(node.left!);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i] as number);
      queue.push(node.right!);
    }
    i++;
  }
  return root;
}

// 测试1: tree=[7,4,3,null,null,6,19], target=3
//        7
//       / \
//      4   3
//         / \
//        6  19
const original1 = buildTree([7, 4, 3, null, null, 6, 19]);
// 深拷贝
function cloneTree(node: TreeNode | null): TreeNode | null {
  if (node === null) return null;
  return new TreeNode(node.val, cloneTree(node.left), cloneTree(node.right));
}
const cloned1 = cloneTree(original1);
// 找original中节点值为3的节点
function findNode(node: TreeNode | null, val: number): TreeNode | null {
  if (node === null) return null;
  if (node.val === val) return node;
  return findNode(node.left, val) || findNode(node.right, val);
}
const target1 = findNode(original1, 3);
const result1 = getTargetCopy(original1, cloned1, target1);
console.log("测试1 DFS:", result1 ? result1.val : null, "是否不同引用:", result1 !== target1); // 期望 3, true

// 测试2: target=6
const target2 = findNode(original1, 6);
const result2 = getTargetCopyBFS(original1, cloned1, target2);
console.log("测试2 BFS:", result2 ? result2.val : null, "是否不同引用:", result2 !== target2); // 期望 6, true

// 测试3: target=7 (根)
const target3 = original1;
const result3 = getTargetCopy(original1, cloned1, target3);
console.log("测试3 DFS:", result3 ? result3.val : null); // 期望 7

export {};
