// ============================================================
// 081. 移除最小数对使数组有序 I
// ============================================================
// 给定一个数组，每次操作找出和最小的相邻数对并删除（删除这两个相邻元素），
// 重复此操作直到数组非递减有序。返回最少的删除次数（即操作次数）。
// 用链表模拟：反复找出和最小的相邻对删除，直到数组有序。
// 时间复杂度：O(n^2)，空间复杂度：O(n)

// 链表节点定义（用于数组模拟）
class ListNode {
  val: number;
  next: ListNode | null;
  prev: ListNode | null;
  constructor(val?: number) {
    this.val = val === undefined ? 0 : val;
    this.next = null;
    this.prev = null;
  }
}

// 辅助函数：数组转双向链表，返回头节点
function arrayToDoublyList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy = new ListNode();
  let cur = dummy;
  for (const v of arr) {
    const node = new ListNode(v);
    node.prev = cur;
    cur.next = node;
    cur = node;
  }
  const head = dummy.next;
  if (head !== null) head.prev = null;
  return head;
}

// 辅助函数：检查链表是否非递减有序
function isNonDecreasing(head: ListNode | null): boolean {
  let cur = head;
  while (cur !== null && cur.next !== null) {
    if (cur.val > cur.next.val) return false;
    cur = cur.next;
  }
  return true;
}

// ============================================================
// 方法1：链表模拟，每次找和最小的相邻对删除（推荐）
// ============================================================
// 思路：
//   1. 把数组建成双向链表（便于 O(1) 删除相邻对）
//   2. 每次遍历链表找到和最小的相邻对，删除这两个节点
//   3. 重复直到链表非递减有序，统计删除次数
// 注意：当存在多个和相同的相邻对时，删任意一个均可，
//   这里选择第一个遇到的和最小的相邻对。
// 时间复杂度 O(n^2)，空间复杂度 O(n)
function minimumOperationsToMakeSorted(arr: number[]): number {
  let head = arrayToDoublyList(arr);
  let operations = 0;

  // 反复操作直到有序
  while (head !== null && !isNonDecreasing(head)) {
    // 遍历找到和最小的相邻对
    let minSum = Infinity;
    let target: ListNode | null = null; // 记录相邻对中的前一个节点
    let cur = head;
    while (cur !== null && cur.next !== null) {
      const sum = cur.val + cur.next.val;
      if (sum < minSum) {
        minSum = sum;
        target = cur;
      }
      cur = cur.next;
    }

    if (target === null) break; // 没有相邻对可删

    // 删除 target 和 target.next 两个节点
    const prevNode = target.prev;
    const nextNode = target.next!.next;

    if (prevNode !== null) {
      prevNode.next = nextNode;
    } else {
      // 删除的是头两个节点，更新 head
      head = nextNode;
    }
    if (nextNode !== null) {
      nextNode.prev = prevNode;
    }

    operations++;
  }

  return operations;
}

// ============================================================
// 方法2：直接基于数组模拟（每次重建数组）
// ============================================================
// 思路：每次在数组中找和最小的相邻对，splice 删除，再检查有序性。
// 实现简单但效率较低，便于对照验证。
// 时间复杂度 O(n^2)，空间复杂度 O(n)
function minimumOperationsToMakeSortedArray(arr: number[]): number {
  const a = arr.slice();
  let operations = 0;

  // 检查是否非递减
  const sorted = (xs: number[]): boolean => {
    for (let i = 0; i + 1 < xs.length; i++) {
      if (xs[i] > xs[i + 1]) return false;
    }
    return true;
  };

  while (a.length >= 2 && !sorted(a)) {
    // 找和最小的相邻对
    let minSum = Infinity;
    let idx = 0;
    for (let i = 0; i + 1 < a.length; i++) {
      const sum = a[i] + a[i + 1];
      if (sum < minSum) {
        minSum = sum;
        idx = i;
      }
    }
    // 删除相邻对
    a.splice(idx, 2);
    operations++;
  }

  return operations;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 081. 移除最小数对使数组有序 I =====");

// 测试1：[1,2,3] 已有序 -> 0
console.log("方法1 [1,2,3]:", minimumOperationsToMakeSorted([1, 2, 3])); // 0
// 测试2：[2,1] -> 删除 [2,1] -> []（空数组视为有序） -> 1
console.log("方法1 [2,1]:", minimumOperationsToMakeSorted([2, 1])); // 1
// 测试3：[3,1,2] -> 相邻对: (3,1)=4, (1,2)=3，删(1,2) -> [3] 有序 -> 1
console.log("方法1 [3,1,2]:", minimumOperationsToMakeSorted([3, 1, 2])); // 1
// 测试4：[5,3,1] -> 相邻对: (5,3)=8, (3,1)=4，删(3,1) -> [5] 有序 -> 1
console.log("方法1 [5,3,1]:", minimumOperationsToMakeSorted([5, 3, 1])); // 1

// 方法2 对照测试
console.log("方法2 [1,2,3]:", minimumOperationsToMakeSortedArray([1, 2, 3])); // 0
console.log("方法2 [2,1]:", minimumOperationsToMakeSortedArray([2, 1])); // 1
console.log("方法2 [3,1,2]:", minimumOperationsToMakeSortedArray([3, 1, 2])); // 1
console.log("方法2 [5,3,1]:", minimumOperationsToMakeSortedArray([5, 3, 1])); // 1

export {};
