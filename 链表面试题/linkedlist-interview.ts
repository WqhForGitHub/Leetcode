// ============================================================
// 链表面试题 - TypeScript 解题合集
// 主题：反转链表 / 判断链表是否有环 / 寻找中间节点 /
//       删除节点 / 合并有序链表 / 删除重复元素 /
//       倒数第k个节点 / 两链表相加 / 排序链表 /
//       反转部分节点 / 旋转链表 / 复制随机指针链表 /
//       分割链表 / LRU缓存
// ============================================================

// ============================================================
// 基础数据结构定义
// ============================================================
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

class RandomListNode {
  val: number;
  next: RandomListNode | null;
  random: RandomListNode | null;
  constructor(val: number = 0) {
    this.val = val;
    this.next = null;
    this.random = null;
  }
}

// ============================================================
// 1. 反转链表
// ============================================================
// LeetCode 206. Reverse Linked List
// 给定单链表的头节点，反转链表并返回反转后的头节点
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：迭代法（推荐）
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  while (curr !== null) {
    const next = curr.next; // 暂存下一个节点
    curr.next = prev;       // 反转指针
    prev = curr;            // prev 前进
    curr = next;            // curr 前进
  }
  return prev;
}

// 方法2：递归法
function reverseListRecursive(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return head;
  const newHead = reverseListRecursive(head.next);
  head.next.next = head; // 后继节点指向自己
  head.next = null;      // 断开原指针
  return newHead;
}

// ============================================================
// 2. 判断链表中是否有环
// ============================================================
// LeetCode 141. Linked List Cycle
// 判断链表是否有环，有环返回 true
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：快慢指针（推荐）
function hasCycle(head: ListNode | null): boolean {
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// 方法2：Set 记录法
function hasCycleSet(head: ListNode | null): boolean {
  const visited = new Set<ListNode>();
  let curr: ListNode | null = head;
  while (curr !== null) {
    if (visited.has(curr)) return true;
    visited.add(curr);
    curr = curr.next;
  }
  return false;
}

// ============================================================
// 2.1 寻找链表环的入口节点
// ============================================================
// LeetCode 142. Linked List Cycle II
// 给定链表，返回链表开始入环的第一个节点，无环返回 null
// 时间复杂度：O(n)，空间复杂度：O(1)

function detectCycle(head: ListNode | null): ListNode | null {
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  // 第一阶段：判断是否有环
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) break;
  }
  // 快指针到末尾，无环
  if (fast === null || fast.next === null) return null;
  // 第二阶段：找入口
  // 相遇后，一个指针从 head 出发，另一个从相遇点出发，再次相遇即为入口
  let ptr: ListNode | null = head;
  while (ptr !== slow) {
    ptr = ptr!.next;
    slow = slow!.next;
  }
  return ptr;
}

// ============================================================
// 3. 寻找链表的中间节点
// ============================================================
// LeetCode 876. Middle of the Linked List
// 给定非空单链表，返回中间节点（偶数个节点返回第二个中间节点）
// 时间复杂度：O(n)，空间复杂度：O(1)

function middleNode(head: ListNode | null): ListNode | null {
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}

// 如果偶数个节点需要返回第一个中间节点（用于归并排序等场景）
function middleNodeFirst(head: ListNode | null): ListNode | null {
  if (head === null) return null;
  let slow: ListNode | null = head;
  let fast: ListNode | null = head.next;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}

// ============================================================
// 4. 删除链表中的节点
// ============================================================
// LeetCode 237. Delete Node in a Linked List
// 给定待删除节点（非尾节点），在不知道头节点的情况下删除该节点
// 思路：将下一个节点的值复制到当前节点，然后删除下一个节点
// 时间复杂度：O(1)，空间复杂度：O(1)

function deleteNode(node: ListNode | null): void {
  if (node === null || node.next === null) return;
  node.val = node.next.val; // 复制值
  node.next = node.next.next; // 跳过下一个节点
}

// LeetCode 203. Remove Linked List Elements
// 给定头节点和值，删除链表中所有等于该值的节点
// 时间复杂度：O(n)，空间复杂度：O(1)
function removeElements(head: ListNode | null, val: number): ListNode | null {
  const dummy = new ListNode(0, head); // 虚拟头节点
  let curr: ListNode | null = dummy;
  while (curr !== null && curr.next !== null) {
    if (curr.next.val === val) {
      curr.next = curr.next.next; // 删除节点
    } else {
      curr = curr.next;
    }
  }
  return dummy.next;
}

