// ============================================================
// 140. 二叉树中的链表
// ============================================================
// LeetCode 1367. Linked List in Binary Tree
// 给你一棵以 root 为根的二叉树和一个以 head 为头的链表，
// 判断链表是否是二叉树中某条从上到下路径的子路径。
// 时间复杂度：O(n*m) 最坏，空间复杂度：O(h)

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val ?? 0;
    this.next = next ?? null;
  }
}

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

// 方法1：DFS递归匹配（推荐）
// 对树中每个节点尝试作为起点匹配链表，递归向下匹配
function isSubPath(head: ListNode | null, root: TreeNode | null): boolean {
  if (head === null) return true;
  if (root === null) return false;

  // 当前节点作为起点匹配，或继续在左右子树中找起点
  return dfsMatch(head, root) || isSubPath(head, root.left) || isSubPath(head, root.right);
}

// 从链表节点 head 和树节点 node 开始尝试逐个匹配
function dfsMatch(head: ListNode | null, node: TreeNode | null): boolean {
  if (head === null) return true;
  if (node === null) return false;
  if (head.val !== node.val) return false;
  return dfsMatch(head.next, node.left) || dfsMatch(head.next, node.right);
}

// 方法2：KMP算法
// 将链表转为数组，用KMP的next数组在树的前序路径上匹配
function isSubPathKMP(head: ListNode | null, root: TreeNode | null): boolean {
  if (head === null) return true;
  // 链表转数组
  const pattern: number[] = [];
  let cur: ListNode | null = head;
  while (cur !== null) {
    pattern.push(cur.val);
    cur = cur.next;
  }

  // 构建KMP next数组（失败指针）
  const n = pattern.length;
  const next = new Array(n).fill(0);
  let k = 0;
  for (let i = 1; i < n; i++) {
    while (k > 0 && pattern[i] !== pattern[k]) k = next[k - 1];
    if (pattern[i] === pattern[k]) k++;
    next[i] = k;
  }

  // 在树上DFS匹配
  function dfs(node: TreeNode | null, j: number): boolean {
    if (node === null) return false;
    while (j > 0 && node.val !== pattern[j]) j = next[j - 1];
    if (node.val === pattern[j]) j++;
    if (j === n) return true;
    return dfs(node.left, j) || dfs(node.right, j);
  }

  return dfs(root, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 140. 二叉树中的链表 =====");

function buildList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy = new ListNode();
  let cur = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next!;
  }
  return dummy.next;
}

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

// 测试1: head=[4,2,8], tree=[1,4,4,null,2,2,null,1,null,6,8,null,null,null,null,1,3]
//        1
//       / \
//      4   4
//       \  /
//       2 2
//      / \
//     1  6
//         \
//          8
// 路径 1->4->2->6->8 包含 4->2->8 ? 不，路径应从某节点向下
// 节点4(左) -> 2 -> 8 匹配 4->2->8
const tree1 = buildTree([1, 4, 4, null, 2, 2, null, 1, null, 6, 8, null, null, null, null, 1, 3]);
const list1 = buildList([4, 2, 8]);
console.log("测试1 DFS:", isSubPath(list1, tree1)); // true
console.log("测试1 KMP:", isSubPathKMP(list1, tree1)); // true

// 测试2: head=[1,4,2,6], tree=同上
// 路径 1->4->2->6 匹配
const list2 = buildList([1, 4, 2, 6]);
console.log("测试2 DFS:", isSubPath(list2, tree1)); // true
console.log("测试2 KMP:", isSubPathKMP(list2, tree1)); // true

// 测试3: head=[1,4,2,6,7], 不匹配
const list3 = buildList([1, 4, 2, 6, 7]);
console.log("测试3 DFS:", isSubPath(list3, tree1)); // false
console.log("测试3 KMP:", isSubPathKMP(list3, tree1)); // false

export {};
