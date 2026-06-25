// ============================================================
// 031. 将二叉搜索树转化为排序的双向链表
// ============================================================
// LeetCode 426. Convert Binary Search Tree to Sorted Doubly Linked List
// 将 BST 转换为排序的循环双向链表（left=prev, right=next），返回头节点。

class Node {
  val: number;
  left: Node | null = null;
  right: Node | null = null;
  constructor(val: number) {
    this.val = val;
  }
}

// ------------------------------------------------------------
// 方法1：栈中序遍历
// ------------------------------------------------------------
// 中序遍历 BST 得到升序，逐个串成双向链表，最后首尾相连成循环。
// 时间 O(n)，空间 O(n)（栈）。
function treeToDoublyList(root: Node | null): Node | null {
  if (root === null) return null;
  const stack: Node[] = [];
  let cur: Node | null = root;
  let first: Node | null = null;
  let last: Node | null = null;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop()!;
    if (first === null) first = cur;
    if (last !== null) {
      last.right = cur;
      cur.left = last;
    }
    last = cur;
    cur = cur.right;
  }
  // 首尾相连成循环
  first!.left = last;
  last!.right = first;
  return first;
}

// ------------------------------------------------------------
// 方法2：递归中序
// ------------------------------------------------------------
function treeToDoublyListRecursive(root: Node | null): Node | null {
  if (root === null) return null;
  let first: Node | null = null;
  let last: Node | null = null;
  function dfs(node: Node | null): void {
    if (node === null) return;
    dfs(node.left);
    if (last !== null) {
      last.right = node;
      node.left = last;
    } else {
      first = node;
    }
    last = node;
    dfs(node.right);
  }
  dfs(root);
  first!.left = last;
  last!.right = first;
  return first;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  //     4
  //    / \
  //   2   5
  //  / \
  // 1   3
  const root = new Node(4);
  root.left = new Node(2);
  root.right = new Node(5);
  root.left.left = new Node(1);
  root.left.right = new Node(3);
  const head = treeToDoublyList(root);
  const result: number[] = [];
  let cur: Node | null = head;
  do {
    result.push(cur!.val);
    cur = cur!.right;
  } while (cur !== head);
  console.log('测试1 - 栈法:', result, '期望: [1,2,3,4,5]');
}

test();

export {};