// 删除链表的倒数第 N 个节点
// LeetCode 19. Remove Nth Node From End of List
// 时间复杂度：O(n)，空间复杂度：O(1)
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let fast: ListNode | null = dummy;
  let slow: ListNode | null = dummy;
  // fast 先走 n+1 步
  for (let i = 0; i <= n; i++) {
    fast = fast!.next;
  }
  // 同时前进，fast 到末尾时 slow.next 就是倒数第 n 个
  while (fast !== null) {
    fast = fast.next;
    slow = slow!.next;
  }
  slow!.next = slow!.next!.next;
  return dummy.next;
}

// ============================================================
// 5. 合并两个有序链表
// ============================================================
// LeetCode 21. Merge Two Sorted Lists
// 将两个升序链表合并为一个新的升序链表并返回
// 时间复杂度：O(n + m)，空间复杂度：O(1)

// 方法1：迭代法（推荐）
function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  const dummy = new ListNode(0);
  let curr = dummy;
  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      curr.next = list1;
      list1 = list1.next;
    } else {
      curr.next = list2;
      list2 = list2.next;
    }
    curr = curr.next;
  }
  curr.next = list1 !== null ? list1 : list2;
  return dummy.next;
}

// 方法2：递归法
function mergeTwoListsRecursive(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  if (list1 === null) return list2;
  if (list2 === null) return list1;
  if (list1.val <= list2.val) {
    list1.next = mergeTwoListsRecursive(list1.next, list2);
    return list1;
  } else {
    list2.next = mergeTwoListsRecursive(list1, list2.next);
    return list2;
  }
}

// 合并 K 个有序链表
// LeetCode 23. Merge k Sorted Lists
// 时间复杂度：O(N log k)，N 为所有节点总数，k 为链表数
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  if (lists.length === 0) return null;

  // 分治合并
  const merge = (
    lists: Array<ListNode | null>,
    left: number,
    right: number
  ): ListNode | null => {
    if (left === right) return lists[left];
    const mid = Math.floor((left + right) / 2);
    const l = merge(lists, left, mid);
    const r = merge(lists, mid + 1, right);
    return mergeTwoLists(l, r);
  };

  return merge(lists, 0, lists.length - 1);
}

// ============================================================
// 6. 删除链表中重复的元素
// ============================================================
// LeetCode 83. Remove Duplicates from Sorted List
// 给定排序链表，删除所有重复元素使每个元素只出现一次
// 时间复杂度：O(n)，空间复杂度：O(1)

function deleteDuplicates(head: ListNode | null): ListNode | null {
  let curr: ListNode | null = head;
  while (curr !== null && curr.next !== null) {
    if (curr.val === curr.next.val) {
      curr.next = curr.next.next; // 跳过重复节点
    } else {
      curr = curr.next;
    }
  }
  return head;
}

// LeetCode 82. Remove Duplicates from Sorted List II
// 给定排序链表，删除所有有重复的节点，只保留不重复的节点
// 时间复杂度：O(n)，空间复杂度：O(1)
function deleteDuplicatesII(head: ListNode | null): ListNode | null {
  const dummy = new ListNode(0, head);
  let curr: ListNode | null = dummy;
  while (curr !== null && curr.next !== null && curr.next.next !== null) {
    if (curr.next.val === curr.next.next.val) {
      const val = curr.next.val;
      // 跳过所有值等于 val 的节点
      while (curr.next !== null && curr.next.val === val) {
        curr.next = curr.next.next;
      }
    } else {
      curr = curr.next;
    }
  }
  return dummy.next;
}

// ============================================================
// 7. 找到链表中的倒数第 k 个节点
// ============================================================
// 剑指 Offer 22. 链表中倒数第k个节点
// 快慢指针：fast 先走 k 步，然后 slow 和 fast 同步前进
// 时间复杂度：O(n)，空间复杂度：O(1)

function getKthFromEnd(head: ListNode | null, k: number): ListNode | null {
  let fast: ListNode | null = head;
  let slow: ListNode | null = head;
  for (let i = 0; i < k; i++) {
    if (fast === null) return null; // k 大于链表长度
    fast = fast.next;
  }
  while (fast !== null) {
    fast = fast.next;
    slow = slow!.next;
  }
  return slow;
}

