// ============================================================
// 015. 填充每个节点的下一个右侧节点指针 II
// ============================================================
// LeetCode 117. Populating Next Right Pointers in Each Node II
// 给定非完美二叉树，填充每个节点的 next 指针，指向同一层右侧节点。若无则 null。
// 时间复杂度：O(n)，空间复杂度：O(1)（方法2）

// 节点定义
class Node {
  val: number;
  left: Node | null;
  right: Node | null;
  next: Node | null;
  constructor(val?: number, left?: Node | null, right?: Node | null, next?: Node | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
    this.next = next === undefined ? null : next;
  }
}

// 辅助函数：数组转二叉树（层序，支持非完美二叉树）
function arrayToTree(arr: (number | null)[]): Node | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new Node(arr[0]);
  const queue: Node[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    // 左孩子
    if (i < arr.length && arr[i] !== null) {
      node.left = new Node(arr[i] as number);
      queue.push(node.left);
    }
    i++;
    // 右孩子
    if (i < arr.length && arr[i] !== null) {
      node.right = new Node(arr[i] as number);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// 辅助函数：按层序输出 next 指针（用于验证）
function treeToNextArray(root: Node | null): (number | null)[] {
  const result: (number | null)[] = [];
  if (root === null) return result;
  const queue: (Node | null)[] = [root];
  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      if (node !== null) {
        result.push(node.val);
        if (node.left !== null) queue.push(node.left);
        if (node.right !== null) queue.push(node.right);
      }
    }
    result.push(null);
  }
  return result;
}

// ============================================================
// 方法1：BFS 层序遍历
// ============================================================
function connectBFS(root: Node | null): Node | null {
  if (root === null) return null;
  const queue: Node[] = [root];
  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      if (i < size - 1) {
        node.next = queue[0];
      }
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
  }
  return root;
}

// ============================================================
// 方法2：利用 next 指针 + dummy 节点 O(1) 空间（推荐）
// ============================================================
function connect(root: Node | null): Node | null {
  if (root === null) return null;
  let curr: Node | null = root;
  // dummy 作为下一层的虚拟头节点
  let dummy = new Node(0);
  let tail: Node | null = dummy;

  while (curr !== null) {
    if (curr.left !== null) {
      tail.next = curr.left;
      tail = tail.next;
    }
    if (curr.right !== null) {
      tail.next = curr.right;
      tail = tail.next;
    }
    curr = curr.next;
    // 当前层遍历完，进入下一层
    if (curr === null) {
      curr = dummy.next;
      dummy = new Node(0);
      tail = dummy;
    }
  }
  return root;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 015. 填充每个节点的下一个右侧节点指针 II =====");

// 测试1: [1,2,3,4,5,null,7]
const tree1 = arrayToTree([1, 2, 3, 4, 5, null, 7]);
connect(tree1);
console.log("测试1 (方法2):", treeToNextArray(tree1));
// 预期: [1,null,2,3,null,4,5,7,null]

// 测试2: BFS 方法
const tree2 = arrayToTree([1, 2, 3, 4, 5, null, 7]);
connectBFS(tree2);
console.log("测试2 (BFS):", treeToNextArray(tree2));
// 预期: [1,null,2,3,null,4,5,7,null]

// 测试3: [1,2,null,3,null,4,null,5]
const tree3 = arrayToTree([1, 2, null, 3, null, 4, null, 5]);
connect(tree3);
console.log("测试3:", treeToNextArray(tree3));
// 预期: [1,null,2,null,3,null,4,null,5,null]

// 测试4: 空树
console.log("测试4 (空树):", treeToNextArray(null));
// 预期: []

export {};
