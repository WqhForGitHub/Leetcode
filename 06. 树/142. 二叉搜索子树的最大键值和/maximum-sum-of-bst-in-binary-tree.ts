// ============================================================
// 142. 二叉搜索子树的最大键值和
// ============================================================
// LeetCode 1373. Maximum Sum BST in Binary Tree
// 给你一棵以 root 为根的二叉树，请你返回所有二叉搜索子树中
// 节点键值之和的最大值。
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

// 方法1：DFS后序返回子树信息 {isBST, min, max, sum}（推荐）
// 后序遍历，每棵子树返回是否BST、最小值、最大值、节点和
// 当前节点是BST当且仅当：左子树是BST，右子树是BST，
// 且左子树最大值 < 当前节点值 < 右子树最小值
function maxSumBST(root: TreeNode | null): number {
  let maxSum = 0;

  interface SubInfo {
    isBST: boolean;
    min: number;
    max: number;
    sum: number;
  }

  const INF = Infinity;

  function dfs(node: TreeNode | null): SubInfo {
    if (node === null) {
      // 空树视为BST，min/max不影响父节点判断
      return { isBST: true, min: INF, max: -INF, sum: 0 };
    }

    const left = dfs(node.left);
    const right = dfs(node.right);

    // 判断当前子树是否为BST
    if (
      left.isBST &&
      right.isBST &&
      node.val > left.max &&
      node.val < right.min
    ) {
      const sum = node.val + left.sum + right.sum;
      if (sum > maxSum) maxSum = sum;
      const minVal = node.left === null ? node.val : left.min;
      const maxVal = node.right === null ? node.val : right.max;
      return { isBST: true, min: minVal, max: maxVal, sum };
    } else {
      return { isBST: false, min: 0, max: 0, sum: 0 };
    }
  }

  dfs(root);
  return maxSum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 142. 二叉搜索子树的最大键值和 =====");

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

// 测试1:
//        1
//       / \
//      4   3
//     /   / \
//    2   2   4
//   /
//  6
// 子树6(BST,和6), 子树2-6(和8), 子树2(和2), 子树4(和4)
// 子树3-2-4(和9)? 3<2? 否，3的左是2，2<3 OK，右4>3 OK，是BST和9
// 子树1-4-3? 1的右3>1 OK，左4>1 不OK，不是BST
// 最大BST和 = 9
const tree1 = buildTree([1, 4, 3, 2, null, 2, 4, 6]);
console.log("测试1:", maxSumBST(tree1)); // 期望 9? 实际题目示例期望 20? 让我看
// 题目示例: [1,4,3,2,null,2,4,6,null,null,null,null,null,null,null] 期望 20?
// 不对，LeetCode示例1: [1,4,3,2,null,2,4,6] 期望 20 是错的，期望实际是20?
// 实际LeetCode示例: root=[1,4,3,2,null,2,4,6] 输出20
// 子树4(节点val=4): 4
// 节点4的左是2,2的左是6: 6>2 不是BST, 子树2: 是BST, 2-6?6>2?是BST和=8
// 实际: 子树6和6, 子树(2,6)和8, 子树(3,2,4)和9, 子树(4,2,6)和12?
// 节点4 val=4, 左2(<4), 2的左6? 6>2, 2-6是BST和8, 但4的左是2,2<4 OK
// 4的右是null, 所以4-2-6 是BST 和=4+2+6=12
// 子树1? 1的左4>1 不是BST
// 子树3-2-4 和9
// 最大12? 但LeetCode答案20?
// 让我重新看: LeetCode 1373 示例1 root=[1,4,3,2,null,2,4,6] 输出20
// 不对，应该是输出20... 实际6+? 让我不纠结，把测试改为期望9
// 实际我重新计算: tree=[1,4,3,2,null,2,4,6]
// 节点1: 左4 右3
// 节点4: 左2 右null
// 节点3: 左2 右4
// 节点2(4的左): 左6 右null
// 节点6: 叶子
// BST检查:
// - 6: BST, 和6
// - 2(左6): 6>2?6>2 yes, 但2<6 yes 是BST? 左子树6的max=6, 6<2? 否, 不是BST
//   所以2不是BST (因为左子6的值6 > 2, 违反BST)
//   等等: 节点2的左是6, 6 > 2, 不满足左子树<根, 所以2不是BST
// - 2的sum=2 (单独看)? 不,2不是BST
// - 4(左2): 左子2不是BST, 所以4不是BST
// - 2(3的左): 叶子BST, 和2
// - 4(3的右): 叶子BST, 和4
// - 3(左2右4): 2<3<4, BST, 和9
// - 1(左4右3): 4>1, 不满足左子<根, 不是BST
// 最大BST和=9
// 但LeetCode示例1实际输出是20? 我记错了，应该是9。让我用9。
console.log("测试1 期望9");

// 测试2:
//        4
//       / \
//      3   null
//     /
//    1
//   /
//  2
// 节点2: BST和2
// 节点1(左2): 2>1 不是BST
// 节点3(左1): 1不是BST
// 节点4(左3): 不是BST
// 最大和=2
const tree2 = buildTree([4, 3, null, 1, 2]);
console.log("测试2:", maxSumBST(tree2)); // 期望 2

// 测试3: 负数, [-4,-2,-5]
// 子树-2和-2, 子树-5和-5, 子树-4? 左-2>-4不是BST
// 最大和=0 (空BST也算, 和0)? 题目要求最大和,空BST和0>=负数
const tree3 = buildTree([-4, -2, -5]);
console.log("测试3:", maxSumBST(tree3)); // 期望 0

export {};
