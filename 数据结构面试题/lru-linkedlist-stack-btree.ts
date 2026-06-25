// ============================================================
// 数据结构面试题（二）- TypeScript 解题合集
// 主题：LRU 缓存 / 反转链表部分节点 / 排序链表 /
//       链表相加 / 下一个更大元素 / B 树与 B+ 树
// ============================================================

// -------------------- 双向链表节点定义（LRU 缓存用） --------------------
class DoubleListNode {
  key: number;
  val: number;
  prev: DoubleListNode | null;
  next: DoubleListNode | null;
  constructor(key?: number, val?: number) {
    this.key = key === undefined ? 0 : key;
    this.val = val === undefined ? 0 : val;
    this.prev = null;
    this.next = null;
  }
}

// -------------------- 单链表节点定义 --------------------
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// ============================================================
// 1. LRU 缓存
// LeetCode 146. LRU Cache
//
// 核心思路：
//   哈希表 + 双向链表
//   - 哈希表：O(1) 查找 key 对应的链表节点
//   - 双向链表：O(1) 移动节点到头部 / 删除尾部节点
//   - 最近访问（get/put）的节点移到链表头部
//   - 容量满时，淘汰链表尾部（最久未使用）的节点
//
// 时间复杂度：get O(1), put O(1)
// 空间复杂度：O(capacity)
// ============================================================

// 方法1：手写双向链表 + 哈希表（推荐，面试标准写法）
class LRUCache {
  private capacity: number;
  private map: Map<number, DoubleListNode>;
  private head: DoubleListNode; // 哨兵头节点
  private tail: DoubleListNode; // 哨兵尾节点

  constructor(capacity: number) {
    this.capacity = capacity;
    this.map = new Map();
    // 初始化双向链表，头尾哨兵节点
    this.head = new DoubleListNode();
    this.tail = new DoubleListNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key)!;
    this.moveToHead(node); // 访问后移到头部
    return node.val;
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) {
      // key 已存在，更新值并移到头部
      const node = this.map.get(key)!;
      node.val = value;
      this.moveToHead(node);
    } else {
      // 新节点
      const newNode = new DoubleListNode(key, value);
      this.map.set(key, newNode);
      this.addToHead(newNode);

      // 超出容量，淘汰尾部
      if (this.map.size > this.capacity) {
        const removed = this.removeTail();
        if (removed) this.map.delete(removed.key);
      }
    }
  }

  // --- 双向链表操作 ---

  // 将节点添加到头部（哨兵头之后）
  private addToHead(node: DoubleListNode): void {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  // 从链表中移除节点
  private removeNode(node: DoubleListNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  // 将节点移到头部 = 先移除再添加到头部
  private moveToHead(node: DoubleListNode): void {
    this.removeNode(node);
    this.addToHead(node);
  }

  // 移除尾部节点（哨兵尾之前，即最久未使用的节点）
  private removeTail(): DoubleListNode | null {
    const node = this.tail.prev!;
    if (node === this.head) return null; // 链表为空
    this.removeNode(node);
    return node;
  }
}

// 方法2：利用 JS Map 的有序性（简洁但面试不建议）
// Map 在 JS 规范中保持插入顺序，最近访问的 key 删除再插入即可排到最后
// 但这依赖引擎实现细节，且淘汰的是最早插入的（最久未使用的在 Map 遍历序的最前面）
class LRUCacheMap {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    // 删除再插入，使其成为最新
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, value);
    // 超出容量，淘汰最旧的（Map 迭代器的第一个）
    if (this.cache.size > this.capacity) {
      const oldestKey = this.cache.keys().next().value as number;
      this.cache.delete(oldestKey);
    }
  }
}

