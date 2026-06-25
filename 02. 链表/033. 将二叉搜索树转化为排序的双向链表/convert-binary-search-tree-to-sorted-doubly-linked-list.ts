// ============================================================
// 033. 将二叉搜索树转化为排序的双向链表
// ============================================================
// LeetCode 426. Convert Binary Search Tree to Sorted Doubly Linked List
// 将一棵二叉搜索树(BST)转化为排序的循环双向链表。
// 链表中节点的 left 指针作为前驱(prev)，right 指针作为后继(next)。
// 要求返回双向链表中最小的元素（即链表头），且首尾相连成环。
// 时间复杂度：O(n)，空间复杂度：O(h)（h 为树高，递归栈）

// 节点定义（含 left/right，分别作为双向链表的 prev/next）
class Node {
  val: number;
  left: Node | null; // 前驱
  right: Node | null; // 后继
  constructor(val?: number, left?: Node | null, right?: Node | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

// 辅助函数：根据层序数组构建 BST（用于测试）
function buildBST(arr: (number | null)[]): Node | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new Node(arr[0]);
  const queue: (Node | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift();
    if (node === null || node === undefined) continue;
    if (i < arr.length && arr[i] !== null) {
      node.left = new Node(arr[i]!);
      queue.push(node.left);
    } else {
      queue.push(null);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new Node(arr[i]!);
      queue.push(node.right);
    } else {
      queue.push(null);
    }
    i++;
  }
  return root;
}

// 辅助函数：将循环双向链表转为数组（用于验证）
function doublyListToArray(head: Node | null): number[] {
  if (head === null) return [];
  const result: number[] = [];
  let curr = head;
  do {
    result.push(curr.val);
    curr = curr.right!;
  } while (curr !== head);
  return result;
}

// ============================================================
// 方法1：中序遍历 + 维护 prev 指针（推荐）
// ============================================================
// 中序遍历 BST 得到排序序列，遍历过程中连接 prev 和 curr。
// 用 first 和 last 分别记录链表头和尾，最后首尾相连成环。
// 时间复杂度 O(n)，空间复杂度 O(h)
function treeToDoublyList(root: Node | null): Node | null {
  if (root === null) return null;

  let first: Node | null = null; // 链表头（最小节点）
  let last: Node | null = null; // 链表尾（最大节点）

  // 中序遍历（迭代法）
  const stack: Node[] = [];
  let curr: Node | null = root;
  while (curr !== null || stack.length > 0) {
    // 一直向左走到底
    while (curr !== null) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop()!;
    // 访问当前节点
    if (first === null) {
      first = curr; // 第一个访问的节点是链表头
    }
    if (last !== null) {
      // 连接 last 和 curr
      last.right = curr;
      curr.left = last;
    }
    last = curr; // 更新 last
    // 转向右子树
    curr = curr.right;
  }

  // 首尾相连成环
  first!.left = last;
  last!.right = first;

  return first;
}

// ============================================================
// 方法2：递归中序遍历
// ============================================================
// 用递归实现中序遍历，维护 prev 指针。
function treeToDoublyListRecursive(root: Node | null): Node | null {
  if (root === null) return null;

  let first: Node | null = null;
  let last: Node | null = null;

  const inorder = (node: Node | null): void => {
    if (node === null) return;
    // 先遍历左子树
    inorder(node.left);
    // 处理当前节点
    if (first === null) {
      first = node;
    }
    if (last !== null) {
      last.right = node;
      node.left = last;
    }
    last = node;
    // 再遍历右子树
    inorder(node.right);
  };

  inorder(root);

  // 首尾相连成环
  first!.left = last;
  last!.right = first;

  return first;
}

// 测试
console.log("===== 033. 将二叉搜索树转化为排序的双向链表 =====");
{
  //       4
  //      / \
  //     2   5
  //    / \
  //   1   3
  const root = buildBST([4, 2, 5, 1, 3]);
  const head = treeToDoublyList(root);
  console.log("方法1：", doublyListToArray(head)); // [1,2,3,4,5]
  // 验证环：头的前驱是尾，尾的后继是头
  console.log("首尾相连验证：head.left.val =", head!.left!.val, "(应为5)");
}
{
  const root = buildBST([4, 2, 5, 1, 3]);
  const head = treeToDoublyListRecursive(root);
  console.log("方法2：", doublyListToArray(head)); // [1,2,3,4,5]
}
{
  const root = buildBST([1]);
  const head = treeToDoublyList(root);
  console.log("单节点：", doublyListToArray(head)); // [1]
  console.log(
    "单节点自环验证：head.left === head =",
    head!.left === head,
    ", head.right === head =",
    head!.right === head
  ); // true, true
}

export {};
