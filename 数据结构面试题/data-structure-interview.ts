// ============================================================
// 数据结构面试题 - TypeScript 解题合集
// ============================================================

// ============================================================
// 常见的数据结构有哪些？
// ============================================================
//
// 1. 线性结构
//    - 数组 (Array)：连续内存，O(1) 随机访问，O(n) 插入/删除
//    - 链表 (Linked List)：非连续内存，O(1) 插入/删除（已知位置），O(n) 查找
//    - 栈 (Stack)：后进先出 LIFO，O(1) 入栈/出栈
//    - 队列 (Queue)：先进先出 FIFO，O(1) 入队/出队
//    - 双端队列 (Deque)：两端均可入队/出队
//    - 哈希表 (Hash Table)：O(1) 平均查找/插入/删除
//
// 2. 树形结构
//    - 二叉树 (Binary Tree)：每个节点最多两个子节点
//    - 二叉搜索树 (BST)：左 < 根 < 右，平均 O(log n) 查找
//    - 平衡二叉树 (AVL)：严格平衡，查找 O(log n)
//    - 红黑树 (Red-Black Tree)：近似平衡，插入/删除更高效
//    - 堆 (Heap)：最大堆/最小堆，O(1) 取极值，O(log n) 插入/删除
//    - 字典树 (Trie)：字符串前缀匹配，O(m) 查找（m 为字符串长度）
//    - B 树 / B+ 树：多路平衡搜索树，数据库索引常用
//
// 3. 图结构
//    - 邻接矩阵：O(1) 判断边，O(n²) 空间
//    - 邻接表：O(度) 判断边，O(n+e) 空间
//
// 4. 其他
//    - 并查集 (Union-Find)：O(α(n)) 近似 O(1) 合并/查找
//    - 跳表 (Skip List)：O(log n) 查找/插入/删除，Redis 有序集合底层
//    - 布隆过滤器 (Bloom Filter)：O(k) 判断是否存在，有假阳性
//    - 位图 (Bitmap)：空间高效的集合表示
//
// ============================================================

// -------------------- 链表节点定义 --------------------
export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// -------------------- 二叉树节点定义 --------------------
export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

// ============================================================
// 1. 括号匹配
// LeetCode 20. Valid Parentheses
// ============================================================

// 方法1：栈 — 推荐
function isValidParentheses(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (const char of s) {
    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }

  return stack.length === 0;
}

// 方法2：替换法 — 每次消去最内层的括号对
function isValidParenthesesReplace(s: string): boolean {
  let prev = "";
  while (prev !== s) {
    prev = s;
    s = s.replace("()", "").replace("[]", "").replace("{}", "");
  }
  return s.length === 0;
}

// 方法3：栈 + 编号映射（更通用）
function isValidParenthesesNumber(s: string): boolean {
  const stack: number[] = [];
  const pairs: Record<string, number> = {
    "(": 1,
    ")": -1,
    "[": 2,
    "]": -2,
    "{": 3,
    "}": -3,
  };

  for (const char of s) {
    const id = pairs[char];
    if (id > 0) {
      stack.push(id);
    } else {
      if (stack.length === 0 || stack.pop() !== -id) return false;
    }
  }

  return stack.length === 0;
}

// 方法4：计数法 — 仅适用于单一括号类型
function isValidSingleParentheses(s: string): boolean {
  let count = 0;
  for (const char of s) {
    if (char === "(") count++;
    else if (char === ")") count--;
    if (count < 0) return false;
  }
  return count === 0;
}

// ============================================================
// 2. 二叉树的最大深度
// LeetCode 104. Maximum Depth of Binary Tree
// ============================================================

// 方法1：递归 DFS — 推荐
function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// 方法2：BFS 层序遍历
function maxDepthBFS(root: TreeNode | null): number {
  if (root === null) return 0;

  const queue: TreeNode[] = [root];
  let depth = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    depth++;
  }

  return depth;
}

