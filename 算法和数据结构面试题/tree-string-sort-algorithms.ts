// ============================================================
// 二叉树遍历 & 字符串 & 排序稳定性 - TypeScript 解题合集
// ============================================================

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
// 1. 二叉树的前序遍历
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

// 方法4：统一迭代法 — 用 visited 标记
function preorderTraversalUnified(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: { node: TreeNode; visited: boolean }[] = [];

  if (root) stack.push({ node: root, visited: false });

  while (stack.length > 0) {
    const item = stack.pop()!;

    if (item.visited) {
      result.push(item.node.val);
    } else {
      // 前序：右 → 左 → 根(标记已访问)
      if (item.node.right)
        stack.push({ node: item.node.right, visited: false });
      if (item.node.left) stack.push({ node: item.node.left, visited: false });
      stack.push({ node: item.node, visited: true });
    }
  }

  return result;
}

// ============================================================
// 2. 二叉树的后序遍历
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

// 方法4：Morris 遍历 — O(1) 空间
// 后序 Morris 较复杂：逆序访问左子树右边界
function postorderTraversalMorris(root: TreeNode | null): number[] {
  const result: number[] = [];
  const dummy = new TreeNode(0, root, null); // 哨兵节点
  let current: TreeNode | null = dummy;

  const reverseEdges = (from: TreeNode | null): TreeNode | null => {
    let prev: TreeNode | null = null;
    let curr: TreeNode | null = from;
    while (curr) {
      const next = curr.right;
      curr.right = prev;
      prev = curr;
      curr = next;
    }
    return prev;
  };

  const visitEdge = (node: TreeNode | null) => {
    const tail = reverseEdges(node);
    let curr = tail;
    while (curr) {
      result.push(curr.val);
      curr = curr.right;
    }
    reverseEdges(tail); // 恢复
  };

  while (current) {
    if (current.left === null) {
      current = current.right;
    } else {
      let predecessor: TreeNode | null = current.left;
      while (predecessor.right && predecessor.right !== current) {
        predecessor = predecessor.right;
      }

      if (predecessor.right === null) {
        predecessor.right = current;
        current = current.left;
      } else {
        predecessor.right = null;
        visitEdge(current.left); // 访问左子树右边界
        current = current.right;
      }
    }
  }

  return result;
}

// ============================================================
// 3. 翻转二叉树
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
// 4. 二叉树的所有路径
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
// 5. 二叉树的中序遍历
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

// 方法3：Morris 遍历 — O(1) 空间
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
        predecessor.right = current; // 建立线索
        current = current.left;
      } else {
        predecessor.right = null; // 断开线索
        result.push(current.val); // 左子树遍历完，访问当前节点
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
// 6. 字符串中的第一个唯一字符
// LeetCode 387. First Unique Character in a String
// ============================================================

// 方法1：哈希表计数 — 推荐 O(n) O(1)（字符集有限）
function firstUniqChar(s: string): number {
  const freq = new Map<string, number>();

  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  for (let i = 0; i < s.length; i++) {
    if (freq.get(s[i]) === 1) return i;
  }

  return -1;
}

// 方法2：数组计数（仅小写字母）— 更快
function firstUniqCharArray(s: string): number {
  const count = new Array(26).fill(0);

  for (const char of s) {
    count[char.charCodeAt(0) - 97]++;
  }

  for (let i = 0; i < s.length; i++) {
    if (count[s.charCodeAt(i) - 97] === 1) return i;
  }

  return -1;
}

// 方法3：indexOf + lastIndexOf — 一次遍历
function firstUniqCharIndexOf(s: string): number {
  for (let i = 0; i < s.length; i++) {
    if (s.indexOf(s[i]) === s.lastIndexOf(s[i])) return i;
  }
  return -1;
}

// 方法4：队列 — 延迟删除
function firstUniqCharQueue(s: string): number {
  const freq = new Map<string, number>();
  const queue: [number, string][] = []; // [索引, 字符]

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    freq.set(char, (freq.get(char) || 0) + 1);
    queue.push([i, char]);

    // 清除队头重复字符
    while (queue.length > 0 && freq.get(queue[0][1])! > 1) {
      queue.shift();
    }
  }

  return queue.length > 0 ? queue[0][0] : -1;
}