// ============================================================
// 8. 实现两个链表的相加
// ============================================================
// LeetCode 2. Add Two Numbers
// 两个非空链表表示两个非负整数（逆序存储），返回它们和的链表
// 例如：2 -> 4 -> 3 + 5 -> 6 -> 4 = 7 -> 0 -> 8 (342 + 465 = 807)
// 时间复杂度：O(max(m, n))，空间复杂度：O(max(m, n))

function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  const dummy = new ListNode(0);
  let curr = dummy;
  let carry = 0;
  while (l1 !== null || l2 !== null || carry !== 0) {
    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    carry = Math.floor(sum / 10);
    curr.next = new ListNode(sum % 10);
    curr = curr.next;
    l1 = l1 ? l1.next : null;
    l2 = l2 ? l2.next : null;
  }
  return dummy.next;
}

// LeetCode 445. Add Two Numbers II
// 链表正序存储的相加（不允许反转链表的情况下用栈）
// 时间复杂度：O(m + n)，空间复杂度：O(m + n)
function addTwoNumbersII(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  const stack1: number[] = [];
  const stack2: number[] = [];
  while (l1 !== null) {
    stack1.push(l1.val);
    l1 = l1.next;
  }
  while (l2 !== null) {
    stack2.push(l2.val);
    l2 = l2.next;
  }
  let carry = 0;
  let result: ListNode | null = null;
  while (stack1.length > 0 || stack2.length > 0 || carry !== 0) {
    const sum =
      (stack1.length > 0 ? stack1.pop()! : 0) +
      (stack2.length > 0 ? stack2.pop()! : 0) +
      carry;
    carry = Math.floor(sum / 10);
    const node = new ListNode(sum % 10);
    node.next = result; // 头插法构建结果链表
    result = node;
  }
  return result;
}

// ============================================================
// 9. 排序链表
// ============================================================
// LeetCode 148. Sort List
// 给定链表头节点，按升序排列并返回排序后的链表
// 要求：O(n log n) 时间复杂度和 O(1) 空间复杂度

// 方法1：归并排序（自顶向下，递归）- 空间 O(log n)
function sortList(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return head;
  // 找到中间节点并断开
  const mid = middleNodeFirst(head)!;
  const rightHead = mid.next;
  mid.next = null;
  // 递归排序左右两半
  const left = sortList(head);
  const right = sortList(rightHead);
  // 合并
  return mergeTwoLists(left, right);
}

// 方法2：归并排序（自底向上，迭代）- 空间 O(1)
function sortListBottomUp(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return head;

  // 计算链表长度
  let length = 0;
  let curr: ListNode | null = head;
  while (curr !== null) {
    length++;
    curr = curr.next;
  }

  const dummy = new ListNode(0, head);

  // 步长从 1 开始倍增
  for (let step = 1; step < length; step *= 2) {
    let tail = dummy;
    curr = dummy.next;
    while (curr !== null) {
      // 切割出第一段（长度 step）
      let left: ListNode | null = curr;
      let right: ListNode | null = null;
      let prev: ListNode | null = null;
      for (let i = 0; i < step && curr !== null; i++) {
        prev = curr;
        curr = curr.next;
      }
      if (prev) prev.next = null;

      // 切割出第二段（长度 step）
      right = curr;
      for (let i = 0; i < step && curr !== null; i++) {
        prev = curr;
        curr = curr.next;
      }
      if (prev) prev.next = null;

      // 合并两段并连接到 tail
      const merged = mergeTwoLists(left, right);
      let mCurr: ListNode | null = merged;
      while (mCurr !== null) {
        tail.next = mCurr;
        tail = mCurr;
        mCurr = mCurr.next;
      }
    }
    tail.next = null;
  }
  return dummy.next;
}

// ============================================================
// 10. 反转链表的部分节点
// ============================================================
// LeetCode 92. Reverse Linked List II
// 给定头节点、left 和 right，反转从位置 left 到 right 的链表节点
// 时间复杂度：O(n)，空间复杂度：O(1)

function reverseBetween(
  head: ListNode | null,
  left: number,
  right: number
): ListNode | null {
  const dummy = new ListNode(0, head);
  // 找到 left 的前驱节点
  let pre = dummy;
  for (let i = 1; i < left; i++) {
    pre = pre.next!;
  }
  // curr 指向 left 位置的节点
  let curr = pre.next;
  // 头插法逐个反转
  for (let i = left; i < right; i++) {
    const next = curr!.next;
    curr!.next = next!.next;
    next!.next = pre.next;
    pre.next = next;
  }
  return dummy.next;
}