// ============================================================
// 2. 反转链表的部分节点
// LeetCode 92. Reverse Linked List II
//
// 给定链表头节点和 left, right，反转从 left 到 right 的部分
//
// 核心思路：
//   找到 left-1 节点（前驱），反转 left 到 right 的一段，
//   然后将反转后的子链重新接回
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：头插法（推荐）
// 在需要反转的区间内，每遍历到一个节点，就把它插入到区间起始位置
function reverseBetween(
  head: ListNode | null,
  left: number,
  right: number,
): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev: ListNode = dummy; // prev 是 left 的前驱节点

  // 1. 走到 left 的前驱
  for (let i = 0; i < left - 1; i++) {
    prev = prev.next!;
  }

  // 2. 头插法反转 left 到 right
  let curr = prev.next!; // curr 始终指向反转区间的第一个节点
  for (let i = 0; i < right - left; i++) {
    const nextNode = curr.next!; // 要插入到前面的节点
    curr.next = nextNode.next; // curr 跳过 nextNode
    nextNode.next = prev.next; // nextNode 指向 curr
    prev.next = nextNode; // prev 指向 nextNode
  }

  return dummy.next;
}

// 方法2：先断开再反转再拼接
function reverseBetweenSplit(
  head: ListNode | null,
  left: number,
  right: number,
): ListNode | null {
  if (!head || left === right) return head;

  const dummy = new ListNode(0, head);
  let prev: ListNode = dummy;

  // 找到 left 的前驱
  for (let i = 0; i < left - 1; i++) {
    prev = prev.next!;
  }

  // 反转 left 到 right
  let curr = prev.next!;
  let reversedTail = curr; // 反转后的尾部 = 原来的起始节点
  let newHead: ListNode | null = null;
  for (let i = 0; i <= right - left; i++) {
    const nextNode = curr.next;
    curr.next = newHead;
    newHead = curr;
    curr = nextNode as ListNode;
  }

  // 拼接
  prev.next = newHead;
  reversedTail.next = curr;

  return dummy.next;
}

// 方法3：递归法
function reverseBetweenRecursive(
  head: ListNode | null,
  left: number,
  right: number,
): ListNode | null {
  if (left === 1) {
    return reverseN(head, right);
  }
  head!.next = reverseBetweenRecursive(head!.next, left - 1, right - 1);
  return head;
}

// 反转链表前 n 个节点
let successor: ListNode | null = null;
function reverseN(head: ListNode | null, n: number): ListNode | null {
  if (n === 1) {
    successor = head!.next;
    return head;
  }
  const last = reverseN(head!.next, n - 1);
  head!.next!.next = head;
  head!.next = successor;
  return last;
}

// ============================================================
// 3. 排序链表
// LeetCode 148. Sort List
//
// 给定链表头节点，将其按升序排列
// 要求：O(n log n) 时间复杂度，O(1) 额外空间
//
// 核心思路：
//   归并排序：找中点 → 断开 → 分别排序 → 合并
//   找中点用快慢指针，合并用双指针
//
// 时间复杂度：O(n log n)
// 空间复杂度：O(log n)（递归栈），迭代版可 O(1)
// ============================================================

// 方法1：归并排序 - 递归（推荐）
function sortList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  // 快慢指针找中点，断开链表
  const mid = getMid(head);
  const left = sortList(head);
  const right = sortList(mid);
  return merge(left, right);
}

// 找链表中点并断开
function getMid(head: ListNode): ListNode | null {
  let slow: ListNode = head;
  let fast: ListNode | null = head;

  // fast 走两步，slow 走一步
  // 用 prev 记录 slow 的前驱，用于断开链表
  let prev: ListNode | null = null;
  while (fast && fast.next) {
    prev = slow;
    slow = slow.next!;
    fast = fast.next.next;
  }

  // 断开
  if (prev) prev.next = null;
  return slow;
}

