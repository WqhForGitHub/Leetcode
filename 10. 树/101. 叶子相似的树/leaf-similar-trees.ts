// ============================================================
// 101. 叶子相似的树
// ============================================================
// LeetCode 872. Leaf-Similar Trees
// 请考虑一棵二叉树上所有的叶子，从左到右的顺序，形成一棵"叶值序列"。
// 判断两棵树的叶值序列是否相同。
// 时间复杂度：O(n1 + n2)，空间复杂度：O(h1 + h2)

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

// 方法1：DFS 递归（推荐）
// 分别对两棵树做中序式 DFS，收集叶节点值，最后比较两个数组。
function leafSimilar(root1: TreeNode | null, root2: TreeNode | null): boolean {
  function getLeaves(node: TreeNode | null, leaves: number[]): void {
    if (node === null) return;
    // 叶节点：左右孩子都为空
    if (node.left === null && node.right === null) {
      leaves.push(node.val);
      return;
    }
    getLeaves(node.left, leaves);
    getLeaves(node.right, leaves);
  }

  const leaves1: number[] = [];
  const leaves2: number[] = [];
  getLeaves(root1, leaves1);
  getLeaves(root2, leaves2);

  if (leaves1.length !== leaves2.length) return false;
  for (let i = 0; i < leaves1.length; i++) {
    if (leaves1[i] !== leaves2[i]) return false;
  }
  return true;
}

// 方法2：迭代栈
// 用显式栈模拟前序遍历，遇到叶节点就收集。
function leafSimilarIter(root1: TreeNode | null, root2: TreeNode | null): boolean {
  function getLeavesIter(root: TreeNode | null): number[] {
    const leaves: number[] = [];
    const stack: (TreeNode | null)[] = [root];
    while (stack.length > 0) {
      const node = stack.pop();
      if (node === null) continue;
      if (node.left === null && node.right === null) {
        leaves.push(node.val);
      }
      // 先压右再压左，保证出栈顺序为左在前
      stack.push(node.right);
      stack.push(node.left);
    }
    return leaves;
  }

  const leaves1 = getLeavesIter(root1);
  const leaves2 = getLeavesIter(root2);
  if (leaves1.length !== leaves2.length) return false;
  for (let i = 0; i < leaves1.length; i++) {
    if (leaves1[i] !== leaves2[i]) return false;
  }
  return true;
}

// 方法3：生成器（边遍历边比较，可提前终止）
function leafSimilarGenerator(root1: TreeNode | null, root2: TreeNode | null): boolean {
  function* leafGenerator(node: TreeNode | null): Generator<number> {
    if (node === null) return;
    if (node.left === null && node.right === null) {
      yield node.val;
      return;
    }
    yield* leafGenerator(node.left);
    yield* leafGenerator(node.right);
  }

  const gen1 = leafGenerator(root1);
  const gen2 = leafGenerator(root2);
  while (true) {
    const r1 = gen1.next();
    const r2 = gen2.next();
    if (r1.done && r2.done) return true;
    if (r1.done || r2.done) return false;
    if (r1.value !== r2.value) return false;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 101. 叶子相似的树 =====");

// 辅助函数：通过层序数组构建二叉树
function buildTreeForLeaf(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.left = new TreeNode(arr[i] as number);
        queue.push(node.left);
      }
      i++;
    }
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.right = new TreeNode(arr[i] as number);
        queue.push(node.right);
      }
      i++;
    }
  }
  return root;
}

// 测试1: 两棵树叶序列都为 [6,7,4,9,8]
// root1 = [3,5,1,6,2,9,8,null,null,7,4]
// root2 = [3,5,1,6,7,4,2,null,null,null,null,null,null,9,8]
const tree1a = buildTreeForLeaf([3, 5, 1, 6, 2, 9, 8, null, null, 7, 4]);
const tree1b = buildTreeForLeaf([3, 5, 1, 6, 7, 4, 2, null, null, null, null, null, null, 9, 8]);
console.log("测试1 - 递归:", leafSimilar(tree1a, tree1b)); // 期望 true
console.log("测试1 - 迭代:", leafSimilarIter(tree1a, tree1b)); // 期望 true
console.log("测试1 - 生成器:", leafSimilarGenerator(tree1a, tree1b)); // 期望 true

// 测试2: 不同的叶序列
// root1 = [1,2,3], root2 = [1,3,2]
const tree2a = buildTreeForLeaf([1, 2, 3]);
const tree2b = buildTreeForLeaf([1, 3, 2]);
console.log("测试2 - 递归:", leafSimilar(tree2a, tree2b)); // 期望 false（叶序列 [2,3] vs [3,2]）

// 测试3: 单节点相同
const tree3a = buildTreeForLeaf([1]);
const tree3b = buildTreeForLeaf([1]);
console.log("测试3:", leafSimilar(tree3a, tree3b)); // 期望 true

// 测试4: 单节点不同
const tree4a = buildTreeForLeaf([1]);
const tree4b = buildTreeForLeaf([2]);
console.log("测试4:", leafSimilar(tree4a, tree4b)); // 期望 false

export {};