// 方法5：两次遍历 + Set
function firstUniqCharSet(s: string): number {
  const seen = new Set<string>();
  const unique = new Map<string, number>(); // 字符 → 索引

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (seen.has(char)) {
      unique.delete(char); // 出现多次，从唯一集合中移除
    } else {
      seen.add(char);
      unique.set(char, i);
    }
  }

  // 返回最早出现的唯一字符索引
  let minIdx = -1;
  for (const idx of unique.values()) {
    if (minIdx === -1 || idx < minIdx) minIdx = idx;
  }
  return minIdx;
}

// ============================================================
// 7. 字符串中的单词数
// LeetCode 434. Number of Segments in a String
// ============================================================

// 方法1：状态机 — 推荐 O(n) O(1)
function countSegments(s: string): number {
  let count = 0;
  let inWord = false;

  for (const char of s) {
    if (char !== " ") {
      if (!inWord) {
        count++;
        inWord = true;
      }
    } else {
      inWord = false;
    }
  }

  return count;
}

// 方法2：split + filter
function countSegmentsSplit(s: string): number {
  return s.split(" ").filter((segment) => segment !== "").length;
}

// 方法3：正则表达式
function countSegmentsRegex(s: string): number {
  return (s.match(/\S+/g) || []).length;
}

// 方法4：统计单词起始位置 — 空格后非空格即为单词起始
function countSegmentsStart(s: string): number {
  let count = 0;

  for (let i = 0; i < s.length; i++) {
    // 当前字符非空格，且前面是空格或开头
    if (s[i] !== " " && (i === 0 || s[i - 1] === " ")) {
      count++;
    }
  }

  return count;
}

// 方法5：trim + split
function countSegmentsTrim(s: string): number {
  const trimmed = s.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
}

// ============================================================
// 8. 反转单词顺序
// LeetCode 151. Reverse Words in a String
// ============================================================

// 方法1：split + reverse + join — 推荐（简洁）
function reverseWords(s: string): string {
  return s.trim().split(/\s+/).reverse().join(" ");
}

// 方法2：双端队列 — 从右向左扫描单词
function reverseWordsDeque(s: string): string {
  const words: string[] = [];
  let left = 0;
  let right = s.length - 1;

  // 去掉首尾空格
  while (left <= right && s[left] === " ") left++;
  while (left <= right && s[right] === " ") right--;

  let wordStart = left;
  while (left <= right) {
    if (s[left] === " ") {
      words.unshift(s.slice(wordStart, left)); // 从头部插入
      while (left <= right && s[left] === " ") left++; // 跳过空格
      wordStart = left;
    }
    left++;
  }
  words.unshift(s.slice(wordStart, right + 1)); // 最后一个单词

  return words.join(" ");
}

// 方法3：原地反转（模拟 C 语言风格，JS 中用数组模拟）
function reverseWordsInPlace(s: string): string {
  const chars = [...s.trim()];

  // 反转整个字符串
  const reverseRange = (arr: string[], l: number, r: number) => {
    while (l < r) {
      [arr[l], arr[r]] = [arr[r], arr[l]];
      l++;
      r--;
    }
  };

  // 清除多余空格
  let write = 0;
  let spaceBefore = false;
  for (let read = 0; read < chars.length; read++) {
    if (chars[read] !== " ") {
      chars[write++] = chars[read];
      spaceBefore = false;
    } else if (!spaceBefore) {
      chars[write++] = " ";
      spaceBefore = true;
    }
  }
  const len = spaceBefore ? write - 1 : write; // 去掉末尾可能的多余空格

  // 第一步：反转整个字符串
  reverseRange(chars, 0, len - 1);

  // 第二步：逐个反转每个单词
  let start = 0;
  for (let i = 0; i <= len; i++) {
    if (i === len || chars[i] === " ") {
      reverseRange(chars, start, i - 1);
      start = i + 1;
    }
  }

  return chars.slice(0, len).join("");
}

// 方法4：正则匹配单词
function reverseWordsRegex(s: string): string {
  const words = s.match(/\S+/g) || [];
  return words.reverse().join(" ");
}

// 方法5：reduce 逐词构建
function reverseWordsReduce(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .reduceRight((acc, word) => (acc ? `${acc} ${word}` : word), "");
}

// ============================================================
// 9. 判断回文串
// LeetCode 125. Valid Palindrome
// ============================================================

// 方法1：双指针 — 推荐
function isPalindrome(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let left = 0,
    right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }

  return true;
}

// 方法2：原地双指针（不创建新字符串）— O(1) 额外空间
function isPalindromeInPlace(s: string): boolean {
  const isAlphaNum = (c: string) => /[a-zA-Z0-9]/.test(c);
  let left = 0,
    right = s.length - 1;

  while (left < right) {
    while (left < right && !isAlphaNum(s[left])) left++;
    while (left < right && !isAlphaNum(s[right])) right--;

    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }

  return true;
}