// 合并两个有序链表
function merge(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let curr = dummy;

  while (l1 && l2) {
    if (l1.val <= l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }

  curr.next = l1 || l2;
  return dummy.next;
}

// 方法2：归并排序 - 自底向上迭代（O(1) 空间）
function sortListIterative(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  // 计算链表长度
  let length = 0;
  let node: ListNode | null = head;
  while (node) {
    length++;
    node = node.next;
  }

  const dummy = new ListNode(0, head);

  // 步长从 1 开始，每次翻倍
  for (let step = 1; step < length; step *= 2) {
    let prev = dummy;
    let curr: ListNode | null = dummy.next;

    while (curr) {
      // 第一段（step 个节点）
      let left: ListNode | null = curr;
      let leftLen = 0;
      while (curr && leftLen < step) {
        leftLen++;
        curr = curr.next;
      }

      // 第二段（step 个节点）
      let right: ListNode | null = curr;
      let rightLen = 0;
      while (curr && rightLen < step) {
        rightLen++;
        curr = curr.next;
      }

      // 合并 left 和 right
      const merged = mergeWithLen(left, leftLen, right, rightLen);
      prev.next = merged.head;
      prev = merged.tail!;
    }
  }

  return dummy.next;
}

// 合并指定长度的两段链表
function mergeWithLen(
  l1: ListNode | null,
  len1: number,
  l2: ListNode | null,
  len2: number,
): { head: ListNode | null; tail: ListNode | null } {
  const dummy = new ListNode(0);
  let curr = dummy;
  let i = 0,
    j = 0;

  while (i < len1 && j < len2 && l1 && l2) {
    if (l1.val <= l2.val) {
      curr.next = l1;
      l1 = l1.next;
      i++;
    } else {
      curr.next = l2;
      l2 = l2.next;
      j++;
    }
    curr = curr.next;
  }

  while (i < len1 && l1) {
    curr.next = l1;
    l1 = l1.next;
    curr = curr.next;
    i++;
  }

  while (j < len2 && l2) {
    curr.next = l2;
    l2 = l2.next;
    curr = curr.next;
    j++;
  }

  curr.next = null;
  return { head: dummy.next, tail: curr };
}

// 方法3：快速排序（不推荐，链表快排最坏 O(n²)）
function sortListQuick(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  // 以头节点为 pivot 进行分区
  const dummyLeft = new ListNode(0);
  const dummyRight = new ListNode(0);
  const dummyMid = new ListNode(0);
  let left = dummyLeft;
  let right = dummyRight;
  let mid = dummyMid;

  const pivot = head.val;
  let curr: ListNode | null = head;

  while (curr) {
    if (curr.val < pivot) {
      left.next = curr;
      left = left.next;
    } else if (curr.val > pivot) {
      right.next = curr;
      right = right.next;
    } else {
      mid.next = curr;
      mid = mid.next;
    }
    curr = curr.next;
  }

  // 断开
  left.next = null;
  right.next = null;
  mid.next = null;

  // 递归排序左右
  const sortedLeft = sortListQuick(dummyLeft.next);
  const sortedRight = sortListQuick(dummyRight.next);

  // 拼接：left + mid + right
  return concat(sortedLeft, dummyMid.next, sortedRight);
}

// 拼接三段链表
function concat(
  l1: ListNode | null,
  l2: ListNode | null,
  l3: ListNode | null,
): ListNode | null {
  const dummy = new ListNode(0);
  let curr = dummy;

  for (const list of [l1, l2, l3]) {
    let node = list;
    while (node) {
      curr.next = node;
      curr = curr.next;
      node = node.next;
    }
  }
  curr.next = null;
  return dummy.next;
}

// ============================================================
// 4. 实现两个链表的相加
// LeetCode 2. Add Two Numbers
// LeetCode 445. Add Two Numbers II
//
// 核心思路：
//   链表每个节点存储一位数字，模拟竖式加法，注意进位
//   - 正序存储（个位在头）：直接遍历相加
//   - 逆序存储（个位在尾）：先反转 or 用栈
//
// 时间复杂度：O(max(m, n))
// 空间复杂度：O(max(m, n))（结果链表）
// ============================================================

// 题目一：链表逆序存储（个位在头）— LeetCode 2
// 方法1：迭代法（推荐）
function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null,
): ListNode | null {
  const dummy = new ListNode(0);
  let curr = dummy;
  let carry = 0;

  while (l1 || l2 || carry) {
    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    carry = Math.floor(sum / 10);
    curr.next = new ListNode(sum % 10);
    curr = curr.next;

    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }

  return dummy.next;
}

// 方法2：递归法
function addTwoNumbersRecursive(
  l1: ListNode | null,
  l2: ListNode | null,
  carry: number = 0,
): ListNode | null {
  if (!l1 && !l2 && carry === 0) return null;

  const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
  const node = new ListNode(sum % 10);
  node.next = addTwoNumbersRecursive(
    l1 ? l1.next : null,
    l2 ? l2.next : null,
    Math.floor(sum / 10),
  );
  return node;
}

