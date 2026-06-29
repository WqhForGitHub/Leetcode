// ============================================================
// 102. 根据前序和后序遍历构造二叉树
// ============================================================
// LeetCode 889. Construct Binary Tree from Preorder and Postorder Traversal
// 给定两个整数数组 preorder 和 postorder，其中 preorder 是一棵二叉树的前序遍历，
// postorder 是同一棵二叉树的后序遍历，构造并返回该二叉树。
// 注意：当存在节点只有一个孩子时，前序+后序无法唯一确定该孩子的左右位置，
// 这里约定将其作为左孩子。
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

// 方法1：递归 + 哈希表（推荐）
// 前序：[根, 左子树前序, 右子树前序]
// 后序：[左子树后序, 右子树后序, 根]
// 关键：preorder[1] 是左子树根，在 postorder 中找到它的位置，
// 即可确定左子树大小 L，从而切分左右子树范围。

function constructFromPrePost(preorder: number[], postorder: number[]): TreeNode | null {
  const postIndex = new Map<number, number>();
  for (let i = 0; i < postorder.length; i++) {
    postIndex.set(postorder[i], i);
  }

  function build(preStart: number, preEnd: number, postStart: number, postEnd: number): TreeNode | null {
    if (preStart > preEnd) return null;
    // 仅剩一个节点
    if (preStart === preEnd) return new TreeNode(preorder[preStart]);

    const rootVal = preorder[preStart];
    const leftRootVal = preorder[preStart + 1];
    // 左子树根在 postorder 中的位置
    const leftRootIdx = postIndex.get(leftRootVal)!;
    // 左子树大小（含根）
    const leftSize = leftRootIdx - postStart + 1;

    const root = new TreeNode(rootVal);
    root.left = build(
      preStart + 1,
      preStart + leftSize,
      postStart,
      leftRootIdx
    );
    root.right = build(
      preStart + leftSize + 1,
      preEnd,
      leftRootIdx + 1,
      postEnd - 1
    );
    return root;
  }

  return build(0, preorder.length - 1, 0, postorder.length - 1);
}

// 方法2：迭代栈
// 思路：用一个栈模拟构建过程。遍历 preorder 依次创建节点并压栈，
// 当栈顶节点值等于当前 postorder 待处理值时，说明该节点子树已构建完成，弹栈。
function constructFromPrePostIter(preorder: number[], postorder: number[]): TreeNode | null {
  if (preorder.length === 0) return null;
  const root = new TreeNode(preorder[0]);
  const stack: TreeNode[] = [root];
  let postIdx = 0;

  for (let i = 1; i < preorder.length; i++) {
    const node = new TreeNode(preorder[i]);
    // 找栈顶节点空缺位置挂上去
    const top = stack[stack.length - 1];
    if (top.left === null) {
      top.left = node;
    } else {
      top.right = node;
    }
    stack.push(node);

    // 弹出已构建完成的子树
    while (stack.length > 0 && stack[stack.length - 1].val === postorder[postIdx]) {
      stack.pop();
      postIdx++;
    }
  }
  return root;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 102. 根据前序和后序遍历构造二叉树 =====");

// 辅助函数：层序遍历输出
function levelOrderForPrePost(root: TreeNode | null): (number | null)[] {
  if (root === null) return [];
  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) {
      result.push(null);
      continue;
    }
    result.push(node.val);
    queue.push(node.left);
    queue.push(node.right);
  }
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// 测试1: preorder = [1,2,4,5,3,6,7], postorder = [4,5,2,6,7,3,1]
//         1
//        / \
//       2   3
//      / \ / \
//     4  5 6  7
const tree1 = constructFromPrePost([1, 2, 4, 5, 3, 6, 7], [4, 5, 2, 6, 7, 3, 1]);
console.log("方法1 - 层序:", levelOrderForPrePost(tree1)); // 期望 [1,2,3,4,5,6,7]

const tree1Iter = constructFromPrePostIter([1, 2, 4, 5, 3, 6, 7], [4, 5, 2, 6, 7, 3, 1]);
console.log("方法2 - 层序:", levelOrderForPrePost(tree1Iter)); // 期望 [1,2,3,4,5,6,7]

// 测试2: preorder = [1], postorder = [1]
const tree2 = constructFromPrePost([1], [1]);
console.log("单节点:", tree2?.val); // 期望 1

// 测试3: 只有左子树（约定挂在左）
// preorder = [2,1], postorder = [1,2]
const tree3 = constructFromPrePost([2, 1], [1, 2]);
console.log("测试3 - 层序:", levelOrderForPrePost(tree3)); // 期望 [2,1]

// 测试4: 复杂例子
const tree4 = constructFromPrePostIter([1, 2, 3], [3, 2, 1]);
console.log("测试4 - 层序:", levelOrderForPrePost(tree4)); // 期望 [1,2,null,3]（约定左孩子）

export {};