// 方法3：反转字符串比较
function isPalindromeReverse(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
}

// 方法4：递归
function isPalindromeRecursive(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");

  const check = (left: number, right: number): boolean => {
    if (left >= right) return true;
    if (cleaned[left] !== cleaned[right]) return false;
    return check(left + 1, right - 1);
  };

  return check(0, cleaned.length - 1);
}

// 方法5：栈 — 前半入栈，后半比较
function isPalindromeStack(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const stack: string[] = [];
  const mid = Math.floor(cleaned.length / 2);

  for (let i = 0; i < mid; i++) {
    stack.push(cleaned[i]);
  }

  const start = cleaned.length % 2 === 0 ? mid : mid + 1;
  for (let i = start; i < cleaned.length; i++) {
    if (stack.pop() !== cleaned[i]) return false;
  }

  return true;
}

// ============================================================
// 10. 反转字符串
// LeetCode 344. Reverse String
// ============================================================

// 方法1：双指针原地交换 — 推荐 O(n) O(1)
function reverseString(s: string[]): void {
  let left = 0,
    right = s.length - 1;

  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
}

// 方法2：递归
function reverseStringRecursive(
  s: string[],
  left = 0,
  right = s.length - 1,
): void {
  if (left >= right) return;
  [s[left], s[right]] = [s[right], s[left]];
  reverseStringRecursive(s, left + 1, right - 1);
}

// 方法3：栈 — O(n) 额外空间
function reverseStringStack(s: string[]): string[] {
  const stack: string[] = [...s];
  const result: string[] = [];
  while (stack.length > 0) {
    result.push(stack.pop()!);
  }
  return result;
}

// 方法4：异或交换（原地，不需要临时变量）
function reverseStringXor(s: string[]): void {
  let left = 0,
    right = s.length - 1;

  while (left < right) {
    // 异或交换需要数字，字符串用 charCode 转换
    let a = s[left].charCodeAt(0);
    let b = s[right].charCodeAt(0);
    a = a ^ b;
    b = a ^ b;
    a = a ^ b;
    s[left] = String.fromCharCode(a);
    s[right] = String.fromCharCode(b);
    left++;
    right--;
  }
}

// 方法5：分治法 — 翻转左右半部分再交换
function reverseStringDivide(s: string[]): void {
  const reverse = (start: number, end: number) => {
    if (start >= end) return;
    [s[start], s[end]] = [s[end], s[start]];
    reverse(start + 1, end - 1);
  };

  reverse(0, s.length - 1);
}

// 拓展：反转字符串 II（每 2k 个字符反转前 k 个）
// LeetCode 541. Reverse String II
function reverseStr(s: string, k: number): string {
  const arr = s.split("");

  for (let i = 0; i < arr.length; i += 2 * k) {
    let left = i;
    let right = Math.min(i + k - 1, arr.length - 1);
    while (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++;
      right--;
    }
  }

  return arr.join("");
}

// 拓展：反转字符串中的元音字母
// LeetCode 345. Reverse Vowels of a String
function reverseVowels(s: string): string {
  const vowels = new Set(["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]);
  const arr = s.split("");
  let left = 0,
    right = arr.length - 1;

  while (left < right) {
    while (left < right && !vowels.has(arr[left])) left++;
    while (left < right && !vowels.has(arr[right])) right--;
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }

  return arr.join("");
}

// ============================================================
// 11. 区间和
// 前缀和经典应用：快速求任意区间的元素之和
// ============================================================

// 方法1：前缀和 — 推荐 O(n) 预处理，O(1) 查询
class PrefixSum {
  private prefix: number[];

  constructor(arr: number[]) {
    this.prefix = new Array(arr.length + 1).fill(0);
    for (let i = 0; i < arr.length; i++) {
      this.prefix[i + 1] = this.prefix[i] + arr[i];
    }
  }

  // 查询区间 [left, right] 的和（闭区间）
  query(left: number, right: number): number {
    return this.prefix[right + 1] - this.prefix[left];
  }
}

// 方法2：暴力法 — O(n) 每次查询
function rangeSumBrute(nums: number[], left: number, right: number): number {
  let sum = 0;
  for (let i = left; i <= right; i++) {
    sum += nums[i];
  }
  return sum;
}

// 方法3：二维前缀和 — 矩阵区间和
class PrefixSum2D {
  private prefix: number[][];

  constructor(matrix: number[][]) {
    const m = matrix.length;
    const n = matrix[0].length;
    this.prefix = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        this.prefix[i + 1][j + 1] =
          this.prefix[i][j + 1] +
          this.prefix[i + 1][j] -
          this.prefix[i][j] +
          matrix[i][j];
      }
    }
  }

  // 查询矩阵中 (r1,c1) 到 (r2,c2) 的区间和（闭区间）
  query(r1: number, c1: number, r2: number, c2: number): number {
    return (
      this.prefix[r2 + 1][c2 + 1] -
      this.prefix[r1][c2 + 1] -
      this.prefix[r2 + 1][c1] +
      this.prefix[r1][c1]
    );
  }
}