// 题目二：链表正序存储（个位在尾）— LeetCode 445
// 方法1：栈（推荐，不修改原链表）
function addTwoNumbersII(
  l1: ListNode | null,
  l2: ListNode | null,
): ListNode | null {
  const stack1: number[] = [];
  const stack2: number[] = [];

  // 将链表值压入栈
  while (l1) {
    stack1.push(l1.val);
    l1 = l1.next;
  }
  while (l2) {
    stack2.push(l2.val);
    l2 = l2.next;
  }

  let carry = 0;
  let head: ListNode | null = null;

  // 从栈顶（个位）开始相加
  while (stack1.length || stack2.length || carry) {
    const sum =
      (stack1.length ? stack1.pop()! : 0) +
      (stack2.length ? stack2.pop()! : 0) +
      carry;
    carry = Math.floor(sum / 10);
    // 头插法，这样最高位在最前面
    const node = new ListNode(sum % 10);
    node.next = head;
    head = node;
  }

  return head;
}

// 方法2：反转链表法（修改原链表）
function addTwoNumbersIIReverse(
  l1: ListNode | null,
  l2: ListNode | null,
): ListNode | null {
  // 反转两个链表
  l1 = reverseList(l1);
  l2 = reverseList(l2);

  // 相加
  const result = addTwoNumbers(l1, l2);

  // 恢复原链表（可选）
  // reverseList(l1);
  // reverseList(l2);

  // 结果也是逆序的，再反转回来
  return reverseList(result);
}

// 反转链表辅助函数
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

// ============================================================
// 5. 下一个更大元素（给定一个正整数）
// LeetCode 496. Next Greater Element I
// LeetCode 503. Next Greater Element II（循环数组）
// LeetCode 556. Next Greater Element III（下一个更大整数）
//
// 核心数据结构：单调栈
//   维护一个从栈底到栈顶单调递减的栈
//   遍历数组时，如果当前元素 > 栈顶，则栈顶的下一个更大元素就是当前元素
//
// 时间复杂度：O(n)
// 空间复杂度：O(n)
// ============================================================

// 题目一：LeetCode 496 — nums1 是 nums2 的子集，找 nums1 中每个元素在 nums2 中的下一个更大元素
// 方法1：单调栈 + 哈希表（推荐）
function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  // 先用单调栈求出 nums2 中每个元素的下一个更大元素
  const nextGreater = new Map<number, number>();
  const stack: number[] = []; // 单调递减栈

  for (const num of nums2) {
    while (stack.length && stack[stack.length - 1] < num) {
      nextGreater.set(stack.pop()!, num);
    }
    stack.push(num);
  }

  // 栈中剩余元素没有下一个更大元素
  while (stack.length) {
    nextGreater.set(stack.pop()!, -1);
  }

  return nums1.map((num) => nextGreater.get(num) ?? -1);
}

// 方法2：暴力法 O(m * n)
function nextGreaterElementBruteForce(
  nums1: number[],
  nums2: number[],
): number[] {
  return nums1.map((num) => {
    const idx = nums2.indexOf(num);
    for (let i = idx + 1; i < nums2.length; i++) {
      if (nums2[i] > num) return nums2[i];
    }
    return -1;
  });
}

// 题目二：LeetCode 503 — 循环数组，找每个元素的下一个更大元素
// 方法1：单调栈 + 拼接数组（推荐）
function nextGreaterElements(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack: number[] = []; // 存储索引

  // 遍历两遍（相当于循环）
  for (let i = 0; i < 2 * n; i++) {
    const idx = i % n;
    while (stack.length && nums[stack[stack.length - 1]] < nums[idx]) {
      const top = stack.pop()!;
      if (result[top] === -1) {
        result[top] = nums[idx];
      }
    }
    if (i < n) stack.push(idx);
  }

  return result;
}

// 方法2：取模遍历
function nextGreaterElementsMod(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack: number[] = [];

  for (let i = 0; i < 2 * n - 1; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i % n]) {
      result[stack.pop()!] = nums[i % n];
    }
    stack.push(i % n);
  }

  return result;
}