// 方法3：迭代 DFS + 栈（记录深度）
function maxDepthDFSStack(root: TreeNode | null): number {
  if (root === null) return 0;

  const stack: [TreeNode, number][] = [[root, 1]];
  let maxDepthVal = 0;

  while (stack.length > 0) {
    const [node, depth] = stack.pop()!;
    maxDepthVal = Math.max(maxDepthVal, depth);
    if (node.left) stack.push([node.left, depth + 1]);
    if (node.right) stack.push([node.right, depth + 1]);
  }

  return maxDepthVal;
}

// ============================================================
// 3. 二叉树的最小深度
// LeetCode 111. Minimum Depth of Binary Tree
// ============================================================

// 方法1：递归 DFS — 推荐
// 注意：最小深度是到最近叶子节点的最短路径
function minDepth(root: TreeNode | null): number {
  if (root === null) return 0;

  // 叶子节点
  if (root.left === null && root.right === null) return 1;

  // 只有一棵子树时，只能走那棵子树
  if (root.left === null) return 1 + minDepth(root.right);
  if (root.right === null) return 1 + minDepth(root.left);

  // 两棵子树都有，取最小值
  return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}

// 方法2：BFS — 找到第一个叶子节点即返回，更高效
function minDepthBFS(root: TreeNode | null): number {
  if (root === null) return 0;

  const queue: TreeNode[] = [root];
  let depth = 0;

  while (queue.length > 0) {
    depth++;
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      if (node.left === null && node.right === null) return depth;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  return depth;
}

// 方法3：迭代 DFS + 栈
function minDepthDFSStack(root: TreeNode | null): number {
  if (root === null) return 0;

  const stack: [TreeNode, number][] = [[root, 1]];
  let minDepthVal = Infinity;

  while (stack.length > 0) {
    const [node, depth] = stack.pop()!;
    if (node.left === null && node.right === null) {
      minDepthVal = Math.min(minDepthVal, depth);
    }
    if (node.left) stack.push([node.left, depth + 1]);
    if (node.right) stack.push([node.right, depth + 1]);
  }

  return minDepthVal;
}

// ============================================================
// 4. 路径总和
// LeetCode 112. Path Sum
// ============================================================

// 方法1：递归 DFS — 推荐
function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  if (root === null) return false;

  // 叶子节点：检查是否等于剩余值
  if (root.left === null && root.right === null) {
    return root.val === targetSum;
  }

  const remaining = targetSum - root.val;
  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}

// 方法2：迭代 DFS + 栈
function hasPathSumDFSStack(root: TreeNode | null, targetSum: number): boolean {
  if (root === null) return false;

  const stack: [TreeNode, number][] = [[root, root.val]];

  while (stack.length > 0) {
    const [node, sum] = stack.pop()!;

    if (node.left === null && node.right === null && sum === targetSum) {
      return true;
    }

    if (node.right) stack.push([node.right, sum + node.right.val]);
    if (node.left) stack.push([node.left, sum + node.left.val]);
  }

  return false;
}

// 方法3：BFS + 队列
function hasPathSumBFS(root: TreeNode | null, targetSum: number): boolean {
  if (root === null) return false;

  const queue: [TreeNode, number][] = [[root, root.val]];

  while (queue.length > 0) {
    const [node, sum] = queue.shift()!;

    if (node.left === null && node.right === null && sum === targetSum) {
      return true;
    }

    if (node.left) queue.push([node.left, sum + node.left.val]);
    if (node.right) queue.push([node.right, sum + node.right.val]);
  }

  return false;
}

// 方法4：回溯法
function hasPathSumBacktrack(
  root: TreeNode | null,
  targetSum: number,
): boolean {
  const backtrack = (node: TreeNode | null, currentSum: number): boolean => {
    if (node === null) return false;
    currentSum += node.val;

    if (node.left === null && node.right === null) {
      return currentSum === targetSum;
    }

    if (backtrack(node.left, currentSum)) return true;
    if (backtrack(node.right, currentSum)) return true;

    return false;
  };

  return backtrack(root, 0);
}

