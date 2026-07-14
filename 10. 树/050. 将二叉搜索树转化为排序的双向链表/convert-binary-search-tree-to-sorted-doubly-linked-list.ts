// ============================================================
// 050. 将二叉搜索树转化为排序的双向链表
// ============================================================
// LeetCode 426. Convert Binary Search Tree to Sorted Doubly Linked List
// 将一个二叉搜索树转化为已排序的循环双向链表。
// 不能创建新节点，只能调整指针指向。
// 时间复杂度：O(n)，空间复杂度：O(n)

class NodeDL {
  val: number;
  left: NodeDL | null;
  right: NodeDL | null;
  constructor(val?: number, left?: NodeDL | null, right?: NodeDL | null) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

// 方法1：中序遍历递归（推荐）
// 中序遍历过程中维护前驱节点 prev 和头节点 head
// 遍历完成后将头尾相连形成循环链表
function treeToDoublyList(root: NodeDL | null): NodeDL | null {
  if (root === null) return null;

  let head: NodeDL | null = null;
  let prev: NodeDL | null = null;

  function inorder(node: NodeDL | null): void {
    if (node === null) return;
    inorder(node.left);
    // 处理当前节点
    if (prev === null) {
      // 第一个节点，设为头节点
      head = node;
    } else {
      // 前驱的 right 指向当前，当前的 left 指向前驱
      prev.right = node;
      node.left = prev;
    }
    prev = node;
    inorder(node.right);
  }

  inorder(root);
  // 将头尾相连形成循环链表
  head!.left = prev;
  prev!.right = head;
  return head;
}

// 方法2：中序遍历迭代
// 使用栈模拟中序遍历
function treeToDoublyListIterative(root: NodeDL | null): NodeDL | null {
  if (root === null) return null;

  let head: NodeDL | null = null;
  let prev: NodeDL | null = null;
  const stack: NodeDL[] = [];
  let curr: NodeDL | null = root;

  while (curr !== null || stack.length > 0) {
    while (curr !== null) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop()!;
    if (prev === null) {
      head = curr;
    } else {
      prev.right = curr;
      curr.left = prev;
    }
    prev = curr;
    curr = curr.right;
  }

  // 头尾相连
  head!.left = prev;
  prev!.right = head;
  return head;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 050. 将二叉搜索树转化为排序的双向链表 =====");
// 构造BST: [4,2,5,1,3]
//       4
//      / \
//     2   5
//    / \
//   1   3
const tree1 = new NodeDL(4);
tree1.left = new NodeDL(2);
tree1.right = new NodeDL(5);
tree1.left.left = new NodeDL(1);
tree1.left.right = new NodeDL(3);

const result1 = treeToDoublyList(tree1);
// 打印循环链表
const printList = (head: NodeDL | null): number[] => {
  if (head === null) return [];
  const arr: number[] = [head.val];
  let curr = head.right!;
  while (curr !== head) {
    arr.push(curr.val);
    curr = curr.right!;
  }
  return arr;
};
console.log("递归中序:", printList(result1)); // 期望结果 [1,2,3,4,5]

// 构造BST: [2,1,3]
const tree2 = new NodeDL(2);
tree2.left = new NodeDL(1);
tree2.right = new NodeDL(3);
const result2 = treeToDoublyListIterative(tree2);
console.log("迭代中序:", printList(result2)); // 期望结果 [1,2,3]

export {};