// 题目三：LeetCode 556 — 给定一个正整数 n，找到大于 n 的最小整数，且该整数的数字排列与 n 相同
// 核心思路：与"下一个排列"算法相同
//   1. 从右向左找第一个降序的位置 i（nums[i] < nums[i+1]）
//   2. 从右向左找第一个大于 nums[i] 的位置 j
//   3. 交换 i 和 j
//   4. 反转 i+1 到末尾
function nextGreaterElementIII(n: number): number {
  const digits = String(n).split("").map(Number);
  const len = digits.length;

  // 1. 从右向左找第一个降序位置
  let i = len - 2;
  while (i >= 0 && digits[i] >= digits[i + 1]) {
    i--;
  }

  if (i < 0) return -1; // 整个序列递减，没有更大的排列

  // 2. 从右向左找第一个大于 digits[i] 的位置
  let j = len - 1;
  while (j > i && digits[j] <= digits[i]) {
    j--;
  }

  // 3. 交换
  [digits[i], digits[j]] = [digits[j], digits[i]];

  // 4. 反转 i+1 到末尾
  let left = i + 1,
    right = len - 1;
  while (left < right) {
    [digits[left], digits[right]] = [digits[right], digits[left]];
    left++;
    right--;
  }

  const result = Number(digits.join(""));
  // 32 位整数范围检查
  return result > 0x7fffffff ? -1 : result;
}

// 补充：通用单调栈模板 — 求数组中每个元素的下一个更大元素
function nextGreaterTemplate(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack: number[] = []; // 存索引，从栈底到栈顶单调递减

  for (let i = 0; i < n; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      result[stack.pop()!] = nums[i];
    }
    stack.push(i);
  }

  return result;
}

// ============================================================
// 6. B 树和 B+ 树的区别
//
// 这是概念性问题，下面用代码模拟核心区别，并总结要点
// ============================================================

//
// ┌──────────────────────┬────────────────────────────┬────────────────────────────┐
// │       特性            │          B 树              │         B+ 树              │
// ├──────────────────────┼────────────────────────────┼────────────────────────────┤
// │ 数据存储位置          │ 所有节点都存数据            │ 数据只在叶子节点            │
// │ 叶子节点链接          │ 叶子节点之间无链接          │ 叶子节点用链表相连          │
// │ 非叶子节点存储        │ 关键字 + 数据 + 子指针      │ 只存关键字（索引）+ 子指针   │
// │ 查询性能              │ 非叶子节点命中即返回        │ 必须走到叶子节点才返回       │
// │ 范围查询              │ 需要中序遍历整棵树          │ 顺序遍历叶子链表即可        │
// │ 查询稳定性            │ 不稳定（可能在中间命中）    │ 稳定（一定到叶子节点）      │
// │ 磁盘 I/O             │ 每次读的节点数据量较大      │ 非叶节点更小，一次读更多    │
// │ 典型应用              │ 文件系统、小型数据库        │ MySQL InnoDB、数据库索引   │
// └──────────────────────┴────────────────────────────┴────────────────────────────┘
//

// B 树节点模拟（所有节点都可能包含数据）
class BTreeNode {
  isLeaf: boolean;
  keys: number[]; // 关键字
  values: (string | null)[]; // 数据（B 树中非叶节点也有数据）
  children: BTreeNode[]; // 子节点指针

  constructor(isLeaf: boolean = false) {
    this.isLeaf = isLeaf;
    this.keys = [];
    this.values = [];
    this.children = [];
  }
}

// B+ 树节点模拟（非叶节点只存索引，数据只在叶子节点）
class BPlusTreeNode {
  isLeaf: boolean;
  keys: number[]; // 关键字（索引）
  children: BPlusTreeNode[]; // 子节点指针（内部节点）
  values: (string | null)[]; // 数据（仅叶子节点有）
  next: BPlusTreeNode | null; // 叶子节点的链表指针（B+ 树特有）

  constructor(isLeaf: boolean = false) {
    this.isLeaf = isLeaf;
    this.keys = [];
    this.children = [];
    this.values = [];
    this.next = null;
  }
}