// K 个一组反转链表
// LeetCode 25. Reverse Nodes in k-Group
// 时间复杂度：O(n)，空间复杂度：O(1)
function reverseKGroup(
  head: ListNode | null,
  k: number
): ListNode | null {
  // 检查剩余节点是否够 k 个
  const checkRemaining = (node: ListNode | null, k: number): boolean => {
    let count = 0;
    while (node !== null && count < k) {
      node = node.next;
      count++;
    }
    return count >= k;
  };

  if (!checkRemaining(head, k)) return head;

  const dummy = new ListNode(0, head);
  let prev = dummy;

  while (checkRemaining(prev.next, k)) {
    let curr = prev.next;
    for (let i = 1; i < k; i++) {
      const next = curr!.next;
      curr!.next = next!.next;
      next!.next = prev.next;
      prev.next = next;
    }
    prev = curr!;
  }
  return dummy.next;
}

// ============================================================
// 11. 旋转链表
// ============================================================
// LeetCode 61. Rotate List
// 给定链表，将链表每个节点向右移动 k 个位置
// 时间复杂度：O(n)，空间复杂度：O(1)

function rotateRight(head: ListNode | null, k: number): ListNode | null {
  if (head === null || head.next === null || k === 0) return head;

  // 计算链表长度
  let length = 1;
  let tail = head;
  while (tail.next !== null) {
    tail = tail.next;
    length++;
  }

  // 等效旋转次数
  k = k % length;
  if (k === 0) return head;

  // 找到新的尾节点（倒数第 k+1 个节点）
  let newTail: ListNode | null = head;
  for (let i = 1; i < length - k; i++) {
    newTail = newTail!.next;
  }

  // 重新连接
  const newHead = newTail!.next;
  newTail!.next = null;
  tail.next = head;
  return newHead;
}

// ============================================================
// 12. 复制带有随机指针的链表
// ============================================================
// LeetCode 138. Copy List with Random Pointer
// 给定带有随机指针的链表，返回它的深拷贝
// 时间复杂度：O(n)，空间复杂度：O(1)（原地方法）

// 方法1：原地复制插入法（推荐）
function copyRandomList(
  head: RandomListNode | null
): RandomListNode | null {
  if (head === null) return null;

  // 第一步：在每个原节点后插入复制节点
  // A -> B -> C  =>  A -> A' -> B -> B' -> C -> C'
  let curr: RandomListNode | null = head;
  while (curr !== null) {
    const copy: RandomListNode = new RandomListNode(curr.val);
    copy.next = curr.next;
    curr.next = copy;
    curr = copy.next;
  }

  // 第二步：设置复制节点的 random 指针
  curr = head;
  while (curr !== null) {
    if (curr.random !== null) {
      curr.next!.random = curr.random.next; // 原节点 random 的下一个就是复制节点
    }
    curr = curr.next!.next;
  }

  // 第三步：拆分链表
  curr = head;
  const copyHead = head.next;
  while (curr !== null) {
    const copy: RandomListNode = curr.next!;
    curr.next = copy.next;
    curr = curr.next;
    if (curr !== null) {
      copy.next = curr.next;
    }
  }
  return copyHead;
}

// 方法2：HashMap 映射法
function copyRandomListMap(
  head: RandomListNode | null
): RandomListNode | null {
  if (head === null) return null;
  const map = new Map<RandomListNode, RandomListNode>();

  // 第一遍：创建所有复制节点并建立映射
  let curr: RandomListNode | null = head;
  while (curr !== null) {
    map.set(curr, new RandomListNode(curr.val));
    curr = curr.next;
  }

  // 第二遍：设置 next 和 random 指针
  curr = head;
  while (curr !== null) {
    const copy = map.get(curr)!;
    copy.next = curr.next ? map.get(curr.next)! : null;
    copy.random = curr.random ? map.get(curr.random)! : null;
    curr = curr.next;
  }
  return map.get(head)!;
}

// ============================================================
// 13. 分割链表
// ============================================================
// LeetCode 86. Partition List
// 给定链表和值 x，将所有小于 x 的节点放到大于等于 x 的节点之前，保持原有相对顺序
// 时间复杂度：O(n)，空间复杂度：O(1)