// 方法4：差分数组 — 区间修改 + 单点查询
class DiffArray {
  private diff: number[];
  private n: number;

  constructor(arr: number[]) {
    this.n = arr.length;
    this.diff = new Array(this.n).fill(0);
    this.diff[0] = arr[0];
    for (let i = 1; i < this.n; i++) {
      this.diff[i] = arr[i] - arr[i - 1];
    }
  }

  // 区间 [left, right] 每个元素加 val
  update(left: number, right: number, val: number): void {
    this.diff[left] += val;
    if (right + 1 < this.n) {
      this.diff[right + 1] -= val;
    }
  }

  // 还原数组
  getResult(): number[] {
    const result = new Array(this.n).fill(0);
    result[0] = this.diff[0];
    for (let i = 1; i < this.n; i++) {
      result[i] = result[i - 1] + this.diff[i];
    }
    return result;
  }
}

// 方法5：树状数组（Fenwick Tree）— 区间和 + 单点修改
class FenwickTree {
  private tree: number[];
  private n: number;

  constructor(arr: number[]) {
    this.n = arr.length;
    this.tree = new Array(this.n + 1).fill(0);
    for (let i = 0; i < this.n; i++) {
      this.update(i, arr[i]);
    }
  }

  // 单点更新：位置 index 加上 delta
  update(index: number, delta: number): void {
    for (let i = index + 1; i <= this.n; i += i & -i) {
      this.tree[i] += delta;
    }
  }

  // 前缀和 [0, index]
  private query(index: number): number {
    let sum = 0;
    for (let i = index + 1; i > 0; i -= i & -i) {
      sum += this.tree[i];
    }
    return sum;
  }

  // 区间和 [left, right]
  rangeQuery(left: number, right: number): number {
    return this.query(right) - (left > 0 ? this.query(left - 1) : 0);
  }
}

// ============================================================
// 12. 常见八大排序算法的稳定性
// 稳定性：相等元素排序后相对顺序不变
//
// | 排序算法 | 平均时间   | 最坏时间   | 空间     | 稳定性 |
// |---------|-----------|-----------|---------|--------|
// | 冒泡排序 | O(n²)     | O(n²)     | O(1)    | 稳定   |
// | 选择排序 | O(n²)     | O(n²)     | O(1)    | 不稳定 |
// | 插入排序 | O(n²)     | O(n²)     | O(1)    | 稳定   |
// | 希尔排序 | O(n^1.3)  | O(n²)     | O(1)    | 不稳定 |
// | 归并排序 | O(nlogn)  | O(nlogn)  | O(n)    | 稳定   |
// | 快速排序 | O(nlogn)  | O(n²)     | O(logn) | 不稳定 |
// | 堆排序   | O(nlogn)  | O(nlogn)  | O(1)    | 不稳定 |
// | 计数排序 | O(n+k)    | O(n+k)    | O(k)    | 稳定   |
// | 基数排序 | O(d(n+k)) | O(d(n+k)) | O(n+k)  | 稳定   |
// | 桶排序   | O(n+k)    | O(n²)     | O(n+k)  | 稳定   |
//
// 口诀：快(快排)希(希尔)选(选择)堆(堆排) 不稳定，其余稳定
// ============================================================

// --- 1. 冒泡排序（稳定）---
// 相邻元素交换，相等时不交换 → 保持相对顺序
function bubbleSortStable(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 注意：严格大于才交换，相等不交换 → 稳定
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}

// --- 2. 选择排序（不稳定）---
// 每次选最小值与前面交换，可能跨越相等元素 → 不稳定
// 例：[5, 5, 2] → 第一轮将 2 与第一个 5 交换 → [2, 5, 5]，两个 5 顺序变了
function selectionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]; // 交换可能破坏稳定性
    }
  }
  return arr;
}