// 变体：LeetCode 113. Path Sum II — 返回所有路径
function pathSumII(root: TreeNode | null, targetSum: number): number[][] {
  const result: number[][] = [];

  const backtrack = (
    node: TreeNode | null,
    remaining: number,
    path: number[],
  ) => {
    if (node === null) return;
    path.push(node.val);

    if (node.left === null && node.right === null && remaining === node.val) {
      result.push([...path]);
    }

    backtrack(node.left, remaining - node.val, path);
    backtrack(node.right, remaining - node.val, path);
    path.pop(); // 回溯
  };

  backtrack(root, targetSum, []);
  return result;
}

// ============================================================
// 5. 对称二叉树
// LeetCode 101. Symmetric Tree
// ============================================================

// 方法1：递归 — 推荐
function isSymmetric(root: TreeNode | null): boolean {
  if (root === null) return true;

  const isMirror = (left: TreeNode | null, right: TreeNode | null): boolean => {
    if (left === null && right === null) return true;
    if (left === null || right === null) return false;
    return (
      left.val === right.val &&
      isMirror(left.left, right.right) &&
      isMirror(left.right, right.left)
    );
  };

  return isMirror(root.left, root.right);
}

// 方法2：迭代 — 队列（BFS 变体）
function isSymmetricIterative(root: TreeNode | null): boolean {
  if (root === null) return true;

  const queue: (TreeNode | null)[] = [root.left, root.right];

  while (queue.length > 0) {
    const left = queue.shift()!;
    const right = queue.shift()!;

    if (left === null && right === null) continue;
    if (left === null || right === null) return false;
    if (left.val !== right.val) return false;

    queue.push(left.left, right.right); // 外侧配对
    queue.push(left.right, right.left); // 内侧配对
  }

  return true;
}

// 方法3：迭代 — 栈
function isSymmetricStack(root: TreeNode | null): boolean {
  if (root === null) return true;

  const stack: (TreeNode | null)[] = [root.left, root.right];

  while (stack.length > 0) {
    const right = stack.pop()!;
    const left = stack.pop()!;

    if (left === null && right === null) continue;
    if (left === null || right === null) return false;
    if (left.val !== right.val) return false;

    stack.push(left.left, right.right);
    stack.push(left.right, right.left);
  }

  return true;
}

// ============================================================
// 6. 二叉树的中序遍历
// LeetCode 94. Binary Tree Inorder Traversal
// ============================================================

// 方法1：递归 — 推荐
function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];

  const inorder = (node: TreeNode | null) => {
    if (node === null) return;
    inorder(node.left); // 左
    result.push(node.val); // 根
    inorder(node.right); // 右
  };

  inorder(root);
  return result;
}

// 方法2：迭代 + 栈
function inorderTraversalIterative(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  let current: TreeNode | null = root;

  while (current || stack.length > 0) {
    // 一路向左走到底
    while (current) {
      stack.push(current);
      current = current.left;
    }
    // 弹出并访问
    current = stack.pop()!;
    result.push(current.val);
    // 转向右子树
    current = current.right;
  }

  return result;
}

// 方法3：Morris 遍历 — O(1) 空间，不需要栈
function inorderTraversalMorris(root: TreeNode | null): number[] {
  const result: number[] = [];
  let current: TreeNode | null = root;

  while (current) {
    if (current.left === null) {
      result.push(current.val);
      current = current.right;
    } else {
      // 找到左子树中最右边的节点（前驱节点）
      let predecessor = current.left;
      while (predecessor.right && predecessor.right !== current) {
        predecessor = predecessor.right;
      }

      if (predecessor.right === null) {
        // 建立线索：前驱的右指针指向当前节点
        predecessor.right = current;
        current = current.left;
      } else {
        // 线索已存在，说明左子树已遍历完
        predecessor.right = null;
        result.push(current.val);
        current = current.right;
      }
    }
  }

  return result;
}

// 方法4：统一迭代法 — 用 visited 标记
function inorderTraversalUnified(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: { node: TreeNode; visited: boolean }[] = [];

  if (root) stack.push({ node: root, visited: false });

  while (stack.length > 0) {
    const item = stack.pop()!;

    if (item.visited) {
      result.push(item.node.val);
    } else {
      // 中序：右 → 根(标记已访问) → 左
      if (item.node.right)
        stack.push({ node: item.node.right, visited: false });
      stack.push({ node: item.node, visited: true });
      if (item.node.left) stack.push({ node: item.node.left, visited: false });
    }
  }

  return result;
}