function partition(head: ListNode | null, x: number): ListNode | null {
  // 两条子链表：small 存小于 x 的，large 存大于等于 x 的
  const smallDummy = new ListNode(0);
  const largeDummy = new ListNode(0);
  let small = smallDummy;
  let large = largeDummy;

  let curr: ListNode | null = head;
  while (curr !== null) {
    if (curr.val < x) {
      small.next = curr;
      small = small.next;
    } else {
      large.next = curr;
      large = large.next;
    }
    curr = curr.next;
  }

  // 连接两条链表
  large.next = null; // 防止环
  small.next = largeDummy.next;
  return smallDummy.next;
}

// LeetCode 725. Split Linked List in Parts
// 将链表分成 k 个连续的部分，前面部分的长度 >= 后面部分的长度
// 时间复杂度：O(n)，空间复杂度：O(k)
function splitListToParts(
  head: ListNode | null,
  k: number
): Array<ListNode | null> {
  // 计算链表总长度
  let length = 0;
  let curr: ListNode | null = head;
  while (curr !== null) {
    length++;
    curr = curr.next;
  }

  const baseSize = Math.floor(length / k);
  const extra = length % k; // 前 extra 个部分各多 1 个节点

  const result: Array<ListNode | null> = [];
  curr = head;
  for (let i = 0; i < k; i++) {
    const partSize = baseSize + (i < extra ? 1 : 0);
    if (partSize === 0) {
      result.push(null);
    } else {
      result.push(curr);
      for (let j = 0; j < partSize - 1; j++) {
        curr = curr!.next;
      }
      const next = curr!.next;
      curr!.next = null;
      curr = next;
    }
  }
  return result;
}

// ============================================================
// 14. LRU 缓存
// ============================================================
// LeetCode 146. LRU Cache
// 设计 LRU（最近最少使用）缓存结构，支持 get 和 put 操作
// get(key)：O(1) 时间复杂度
// put(key, value)：O(1) 时间复杂度

// 双向链表节点
class DLinkedNode {
  key: number;
  value: number;
  prev: DLinkedNode | null;
  next: DLinkedNode | null;
  constructor(key: number = 0, value: number = 0) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  private capacity: number;
  private size: number;
  private cache: Map<number, DLinkedNode>;
  private head: DLinkedNode; // 虚拟头节点（最近使用）
  private tail: DLinkedNode; // 虚拟尾节点（最久未使用）

  constructor(capacity: number) {
    this.capacity = capacity;
    this.size = 0;
    this.cache = new Map();
    this.head = new DLinkedNode();
    this.tail = new DLinkedNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    const node = this.cache.get(key);
    if (!node) return -1;
    // 访问后移到头部（标记为最近使用）
    this.moveToHead(node);
    return node.value;
  }

  put(key: number, value: number): void {
    const node = this.cache.get(key);
    if (node) {
      // 已存在，更新值并移到头部
      node.value = value;
      this.moveToHead(node);
    } else {
      // 新节点
      const newNode = new DLinkedNode(key, value);
      this.cache.set(key, newNode);
      this.addToHead(newNode);
      this.size++;
      // 超出容量，移除尾节点（最久未使用）
      if (this.size > this.capacity) {
        const removed = this.removeTail();
        this.cache.delete(removed.key);
        this.size--;
      }
    }
  }

