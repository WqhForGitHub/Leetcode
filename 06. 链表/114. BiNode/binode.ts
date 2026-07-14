// ============================================================
// 114. BiNode
// ============================================================
// 面试题 17.12. BiNode
// 二叉搜索树转换为单向链表。将各节点用 right 指针连接（left 置 null），
// 转换后类似单链表，保持中序遍历的升序顺序。返回链表头节点。
// 时间复杂度：O(n)，空间复杂度：O(h)（h 为树高，方法1递归栈）

// 二叉树节点定义
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(val: number = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// 辅助函数：用数组（层序）构建二叉搜索树
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i] as number);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i] as number);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// 辅助函数：将转换后的链表转为数组（便于打印验证）
function listToArray(head: TreeNode | null): number[] {
  const result: number[] = [];
  let cur = head;
  while (cur) {
    result.push(cur.val);
    cur = cur.right;
  }
  return result;
}

// ============================================================
// 方法1：递归中序遍历
// ============================================================
// 使用虚拟头节点（TreeNode 类型）和 prev 指针，中序遍历 BST。
// 每访问一个节点：将 prev 的 right 指向当前节点，当前节点的 left 置 null。
// prev 始终指向链表的前一个节点（中序前驱）。
// 时间复杂度：O(n)，空间复杂度：O(h)（递归栈）
function convertBiNode(root: TreeNode | null): TreeNode | null {
  // 虚拟头节点，用 TreeNode 类型（right 指针充当 next）
  const dummy = new TreeNode(-1);
  let prev: TreeNode = dummy;

  const inorder = (node: TreeNode | null): void => {
    if (node === null) return;

    // 先遍历左子树
    inorder(node.left);

    // 处理当前节点：连接到链表尾部，左指针置空
    prev.right = node;
    prev = node;
    node.left = null;

    // 遍历右子树
    inorder(node.right);
  };

  inorder(root);

  // dummy.right 即为链表头节点
  return dummy.right;
}

// ============================================================
// 方法2：迭代中序遍历（显式栈）
// ============================================================
// 使用栈模拟中序遍历，逻辑与方法1相同但避免递归。
// 时间复杂度：O(n)，空间复杂度：O(h)
function convertBiNodeIterative(root: TreeNode | null): TreeNode | null {
  const dummy = new TreeNode(-1);
  let prev: TreeNode = dummy;

  const stack: TreeNode[] = [];
  let cur: TreeNode | null = root;

  while (cur !== null || stack.length > 0) {
    // 一直向左走，将路径上的节点压入栈
    while (cur !== null) {
      stack.push(cur);
      cur = cur.left;
    }

    // 弹出栈顶节点（中序当前节点）
    cur = stack.pop()!;

    // 连接当前节点到链表尾部
    prev.right = cur;
    prev = cur;
    cur.left = null;

    // 转向右子树
    cur = cur.right;
  }

  return dummy.right;
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  console.log("===== 114. BiNode 测试 =====\n");

  // 测试1：普通 BST
  //       4
  //      / \
  //     2   5
  //    / \   \
  //   1   3   6
  // 中序: 1 -> 2 -> 3 -> 4 -> 5 -> 6
  console.log("测试1: 普通 BST");
  const tree1 = buildTree([4, 2, 5, 1, 3, null, 6]);
  const result1 = convertBiNode(tree1);
  console.log("  方法1(递归):", listToArray(result1));
  console.log("  期望: [1, 2, 3, 4, 5, 6]\n");

  const tree1b = buildTree([4, 2, 5, 1, 3, null, 6]);
  const result1b = convertBiNodeIterative(tree1b);
  console.log("  方法2(迭代):", listToArray(result1b));
  console.log("  期望: [1, 2, 3, 4, 5, 6]\n");

  // 测试2：单节点
  console.log("测试2: 单节点");
  const tree2 = buildTree([1]);
  const result2 = convertBiNode(tree2);
  console.log("  方法1(递归):", listToArray(result2));
  console.log("  期望: [1]\n");

  // 测试3：左斜树
  //     3
  //    /
  //   2
  //  /
  // 1
  // 中序: 1 -> 2 -> 3
  console.log("测试3: 左斜树");
  const tree3 = buildTree([3, 2, null, 1]);
  const result3 = convertBiNode(tree3);
  console.log("  方法1(递归):", listToArray(result3));
  console.log("  期望: [1, 2, 3]\n");

  // 测试4：右斜树
  // 1
  //  \
  //   2
  //    \
  //     3
  // 中序: 1 -> 2 -> 3
  console.log("测试4: 右斜树");
  const tree4 = buildTree([1, null, 2, null, null, null, 3]);
  const result4 = convertBiNode(tree4);
  console.log("  方法1(递归):", listToArray(result4));
  console.log("  期望: [1, 2, 3]\n");

  // 测试5：空树
  console.log("测试5: 空树");
  const tree5 = buildTree([]);
  const result5 = convertBiNode(tree5);
  console.log("  方法1(递归):", listToArray(result5));
  console.log("  期望: []\n");

  // 测试6：验证 left 指针全部置 null
  console.log("测试6: 验证 left 指针置 null");
  const tree6 = buildTree([2, 1, 3]);
  const result6 = convertBiNode(tree6);
  let cur: TreeNode | null = result6;
  let allNull = true;
  while (cur) {
    if (cur.left !== null) {
      allNull = false;
      break;
    }
    cur = cur.right;
  }
  console.log("  所有 left 为 null:", allNull, "(期望: true)");
  console.log("  结果:", listToArray(result6), "(期望: [1, 2, 3])\n");
}

test();

export {};