// ============================================================
// 7. 二叉树的前序遍历
// LeetCode 144. Binary Tree Preorder Traversal
// ============================================================

// 方法1：递归 — 推荐
function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];

  const preorder = (node: TreeNode | null) => {
    if (node === null) return;
    result.push(node.val); // 根
    preorder(node.left); // 左
    preorder(node.right); // 右
  };

  preorder(root);
  return result;
}

// 方法2：迭代 + 栈
function preorderTraversalIterative(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (root === null) return result;

  const stack: TreeNode[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node.val); // 根
    if (node.right) stack.push(node.right); // 右先入栈（后出）
    if (node.left) stack.push(node.left); // 左后入栈（先出）
  }

  return result;
}

// 方法3：Morris 遍历 — O(1) 空间
function preorderTraversalMorris(root: TreeNode | null): number[] {
  const result: number[] = [];
  let current: TreeNode | null = root;

  while (current) {
    if (current.left === null) {
      result.push(current.val); // 没有左子树，直接访问
      current = current.right;
    } else {
      // 找到左子树中最右边的节点（前驱节点）
      let predecessor: TreeNode | null = current.left;
      while (predecessor.right && predecessor.right !== current) {
        predecessor = predecessor.right;
      }

      if (predecessor.right === null) {
        result.push(current.val); // 建立线索前访问当前节点（前序特点）
        predecessor.right = current; // 建立线索
        current = current.left;
      } else {
        predecessor.right = null; // 断开线索
        current = current.right;
      }
    }
  }

  return result;
}

// ============================================================
// 8. 二叉树的后序遍历
// LeetCode 145. Binary Tree Postorder Traversal
// ============================================================

// 方法1：递归 — 推荐
function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];

  const postorder = (node: TreeNode | null) => {
    if (node === null) return;
    postorder(node.left); // 左
    postorder(node.right); // 右
    result.push(node.val); // 根
  };

  postorder(root);
  return result;
}

// 方法2：迭代 + 栈（前序反转法）
// 前序：根→左→右，交换左右顺序：根→右→左，再反转：左→右→根 = 后序
function postorderTraversalReverse(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (root === null) return result;

  const stack: TreeNode[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node.val); // 根
    if (node.left) stack.push(node.left); // 左先入栈（后出）
    if (node.right) stack.push(node.right); // 右后入栈（先出）
  }

  return result.reverse(); // 反转得到后序
}

// 方法3：迭代 + 栈（经典后序）
function postorderTraversalIterative(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (root === null) return result;

  const stack: TreeNode[] = [];
  let current: TreeNode | null = root;
  let lastVisited: TreeNode | null = null;

  while (current || stack.length > 0) {
    if (current) {
      stack.push(current);
      current = current.left; // 一路向左
    } else {
      const peekNode = stack[stack.length - 1];
      // 如果右子树存在且未被访问，转向右子树
      if (peekNode.right && peekNode.right !== lastVisited) {
        current = peekNode.right;
      } else {
        result.push(peekNode.val); // 访问根节点
        lastVisited = stack.pop()!;
      }
    }
  }

  return result;
}

// ============================================================
// 9. 翻转二叉树
// LeetCode 226. Invert Binary Tree
// ============================================================

// 方法1：递归 — 推荐
function invertTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;

  // 交换左右子树
  [root.left, root.right] = [root.right, root.left];
  // 递归翻转
  invertTree(root.left);
  invertTree(root.right);

  return root;
}

// 方法2：递归（先翻转再交换）
function invertTreeRecursive(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;

  const left = invertTreeRecursive(root.left);
  const right = invertTreeRecursive(root.right);

  root.left = right;
  root.right = left;

  return root;
}

// 方法3：迭代 BFS — 层序遍历逐层翻转
function invertTreeBFS(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;

  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;
    [node.left, node.right] = [node.right, node.left]; // 交换

    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return root;
}