// B 树的搜索（可能在中间节点就找到数据）
function bTreeSearch(root: BTreeNode | null, key: number): string | null {
  if (!root) return null;

  let i = 0;
  while (i < root.keys.length && key > root.keys[i]) {
    i++;
  }

  // 在当前节点找到关键字
  if (i < root.keys.length && key === root.keys[i]) {
    return root.values[i]; // B 树：非叶节点也能返回数据
  }

  // 到达叶子节点仍未找到
  if (root.isLeaf) return null;

  // 递归搜索子节点
  return bTreeSearch(root.children[i], key);
}

// B+ 树的搜索（必须走到叶子节点才能获取数据）
function bPlusTreeSearch(
  root: BPlusTreeNode | null,
  key: number,
): string | null {
  if (!root) return null;

  let i = 0;
  while (i < root.keys.length && key >= root.keys[i]) {
    // B+ 树：等于时也继续往右子树找（因为非叶节点的 key 会重复出现在叶子节点）
    i++;
  }

  // 叶子节点：直接在 values 中查找
  if (root.isLeaf) {
    for (let j = 0; j < root.keys.length; j++) {
      if (root.keys[j] === key) return root.values[j];
    }
    return null;
  }

  // 非叶子节点：继续向下搜索
  return bPlusTreeSearch(root.children[i], key);
}