// --- 3. 插入排序（稳定）---
// 从后往前找位置，相等时插在后面 → 稳定
function insertionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    // 注意：严格大于才后移，相等不后移 → 稳定
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// --- 4. 希尔排序（不稳定）---
// 分组插入排序，跨组交换可能破坏相等元素的相对顺序
function shellSort(arr: number[]): number[] {
  const n = arr.length;
  let gap = Math.floor(n / 2);

  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }

  return arr;
}

// --- 5. 归并排序（稳定）---
// 合并时左半先入队，相等时左半优先 → 稳定
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return mergeStable(left, right);
}

function mergeStable(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0,
    j = 0;

  while (i < left.length && j < right.length) {
    // 注意：小于等于时左半优先 → 稳定
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}

// --- 6. 快速排序（不稳定）---
// 分区交换可能跨越相等元素 → 不稳定
function quickSort(arr: number[], left = 0, right = arr.length - 1): number[] {
  if (left >= right) return arr;

  const pivotIndex = partition(arr, left, right);
  quickSort(arr, left, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, right);

  return arr;
}

function partition(arr: number[], left: number, right: number): number {
  const pivot = arr[right];
  let i = left;

  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]]; // 交换可能破坏稳定性
      i++;
    }
  }

  [arr[i], arr[right]] = [arr[right], arr[i]];
  return i;
}

// --- 7. 堆排序（不稳定）---
// 建堆和调整堆时的交换可能破坏相等元素顺序
function heapSort(arr: number[]): number[] {
  const n = arr.length;

  // 建大顶堆
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // 逐个取出堆顶
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]; // 交换破坏稳定性
    heapify(arr, i, 0);
  }

  return arr;
}

function heapify(arr: number[], n: number, i: number): void {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

// --- 8. 计数排序（稳定）---
// 用计数数组记录位置，从后往前放置 → 稳定
function countingSortStable(arr: number[]): number[] {
  if (arr.length === 0) return arr;

  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;

  // 计数
  const count = new Array(range).fill(0);
  for (const num of arr) {
    count[num - min]++;
  }

  // 前缀和 → 确定每个元素的最后位置
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  // 从后往前放置（保证稳定性）
  const result = new Array(arr.length).fill(0);
  for (let i = arr.length - 1; i >= 0; i--) {
    const idx = count[arr[i] - min] - 1;
    result[idx] = arr[i];
    count[arr[i] - min]--;
  }

  return result;
}

// --- 稳定性验证函数 ---
// 验证排序是否为稳定排序：对 [value, originalIndex] 排序，检查相同 value 的 originalIndex 是否有序
function verifyStability(
  _sortFn: (arr: number[]) => number[],
  name: string,
): void {
  // 构造带原始索引的数组 [value, index]
  const input = [5, 2, 3, 5, 1, 3]; // 有重复元素
  const tagged = input.map((val, idx) => ({ val, idx }));

  // 对 tagged 排序
  const sorted = [...tagged].sort((a, b) => {
    const valA = a.val;
    const valB = b.val;
    // 用排序函数对值排序，但检查相同值时索引是否保持顺序
    return valA - valB;
  });

  // 检查相同值的原始索引是否递增
  let stable = true;
  for (let i = 1; i < sorted.length; i++) {
    if (
      sorted[i].val === sorted[i - 1].val &&
      sorted[i].idx < sorted[i - 1].idx
    ) {
      stable = false;
      break;
    }
  }

  console.log(`${name}: ${stable ? "稳定" : "不稳定"}`);
}

// ============================================================
// 测试
// ============================================================

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
console.log("===== 1. 二叉树的前序遍历 =====");
const tree1 = createTree([1, null, 2, 3]);
console.log(preorderTraversal(tree1)); // [1, 2, 3]
console.log(preorderTraversalIterative(tree1)); // [1, 2, 3]
console.log(preorderTraversalMorris(tree1)); // [1, 2, 3]

console.log("\n===== 2. 二叉树的后序遍历 =====");
const tree2 = createTree([1, null, 2, 3]);
console.log(postorderTraversal(tree2)); // [3, 2, 1]
console.log(postorderTraversalReverse(tree2)); // [3, 2, 1]
console.log(postorderTraversalIterative(tree2)); // [3, 2, 1]

console.log("\n===== 3. 翻转二叉树 =====");
const tree3 = createTree([4, 2, 7, 1, 3, 6, 9]);
const inverted = invertTree(tree3);
console.log(preorderTraversal(inverted)); // [4, 7, 9, 6, 2, 3, 1]
const tree3b = createTree([4, 2, 7, 1, 3, 6, 9]);
console.log(preorderTraversal(invertTreeBFS(tree3b))); // [4, 7, 9, 6, 2, 3, 1]

console.log("\n===== 4. 二叉树的所有路径 =====");
const tree4 = createTree([1, 2, 3, null, 5]);
console.log(binaryTreePaths(tree4)); // ["1->2->5", "1->3"]
console.log(binaryTreePathsBacktrack(tree4)); // ["1->2->5", "1->3"]

console.log("\n===== 5. 二叉树的中序遍历 =====");
const tree5 = createTree([1, null, 2, 3]);
console.log(inorderTraversal(tree5)); // [1, 3, 2]
console.log(inorderTraversalIterative(tree5)); // [1, 3, 2]
console.log(inorderTraversalMorris(tree5)); // [1, 3, 2]

console.log("\n===== 6. 字符串中的第一个唯一字符 =====");
console.log(firstUniqChar("leetcode")); // 0
console.log(firstUniqCharArray("loveleetcode")); // 2
console.log(firstUniqCharIndexOf("aabb")); // -1

console.log("\n===== 7. 字符串中的单词数 =====");
console.log(countSegments("Hello, my name is John")); // 5
console.log(countSegmentsSplit("    hello    world   ")); // 2
console.log(countSegmentsRegex("")); // 0

console.log("\n===== 8. 反转单词顺序 =====");
console.log(reverseWords("the sky is blue")); // "blue is sky the"
console.log(reverseWordsDeque("  hello world  ")); // "world hello"
console.log(reverseWordsInPlace("a good   example")); // "example good a"

console.log("\n===== 9. 判断回文串 =====");
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindromeInPlace("race a car")); // false
console.log(isPalindromeReverse(" ")); // true