// 方法4：迭代 DFS — 栈
function invertTreeDFS(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;

  const stack: TreeNode[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;
    [node.left, node.right] = [node.right, node.left]; // 交换

    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }

  return root;
}

// ============================================================
// 10. 二叉树的所有路径
// LeetCode 257. Binary Tree Paths
// ============================================================

// 方法1：递归 DFS — 推荐
function binaryTreePaths(root: TreeNode | null): string[] {
  const result: string[] = [];

  const dfs = (node: TreeNode | null, path: string) => {
    if (node === null) return;

    const currentPath = path === "" ? `${node.val}` : `${path}->${node.val}`;

    // 叶子节点：记录路径
    if (node.left === null && node.right === null) {
      result.push(currentPath);
      return;
    }

    dfs(node.left, currentPath);
    dfs(node.right, currentPath);
  };

  dfs(root, "");
  return result;
}

// 方法2：递归 + 回溯
function binaryTreePathsBacktrack(root: TreeNode | null): string[] {
  const result: string[] = [];
  const path: number[] = [];

  const backtrack = (node: TreeNode | null) => {
    if (node === null) return;

    path.push(node.val);

    if (node.left === null && node.right === null) {
      result.push(path.join("->"));
    } else {
      backtrack(node.left);
      backtrack(node.right);
    }

    path.pop(); // 回溯
  };

  backtrack(root);
  return result;
}

// 方法3：迭代 DFS + 栈（保存路径）
function binaryTreePathsIterative(root: TreeNode | null): string[] {
  const result: string[] = [];
  if (root === null) return result;

  const stack: [TreeNode, string][] = [[root, `${root.val}`]];

  while (stack.length > 0) {
    const [node, path] = stack.pop()!;

    if (node.left === null && node.right === null) {
      result.push(path);
    }

    if (node.right) stack.push([node.right, `${path}->${node.right.val}`]);
    if (node.left) stack.push([node.left, `${path}->${node.left.val}`]);
  }

  return result;
}

// 方法4：BFS + 队列
function binaryTreePathsBFS(root: TreeNode | null): string[] {
  const result: string[] = [];
  if (root === null) return result;

  const queue: [TreeNode, string][] = [[root, `${root.val}`]];

  while (queue.length > 0) {
    const [node, path] = queue.shift()!;

    if (node.left === null && node.right === null) {
      result.push(path);
    }

    if (node.left) queue.push([node.left, `${path}->${node.left.val}`]);
    if (node.right) queue.push([node.right, `${path}->${node.right.val}`]);
  }

  return result;
}

// ============================================================
// 11. 删除链表中重复的元素（排序链表）
// LeetCode 83. Remove Duplicates from Sorted List
// ============================================================

// 方法1：迭代法（推荐）
function deleteDuplicates(head: ListNode | null): ListNode | null {
  let current = head;
  while (current && current.next) {
    if (current.val === current.next.val) {
      current.next = current.next.next; // 跳过重复节点
    } else {
      current = current.next;
    }
  }
  return head;
}

// 方法2：递归法
function deleteDuplicatesRecursive(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  head.next = deleteDuplicatesRecursive(head.next);
  return head.val === head.next!.val ? head.next : head;
}

// 方法3：Set 去重（适用于非排序链表）
function deleteDuplicatesBySet(head: ListNode | null): ListNode | null {
  if (!head) return null;

  const seen = new Set<number>();
  const dummy = new ListNode(0, head);
  let prev: ListNode = dummy;
  let current: ListNode | null = head;

  while (current) {
    if (seen.has(current.val)) {
      prev.next = current.next; // 跳过重复
    } else {
      seen.add(current.val);
      prev = current;
    }
    current = current.next;
  }

  return dummy.next;
}

// ============================================================
// 12. 找到链表中的倒数第 k 个节点
// 面试题 02.02 / 剑指 Offer 22
// ============================================================

