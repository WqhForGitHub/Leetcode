// ============================================================
// 014. 填充每个节点的下一个右侧节点指针
// ============================================================
// LeetCode 116. Populating Next Right Pointers in Each Node
// 给定完美二叉树，填充每个节点的 next 指针，指向同一层右侧节点。若无则 null。
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

// 辅助函数：数组转完美二叉树（层序）
function arrayToPerfectTree(arr: (number | null)[]): Node | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new Node(arr[0]);
  const queue: (Node | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new Node(arr[i] as number);
      queue.push(node.left);
    }
    i++;
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
  // 用 next 指针层序遍历
  let leftmost: Node | null = root;
  while (leftmost !== null) {
    let curr: Node | null = leftmost;
    while (curr !== null) {
      result.push(curr.val);
      curr = curr.next;
    }
    result.push(null); // 层结束标记
    leftmost = leftmost.left;
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
// 方法2：利用已建立的 next 指针 O(1) 空间（推荐）
// ============================================================
function connect(root: Node | null): Node | null {
  if (root === null) return null;
  // leftmost 始终指向每层最左节点
  let leftmost: Node | null = root;
  while (leftmost.left !== null) {
    let curr: Node | null = leftmost;
    while (curr !== null) {
      // 连接左孩子的 next 到右孩子（完美二叉树，left/right 非空）
      curr.left!.next = curr.right;
      // 连接右孩子的 next 到 curr.next 的左孩子
      if (curr.next !== null) {
        curr.right!.next = curr.next.left;
      }
      curr = curr.next;
    }
    leftmost = leftmost.left;
  }
  return root;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 014. 填充每个节点的下一个右侧节点指针 =====");

// 测试1: 完美二叉树 [1,2,3,4,5,6,7]
const tree1 = arrayToPerfectTree([1, 2, 3, 4, 5, 6, 7]);
connect(tree1);
console.log("测试1 (方法2):", treeToNextArray(tree1));
// 预期: [1,null,2,3,null,4,5,6,7,null]

// 测试2: BFS 方法
const tree2 = arrayToPerfectTree([1, 2, 3, 4, 5, 6, 7]);
connectBFS(tree2);
console.log("测试2 (BFS):", treeToNextArray(tree2));
// 预期: [1,null,2,3,null,4,5,6,7,null]

// 测试3: 单节点
const tree3 = arrayToPerfectTree([1]);
connect(tree3);
console.log("测试3 (单节点):", treeToNextArray(tree3));
// 预期: [1,null]

export {};