// B+ 树的范围查询（利用叶子节点链表）
function bPlusTreeRangeQuery(
  leafStart: BPlusTreeNode | null,
  low: number,
  high: number,
): [number, string][] {
  const result: [number, string][] = [];
  let current: BPlusTreeNode | null = leafStart;

  while (current) {
    for (let i = 0; i < current.keys.length; i++) {
      if (current.keys[i] > high) return result;
      if (current.keys[i] >= low) {
        result.push([current.keys[i], current.values[i]!]);
      }
    }
    current = current.next; // 通过链表跳到下一个叶子节点
  }

  return result;
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

// --- 测试用例 ---
console.log("===== 1. LRU 缓存 =====");
const lru = new LRUCache(2);
lru.put(1, 1);
lru.put(2, 2);
console.log(lru.get(1)); // 1（1 变为最近使用）
lru.put(3, 3); // 淘汰 key=2
console.log(lru.get(2)); // -1（已被淘汰）
console.log(lru.get(1)); // 1
lru.put(4, 4); // 淘汰 key=3
console.log(lru.get(1)); // 1
console.log(lru.get(3)); // -1
console.log(lru.get(4)); // 4

// Map 版本
const lru2 = new LRUCacheMap(2);
lru2.put(1, 1);
lru2.put(2, 2);
console.log(lru2.get(1)); // 1
lru2.put(3, 3); // 淘汰 key=2
console.log(lru2.get(2)); // -1

console.log("\n===== 2. 反转链表的部分节点 =====");
console.log(listToArray(reverseBetween(createList([1, 2, 3, 4, 5]), 2, 4))); // [1, 4, 3, 2, 5]
console.log(listToArray(reverseBetween(createList([5]), 1, 1))); // [5]
console.log(
  listToArray(reverseBetweenSplit(createList([1, 2, 3, 4, 5]), 2, 4)),
); // [1, 4, 3, 2, 5]
console.log(
  listToArray(reverseBetweenRecursive(createList([1, 2, 3, 4, 5]), 2, 4)),
); // [1, 4, 3, 2, 5]

console.log("\n===== 3. 排序链表 =====");
console.log(listToArray(sortList(createList([4, 2, 1, 3])))); // [1, 2, 3, 4]
console.log(listToArray(sortList(createList([-1, 5, 3, 4, 0])))); // [-1, 0, 3, 4, 5]
console.log(listToArray(sortListIterative(createList([4, 2, 1, 3])))); // [1, 2, 3, 4]
console.log(listToArray(sortListQuick(createList([4, 2, 1, 3])))); // [1, 2, 3, 4]

console.log("\n===== 4. 两个链表相加 =====");
// 逆序存储：(2 → 4 → 3) + (5 → 6 → 4) = 342 + 465 = 807 → (7 → 0 → 8)
console.log(
  listToArray(addTwoNumbers(createList([2, 4, 3]), createList([5, 6, 4]))),
); // [7, 0, 8]
console.log(
  listToArray(addTwoNumbersRecursive(createList([0]), createList([0]))),
); // [0]

// 正序存储：(7 → 2 → 4 → 3) + (5 → 6 → 4) = 7243 + 564 = 7807 → (7 → 8 → 0 → 7)
console.log(
  listToArray(addTwoNumbersII(createList([7, 2, 4, 3]), createList([5, 6, 4]))),
); // [7, 8, 0, 7]
console.log(
  listToArray(
    addTwoNumbersIIReverse(createList([7, 2, 4, 3]), createList([5, 6, 4])),
  ),
); // [7, 8, 0, 7]

console.log("\n===== 5. 下一个更大元素 =====");
// LeetCode 496
console.log(nextGreaterElement([4, 1, 2], [1, 3, 4, 2])); // [-1, 3, -1]
console.log(nextGreaterElement([2, 4], [1, 2, 3, 4])); // [3, -1]

// LeetCode 503 — 循环数组
console.log(nextGreaterElements([1, 2, 1])); // [2, -1, 2]
console.log(nextGreaterElements([5, 4, 3, 2, 1])); // [-1, 5, 5, 5, 5]

// LeetCode 556 — 下一个更大整数
console.log(nextGreaterElementIII(12)); // 21
console.log(nextGreaterElementIII(21)); // -1
console.log(nextGreaterElementIII(1234)); // 1243
console.log(nextGreaterElementIII(534976)); // 536479

// 单调栈模板
console.log(nextGreaterTemplate([2, 1, 2, 4, 3])); // [4, 2, 4, -1, -1]

console.log("\n===== 6. B 树 vs B+ 树 — 概念对比 =====");
// 构造一棵简单的 B 树（3 阶）
//       [10, 20]
//      /    |    \
//  [5]   [15]   [25, 30]
const bRoot = new BTreeNode(false);
bRoot.keys = [10, 20];
bRoot.values = ["data10", "data20"];

const bChild0 = new BTreeNode(true);
bChild0.keys = [5];
bChild0.values = ["data5"];

const bChild1 = new BTreeNode(true);
bChild1.keys = [15];
bChild1.values = ["data15"];

const bChild2 = new BTreeNode(true);
bChild2.keys = [25, 30];
bChild2.values = ["data25", "data30"];

bRoot.children = [bChild0, bChild1, bChild2];

console.log("B 树搜索 key=10:", bTreeSearch(bRoot, 10)); // "data10"（非叶节点直接命中）
console.log("B 树搜索 key=15:", bTreeSearch(bRoot, 15)); // "data15"

// 构造一棵简单的 B+ 树（3 阶）
//       [10, 20]        ← 只存索引
//      /    |    \
//  [5,10] [15,20] [25,30]  ← 叶子节点存数据，用链表相连
const bpRoot = new BPlusTreeNode(false);
bpRoot.keys = [10, 20];

const bpLeaf0 = new BPlusTreeNode(true);
bpLeaf0.keys = [5, 10];
bpLeaf0.values = ["data5", "data10"];

const bpLeaf1 = new BPlusTreeNode(true);
bpLeaf1.keys = [15, 20];
bpLeaf1.values = ["data15", "data20"];

const bpLeaf2 = new BPlusTreeNode(true);
bpLeaf2.keys = [25, 30];
bpLeaf2.values = ["data25", "data30"];

// 叶子链表
bpLeaf0.next = bpLeaf1;
bpLeaf1.next = bpLeaf2;

bpRoot.children = [bpLeaf0, bpLeaf1, bpLeaf2];

console.log("B+树搜索 key=10:", bPlusTreeSearch(bpRoot, 10)); // "data10"（必须到叶子节点）
console.log("B+树搜索 key=20:", bPlusTreeSearch(bpRoot, 20)); // "data20"
console.log("B+树范围查询 [10, 25]:", bPlusTreeRangeQuery(bpLeaf0, 10, 25)); // [[10,"data10"],[15,"data15"],[20,"data20"],[25,"data25"]]

export {};
