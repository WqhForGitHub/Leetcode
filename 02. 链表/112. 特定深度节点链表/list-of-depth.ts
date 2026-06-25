// ============================================================
// 112. 特定深度节点链表
// ============================================================
// 面试题 04.03. 特定深度节点链表 (List of Depth)
// 给定一棵二叉树，设计算法，创建某一深度上所有节点的链表
// （即所有深度为 D 的节点组成一个链表）。返回包含各层链表的数组。
// 时间复杂度：O(n)，空间复杂度：O(n)

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

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

// 辅助函数：用数组（层序）构建二叉树
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

// 辅助函数：将链表转为数组（便于打印验证）
function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let cur = head;
  while (cur) {
    result.push(cur.val);
    cur = cur.next;
  }
  return result;
}

// ============================================================
// 方法1：BFS 层序遍历
// ============================================================
// 使用队列进行广度优先搜索，每次处理一整层。
// 对于每一层，构建一个链表：用 dummy 头节点，逐个连接该层节点。
// 时间复杂度：O(n)，空间复杂度：O(n)
function listOfDepth(tree: TreeNode | null): ListNode[] {
  const result: ListNode[] = [];
  if (tree === null) return result;

  const queue: TreeNode[] = [tree];

  while (queue.length > 0) {
    const size = queue.length;
    // dummy 头节点简化链表构建
    const dummy = new ListNode();
    let tail = dummy;

    // 处理当前层的所有节点
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;

      // 将当前节点值加入链表
      tail.next = new ListNode(node.val);
      tail = tail.next;

      // 子节点入队，供下一层使用
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(dummy.next!);
  }

  return result;
}

// ============================================================
// 方法2：DFS 前序遍历（递归）
// ============================================================
// 递归遍历时传入当前深度 depth，将节点追加到对应深度的链表尾部。
// 需要额外维护每一层链表的尾指针。
// 时间复杂度：O(n)，空间复杂度：O(n)（含递归栈）
function listOfDepthDFS(tree: TreeNode | null): ListNode[] {
  const result: ListNode[] = [];
  // 尾指针数组，用于在每一层链表末尾追加节点
  const tails: ListNode[] = [];

  const dfs = (node: TreeNode | null, depth: number): void => {
    if (node === null) return;

    const listNode = new ListNode(node.val);

    if (depth >= result.length) {
      // 第一次到达该深度，创建新链表
      result.push(listNode);
      tails.push(listNode);
    } else {
      // 追加到已有链表的尾部
      tails[depth].next = listNode;
      tails[depth] = listNode;
    }

    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  };

  dfs(tree, 0);
  return result;
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  console.log("===== 112. 特定深度节点链表 测试 =====\n");

  // 测试1：普通二叉树
  //        1
  //       / \
  //      2   3
  //     / \   \
  //    4   5   6
  const tree1 = buildTree([1, 2, 3, 4, 5, null, 6]);
  console.log("测试1: 普通二叉树");
  const result1 = listOfDepth(tree1);
  result1.forEach((head, i) => {
    console.log(`  第 ${i} 层:`, listToArray(head));
  });
  console.log("  期望: [[1], [2,3], [4,5,6]]\n");

  // 方法2测试
  console.log("测试1 (DFS): 普通二叉树");
  const result1b = listOfDepthDFS(tree1);
  result1b.forEach((head, i) => {
    console.log(`  第 ${i} 层:`, listToArray(head));
  });
  console.log();

  // 测试2：单节点树
  console.log("测试2: 单节点树");
  const tree2 = buildTree([1]);
  const result2 = listOfDepth(tree2);
  result2.forEach((head, i) => {
    console.log(`  第 ${i} 层:`, listToArray(head));
  });
  console.log("  期望: [[1]]\n");

  // 测试3：满二叉树
  //        1
  //       / \
  //      2   3
  //     / \ / \
  //    4  5 6  7
  console.log("测试3: 满二叉树");
  const tree3 = buildTree([1, 2, 3, 4, 5, 6, 7]);
  const result3 = listOfDepth(tree3);
  result3.forEach((head, i) => {
    console.log(`  第 ${i} 层:`, listToArray(head));
  });
  console.log("  期望: [[1], [2,3], [4,5,6,7]]\n");

  // 测试4：空树
  console.log("测试4: 空树");
  const tree4 = buildTree([]);
  const result4 = listOfDepth(tree4);
  console.log("  结果:", result4, "(期望: [])\n");

  // 测试5：左斜树
  //    1
  //   /
  //  2
  // /
  //3
  console.log("测试5: 左斜树");
  const tree5 = buildTree([1, 2, null, 3]);
  const result5 = listOfDepth(tree5);
  result5.forEach((head, i) => {
    console.log(`  第 ${i} 层:`, listToArray(head));
  });
  console.log("  期望: [[1], [2], [3]]\n");
}

test();

export {};