// 方法1：快慢指针（推荐）
// 快指针先走 k 步，然后快慢指针同步走，快指针到末尾时慢指针即为倒数第 k 个
function getKthFromEnd(head: ListNode | null, k: number): ListNode | null {
  let fast: ListNode | null = head;
  let slow: ListNode | null = head;

  // 快指针先走 k 步
  for (let i = 0; i < k; i++) {
    if (!fast) return null; // k 大于链表长度
    fast = fast.next;
  }

  // 同步移动
  while (fast) {
    fast = fast.next;
    slow = slow!.next;
  }

  return slow;
}

// 方法2：先求长度再遍历
function getKthFromEndByLength(
  head: ListNode | null,
  k: number,
): ListNode | null {
  let len = 0;
  let current = head;
  while (current) {
    len++;
    current = current.next;
  }

  if (k > len) return null;

  current = head;
  for (let i = 0; i < len - k; i++) {
    current = current!.next;
  }
  return current;
}

// 方法3：栈方法
function getKthFromEndByStack(
  head: ListNode | null,
  k: number,
): ListNode | null {
  const stack: ListNode[] = [];
  let current = head;
  while (current) {
    stack.push(current);
    current = current.next;
  }
  if (k > stack.length || k <= 0) return null;
  return stack[stack.length - k];
}

// ============================================================
// 13. 判断链表中是否有环
// LeetCode 141. Linked List Cycle
// ============================================================

// 方法1：快慢指针（推荐）- O(1) 空间
function hasCycle(head: ListNode | null): boolean {
  if (!head || !head.next) return false;

  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }

  return false;
}

// 方法2：哈希集合 - O(n) 空间
function hasCycleHashSet(head: ListNode | null): boolean {
  const visited = new Set<ListNode>();
  let current = head;

  while (current) {
    if (visited.has(current)) return true;
    visited.add(current);
    current = current.next;
  }

  return false;
}

// 方法3：标记法（修改节点值，不推荐但面试可提）
function hasCycleMark(head: ListNode | null): boolean {
  let current = head;
  while (current) {
    if (current.val === Infinity) return true; // 用特殊值标记已访问
    current.val = Infinity;
    current = current.next;
  }
  return false;
}

// 变体：LeetCode 142. 环形链表 II — 返回环的入口节点
function detectCycle(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return null;

  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  // 第一次相遇
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) break;
  }

  if (!fast || !fast.next) return null; // 无环

  // 从头和相遇点同时出发，再次相遇即为环入口
  let ptr: ListNode | null = head;
  while (ptr !== slow) {
    ptr = ptr!.next;
    slow = slow!.next;
  }

  return ptr;
}

// ============================================================
// 14. 合并两个有序链表
// LeetCode 21. Merge Two Sorted Lists
// ============================================================

// 方法1：迭代法（推荐）
function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null,
): ListNode | null {
  const dummy = new ListNode(-1);
  let current = dummy;

  while (list1 && list2) {
    if (list1.val <= list2.val) {
      current.next = list1;
      list1 = list1.next;
    } else {
      current.next = list2;
      list2 = list2.next;
    }
    current = current.next;
  }

  current.next = list1 || list2;
  return dummy.next;
}

// 方法2：递归法
function mergeTwoListsRecursive(
  list1: ListNode | null,
  list2: ListNode | null,
): ListNode | null {
  if (!list1) return list2;
  if (!list2) return list1;

  if (list1.val <= list2.val) {
    list1.next = mergeTwoListsRecursive(list1.next, list2);
    return list1;
  } else {
    list2.next = mergeTwoListsRecursive(list1, list2.next);
    return list2;
  }
}

// ============================================================
// 15. 反转链表
// LeetCode 206. Reverse Linked List
// ============================================================

// 方法1：迭代法（推荐）
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;

  while (curr) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }

  return prev;
}

// 方法2：递归法
function reverseListRecursive(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}

// 方法3：栈方法
function reverseListStack(head: ListNode | null): ListNode | null {
  if (!head) return null;

  const stack: ListNode[] = [];
  let curr: ListNode | null = head;
  while (curr) {
    stack.push(curr);
    curr = curr.next;
  }

  const newHead = stack.pop()!;
  let node = newHead;
  while (stack.length) {
    node.next = stack.pop()!;
    node = node.next;
  }
  node.next = null;
  return newHead;
}