  // 添加到头部
  private addToHead(node: DLinkedNode): void {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  // 移除节点
  private removeNode(node: DLinkedNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  // 移到头部
  private moveToHead(node: DLinkedNode): void {
    this.removeNode(node);
    this.addToHead(node);
  }

  // 移除尾部节点
  private removeTail(): DLinkedNode {
    const node = this.tail.prev!;
    this.removeNode(node);
    return node;
  }
}

// ============================================================
// 辅助工具函数
// ============================================================

// 从数组创建链表
function createList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy = new ListNode(0);
  let curr = dummy;
  for (const val of arr) {
    curr.next = new ListNode(val);
    curr = curr.next;
  }
  return dummy.next;
}

// 链表转数组（方便打印/验证）
function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let curr: ListNode | null = head;
  while (curr !== null) {
    result.push(curr.val);
    curr = curr.next;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
function testLinkedList(): void {
  console.log("=== 链表面试题测试 ===\n");

  // 1. 反转链表
  console.log("1. 反转链表");
  const list1 = createList([1, 2, 3, 4, 5]);
  console.log("  原链表:", listToArray(list1));
  const reversed = reverseList(list1);
  console.log("  反转后:", listToArray(reversed));

  // 2. 判断是否有环
  console.log("\n2. 判断链表是否有环");
  const cyclicList = createList([1, 2, 3, 4]);
  const tailNode = cyclicList;
  let temp: ListNode | null = cyclicList;
  while (temp !== null && temp.next !== null) temp = temp.next;
  // temp!.next = tailNode!.next; // 制造环（注释掉避免无限循环）
  const noCycleList = createList([1, 2, 3, 4]);
  console.log("  无环链表:", hasCycle(noCycleList));
  console.log("  有环链表: (需要手动构造环测试)");

  // 3. 寻找中间节点
  console.log("\n3. 寻找中间节点");
  const list3 = createList([1, 2, 3, 4, 5]);
  console.log("  链表:", listToArray(list3));
  console.log("  中间节点值:", middleNode(list3)?.val);

  // 4. 删除节点
  console.log("\n4. 删除链表中值为指定值的节点");
  const list4 = createList([1, 2, 6, 3, 4, 5, 6]);
  console.log("  原链表:", [1, 2, 6, 3, 4, 5, 6]);
  console.log("  删除值6后:", listToArray(removeElements(list4, 6)));

  // 5. 合并两个有序链表
  console.log("\n5. 合并两个有序链表");
  const list5a = createList([1, 2, 4]);
  const list5b = createList([1, 3, 4]);
  console.log("  链表1:", [1, 2, 4]);
  console.log("  链表2:", [1, 3, 4]);
  console.log("  合并后:", listToArray(mergeTwoLists(list5a, list5b)));

  // 6. 删除重复元素
  console.log("\n6. 删除排序链表中的重复元素");
  const list6 = createList([1, 1, 2, 3, 3]);
  console.log("  原链表:", [1, 1, 2, 3, 3]);
  console.log("  去重后:", listToArray(deleteDuplicates(list6)));

  // 7. 倒数第 k 个节点
  console.log("\n7. 倒数第 k 个节点");
  const list7 = createList([1, 2, 3, 4, 5]);
  console.log("  链表:", [1, 2, 3, 4, 5]);
  console.log("  倒数第2个节点值:", getKthFromEnd(list7, 2)?.val);

  // 8. 两个链表相加
  console.log("\n8. 两个链表相加");
  const list8a = createList([2, 4, 3]);
  const list8b = createList([5, 6, 4]);
  console.log("  342 + 465 = 807");
  console.log("  结果:", listToArray(addTwoNumbers(list8a, list8b)));

  // 9. 排序链表
  console.log("\n9. 排序链表");
  const list9 = createList([4, 2, 1, 3]);
  console.log("  原链表:", [4, 2, 1, 3]);
  console.log("  排序后:", listToArray(sortList(list9)));

  // 10. 反转部分链表
  console.log("\n10. 反转部分链表");
  const list10 = createList([1, 2, 3, 4, 5]);
  console.log("  原链表:", [1, 2, 3, 4, 5]);
  console.log("  反转位置2-4:", listToArray(reverseBetween(list10, 2, 4)));

  // 11. 旋转链表
  console.log("\n11. 旋转链表");
  const list11 = createList([1, 2, 3, 4, 5]);
  console.log("  原链表:", [1, 2, 3, 4, 5]);
  console.log("  右旋2位:", listToArray(rotateRight(list11, 2)));

  // 13. 分割链表
  console.log("\n13. 分割链表");
  const list13 = createList([1, 4, 3, 2, 5, 2]);
  console.log("  原链表:", [1, 4, 3, 2, 5, 2]);
  console.log("  以3为界分割:", listToArray(partition(list13, 3)));

  // 14. LRU 缓存
  console.log("\n14. LRU 缓存");
  const lru = new LRUCache(2);
  lru.put(1, 1);
  lru.put(2, 2);
  console.log("  get(1):", lru.get(1)); // 返回 1
  lru.put(3, 3); // 淘汰 key=2
  console.log("  get(2):", lru.get(2)); // 返回 -1（已淘汰）
  lru.put(4, 4); // 淘汰 key=1
  console.log("  get(1):", lru.get(1)); // 返回 -1（已淘汰）
  console.log("  get(3):", lru.get(3)); // 返回 3
  console.log("  get(4):", lru.get(4)); // 返回 4
}

// 运行测试
testLinkedList();

export {};