console.log("\n===== 10. 反转字符串 =====");
const arr10 = ["h", "e", "l", "l", "o"];
reverseString(arr10);
console.log(arr10); // ["o", "l", "l", "e", "h"]
const arr10b = ["H", "a", "n", "n", "a", "h"];
reverseStringRecursive(arr10b);
console.log(arr10b); // ["h", "a", "n", "n", "a", "H"]
console.log(reverseStr("abcdefg", 2)); // "bacdfeg"
console.log(reverseVowels("hello")); // "holle"

console.log("\n===== 11. 区间和 =====");
const arr11 = [1, 2, 3, 4, 5];
const ps = new PrefixSum(arr11);
console.log(ps.query(0, 2)); // 6 (1+2+3)
console.log(ps.query(1, 4)); // 14 (2+3+4+5)
console.log(rangeSumBrute(arr11, 2, 4)); // 12 (3+4+5)

const matrix11 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
const ps2d = new PrefixSum2D(matrix11);
console.log(ps2d.query(0, 0, 1, 1)); // 12 (1+2+4+5)

const diffArr = new DiffArray([1, 2, 3, 4, 5]);
diffArr.update(1, 3, 2); // 区间 [1,3] 每个元素 +2
console.log(diffArr.getResult()); // [1, 4, 5, 6, 5]

const ft = new FenwickTree([1, 2, 3, 4, 5]);
console.log(ft.rangeQuery(0, 4)); // 15
ft.update(2, 10); // 位置 2 加 10
console.log(ft.rangeQuery(0, 4)); // 25

console.log("\n===== 12. 常见八大排序算法的稳定性 =====");
const sortInput = [64, 34, 25, 12, 22, 11, 90];
console.log("冒泡排序(稳定):", bubbleSortStable([...sortInput]));
console.log("选择排序(不稳定):", selectionSort([...sortInput]));
console.log("插入排序(稳定):", insertionSort([...sortInput]));
console.log("希尔排序(不稳定):", shellSort([...sortInput]));
console.log("归并排序(稳定):", mergeSort([...sortInput]));
console.log("快速排序(不稳定):", quickSort([...sortInput]));
console.log("堆排序(不稳定):", heapSort([...sortInput]));
console.log("计数排序(稳定):", countingSortStable([5, 2, 3, 5, 1, 3]));

console.log("\n--- 稳定性验证 ---");
verifyStability(bubbleSortStable, "冒泡排序");
verifyStability(insertionSort, "插入排序");
verifyStability(mergeSort, "归并排序");
verifyStability(countingSortStable, "计数排序");

export {};