// ============================================================
// 16. 寻找链表的中间节点
// LeetCode 876. Middle of the Linked List
// ============================================================

// 方法1：快慢指针（推荐）
function middleNode(head: ListNode | null): ListNode | null {
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }

  return slow;
}

// 方法2：先求长度再遍历
function middleNodeByLength(head: ListNode | null): ListNode | null {
  let len = 0;
  let current = head;
  while (current) {
    len++;
    current = current.next;
  }

  const mid = Math.floor(len / 2);
  current = head;
  for (let i = 0; i < mid; i++) {
    current = current!.next;
  }
  return current;
}

// 方法3：数组存储
function middleNodeByArray(head: ListNode | null): ListNode | null {
  const nodes: ListNode[] = [];
  let current = head;
  while (current) {
    nodes.push(current);
    current = current.next;
  }
  return nodes[Math.floor(nodes.length / 2)];
}

// ============================================================
// 17. 删除链表中的节点
// LeetCode 237. Delete Node in a Linked List
// ============================================================

// 方法1：值覆盖法（题目给定只能访问被删节点）
function deleteNode(node: ListNode | null): void {
  if (!node || !node.next) return;
  node.val = node.next.val; // 将下一个节点的值复制过来
  node.next = node.next.next; // 跳过下一个节点
}

// 方法2：已知头节点 + 目标值删除
function deleteNodeByValue(
  head: ListNode | null,
  val: number,
): ListNode | null {
  const dummy = new ListNode(0, head);
  let current: ListNode | null = dummy;

  while (current.next) {
    if (current.next.val === val) {
      current.next = current.next.next;
    } else {
      current = current.next;
    }
  }

  return dummy.next;
}

// 方法3：已知头节点 + 删除倒数第 n 个节点
// LeetCode 19. Remove Nth Node From End of List
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let fast: ListNode | null = dummy;
  let slow: ListNode | null = dummy;

  // 快指针先走 n+1 步
  for (let i = 0; i <= n; i++) {
    fast = fast!.next;
  }

  // 同步移动
  while (fast) {
    fast = fast.next;
    slow = slow!.next;
  }

  // 删除节点
  slow!.next = slow!.next!.next;
  return dummy.next;
}

// ============================================================
// 测试
// ============================================================

// --- 链表辅助函数 ---
function createList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy = new ListNode(0);
  let current = dummy;
  for (const val of arr) {
    current.next = new ListNode(val);
    current = current.next;
  }
  return dummy.next;
}

function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;
  while (current) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

// --- 二叉树辅助函数 ---
function createTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const queue: TreeNode[] = [root];
  let i = 1;

  while (i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]!);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]!);
      queue.push(node.right);
    }
    i++;
  }

  return root;
}

// --- 测试用例 ---
console.log("===== 1. 括号匹配 =====");
console.log(isValidParentheses("()[]{}")); // true
console.log(isValidParentheses("([)]")); // false
console.log(isValidParenthesesReplace("{[]}")); // true
console.log(isValidSingleParentheses("(()())")); // true

console.log("\n===== 2. 二叉树的最大深度 =====");
const tree2 = createTree([3, 9, 20, null, null, 15, 7]);
console.log(maxDepth(tree2)); // 3
console.log(maxDepthBFS(tree2)); // 3
console.log(maxDepthDFSStack(tree2)); // 3

console.log("\n===== 3. 二叉树的最小深度 =====");
const tree3 = createTree([3, 9, 20, null, null, 15, 7]);
console.log(minDepth(tree3)); // 2
console.log(minDepthBFS(tree3)); // 2

console.log("\n===== 4. 路径总和 =====");
const tree4 = createTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]);
console.log(hasPathSum(tree4, 22)); // true
console.log(hasPathSumDFSStack(tree4, 22)); // true
console.log(hasPathSumBFS(tree4, 22)); // true

console.log("\n===== 5. 对称二叉树 =====");
const tree5 = createTree([1, 2, 2, 3, 4, 4, 3]);
console.log(isSymmetric(tree5)); // true
console.log(isSymmetricIterative(tree5)); // true
const tree5b = createTree([1, 2, 2, null, 3, null, 3]);
console.log(isSymmetric(tree5b)); // false

