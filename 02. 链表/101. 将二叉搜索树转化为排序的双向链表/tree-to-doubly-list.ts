// ============================================================
// 101. 将二叉搜索树转化为排序的双向链表
// ============================================================
// 剑指 Offer 36. 二叉搜索树与双向链表
// 输入一棵二叉搜索树，将该二叉搜索树转换成一个排序的循环双向链表。
// 要求不能创建任何新节点，只能调整树中节点指针的指向。
// 时间复杂度：O(n)，空间复杂度：O(h)（递归栈，h 为树高）

// 树节点 / 双向链表节点定义
class Node {
  val: number;
  left: Node | null;
  right: Node | null;
  constructor(val?: number, left?: Node | null, right?: Node | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

// 辅助函数：由数组（层序）构建二叉搜索树
function buildBST(arr: (number | null)[]): Node | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new Node(arr[0]);
  const queue: (Node | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.left = new Node(arr[i] as number);
        queue.push(node.left);
      } else {
        queue.push(null);
      }
      i++;
    }
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.right = new Node(arr[i] as number);
        queue.push(node.right);
      } else {
        queue.push(null);
      }
      i++;
    }
  }
  return root;
}

// 辅助函数：将循环双向链表转为数组（从 head 开始向右遍历）
function doublyListToArray(head: Node | null): number[] {
  if (head === null) return [];
  const res: number[] = [];
  let cur: Node | null = head;
  do {
    res.push(cur.val);
    cur = cur.right;
  } while (cur !== null && cur !== head);
  return res;
}

// ============================================================
// 方法一：中序遍历（递归）
// ============================================================
// 中序遍历过程中维护 prev（前驱）和 head（头节点）。
// 将 prev.right = cur, cur.left = prev，最后首尾相连形成循环。
function treeToDoublyList(root: Node | null): Node | null {
  if (root === null) return null;

  let prev: Node | null = null;
  let head: Node | null = null;

  // 中序遍历
  function inorder(node: Node | null): void {
    if (node === null) return;

    inorder(node.left);

    // 访问当前节点
    if (prev === null) {
      head = node; // 第一个节点为头节点
    } else {
      prev.right = node;
      node.left = prev;
    }
    prev = node;

    inorder(node.right);
  }

  inorder(root);

  // 首尾相连，形成循环双向链表
  head!.left = prev;
  prev!.right = head;

  return head;
}

// ============================================================
// 方法二：中序遍历（迭代，使用栈）
// ============================================================
// 显式栈模拟中序遍历，逻辑与方法一一致。
function treeToDoublyListIterative(root: Node | null): Node | null {
  if (root === null) return null;

  let prev: Node | null = null;
  let head: Node | null = null;
  const stack: Node[] = [];
  let cur: Node | null = root;

  while (stack.length > 0 || cur !== null) {
    // 一路向左压栈
    while (cur !== null) {
      stack.push(cur);
      cur = cur.left;
    }

    cur = stack.pop()!;

    // 访问当前节点
    if (prev === null) {
      head = cur;
    } else {
      prev.right = cur;
      cur.left = prev;
    }
    prev = cur;

    cur = cur.right;
  }

  // 首尾相连
  head!.left = prev;
  prev!.right = head;

  return head;
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  // 测试用例 1: [4,2,5,1,3]
  //        4
  //       / \
  //      2   5
  //     / \
  //    1   3
  // 中序: 1,2,3,4,5
  const tree1 = buildBST([4, 2, 5, 1, 3]);
  const res1 = treeToDoublyList(tree1);
  console.log("测试1（递归）:", doublyListToArray(res1)); // [1,2,3,4,5]

  const tree1b = buildBST([4, 2, 5, 1, 3]);
  const res1b = treeToDoublyListIterative(tree1b);
  console.log("测试1（迭代）:", doublyListToArray(res1b)); // [1,2,3,4,5]

  // 验证循环性：head.left 应为尾节点
  if (res1 !== null) {
    console.log("循环验证: head.left.val =", res1.left!.val, "尾节点应为 5"); // 5
    console.log("循环验证: head.left.right === head:", res1.left!.right === res1); // true
  }

  // 测试用例 2: 单节点 [1]
  const res2 = treeToDoublyList(buildBST([1]));
  console.log("测试2:", doublyListToArray(res2)); // [1]
  if (res2 !== null) {
    console.log("单节点自环: left===right===self:", res2.left === res2 && res2.right === res2); // true
  }

  // 测试用例 3: 空树
  console.log("测试3:", treeToDoublyList(null)); // null
}

test();

export {};