console.log("\n===== 6. 二叉树的中序遍历 =====");
const tree6 = createTree([1, null, 2, 3]);
console.log(inorderTraversal(tree6)); // [1, 3, 2]
console.log(inorderTraversalIterative(tree6)); // [1, 3, 2]
console.log(inorderTraversalMorris(tree6)); // [1, 3, 2]

console.log("\n===== 7. 二叉树的前序遍历 =====");
const tree7 = createTree([1, null, 2, 3]);
console.log(preorderTraversal(tree7)); // [1, 2, 3]
console.log(preorderTraversalIterative(tree7)); // [1, 2, 3]
console.log(preorderTraversalMorris(tree7)); // [1, 2, 3]

console.log("\n===== 8. 二叉树的后序遍历 =====");
const tree8 = createTree([1, null, 2, 3]);
console.log(postorderTraversal(tree8)); // [3, 2, 1]
console.log(postorderTraversalReverse(tree8)); // [3, 2, 1]
console.log(postorderTraversalIterative(tree8)); // [3, 2, 1]

console.log("\n===== 9. 翻转二叉树 =====");
const tree9 = createTree([4, 2, 7, 1, 3, 6, 9]);
const inverted = invertTree(tree9);
console.log(preorderTraversal(inverted)); // [4, 7, 9, 6, 2, 3, 1]
const tree9b = createTree([4, 2, 7, 1, 3, 6, 9]);
console.log(preorderTraversal(invertTreeBFS(tree9b))); // [4, 7, 9, 6, 2, 3, 1]

console.log("\n===== 10. 二叉树的所有路径 =====");
const tree10 = createTree([1, 2, 3, null, 5]);
console.log(binaryTreePaths(tree10)); // ["1->2->5", "1->3"]
console.log(binaryTreePathsBacktrack(tree10)); // ["1->2->5", "1->3"]

console.log("\n===== 11. 删除链表中重复的元素 =====");
console.log(listToArray(deleteDuplicates(createList([1, 1, 2, 3, 3])))); // [1, 2, 3]
console.log(listToArray(deleteDuplicatesRecursive(createList([1, 1, 2])))); // [1, 2]

console.log("\n===== 12. 倒数第 k 个节点 =====");
console.log(getKthFromEnd(createList([1, 2, 3, 4, 5]), 2)?.val); // 4
console.log(getKthFromEndByLength(createList([1, 2, 3, 4, 5]), 1)?.val); // 5

console.log("\n===== 13. 判断链表是否有环 =====");
const cycleNode = new ListNode(2);
const cycleHead = new ListNode(3, cycleNode);
cycleNode.next = new ListNode(0, new ListNode(-4, cycleNode));
console.log(hasCycle(cycleHead)); // true
console.log(hasCycleHashSet(createList([1, 2, 3, 4]))); // false

console.log("\n===== 14. 合并两个有序链表 =====");
console.log(
  listToArray(mergeTwoLists(createList([1, 2, 4]), createList([1, 3, 4]))),
); // [1, 1, 2, 3, 4, 4]

console.log("\n===== 15. 反转链表 =====");
console.log(listToArray(reverseList(createList([1, 2, 3, 4, 5])))); // [5, 4, 3, 2, 1]
console.log(listToArray(reverseListRecursive(createList([1, 2])))); // [2, 1]

console.log("\n===== 16. 寻找链表的中间节点 =====");
console.log(middleNode(createList([1, 2, 3, 4, 5]))?.val); // 3
console.log(middleNode(createList([1, 2, 3, 4, 5, 6]))?.val); // 4

console.log("\n===== 17. 删除链表中的节点 =====");
const node17 = createList([4, 5, 1, 9]);
const toDelete = node17?.next!; // 节点 5
deleteNode(toDelete);
console.log(listToArray(node17)); // [4, 1, 9]
console.log(listToArray(deleteNodeByValue(createList([4, 5, 1, 9]), 5))); // [4, 1, 9]

export {};
