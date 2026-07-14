// ============================================================
// 082. 移除最小数对使数组有序 II
// ============================================================
// 与 081 相同的问题：每次操作找出和最小的相邻数对并删除，
// 重复此操作直到数组非递减有序，返回最少删除次数。
// 方法2：用优先队列（最小堆）存储所有相邻对的和，
//   每次取最小和的相邻对删除，并更新相邻关系，检查是否有序。更高效。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 链表节点定义（双向链表，便于 O(1) 删除）
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

// 辅助函数：数组转双向链表
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
// 最小堆实现（按 sum 排序，相同 sum 按 id 排序保证稳定）
// ============================================================
class MinHeap {
  // 每个元素：[sum, id, nodeRef]
  private data: [number, number, ListNode][] = [];

  get size(): number {
    return this.data.length;
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  push(item: [number, number, ListNode]): void {
    this.data.push(item);
    this.siftUp(this.data.length - 1);
  }

  pop(): [number, number, ListNode] | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(this.data[i], this.data[parent]) < 0) {
        this.swap(i, parent);
        i = parent;
      } else {
        break;
      }
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && this.compare(this.data[left], this.data[smallest]) < 0) {
        smallest = left;
      }
      if (right < n && this.compare(this.data[right], this.data[smallest]) < 0) {
        smallest = right;
      }
      if (smallest !== i) {
        this.swap(i, smallest);
        i = smallest;
      } else {
        break;
      }
    }
  }

  private compare(a: [number, number, ListNode], b: [number, number, ListNode]): number {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1]; // 用 id 保证稳定与去重判断
  }

  private swap(i: number, j: number): void {
    [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
  }
}

// ============================================================
// 方法：最小堆 + 双向链表
// ============================================================
// 思路：
//   1. 建立双向链表，并为每个节点分配唯一 id（用于堆中去重）
//   2. 初始把所有相邻对 (sum, id, 节点) 入堆，id 取相邻对前节点的 id
//   3. 每次从堆顶取最小和相邻对：
//        - 校验该堆项是否仍有效（节点未被删除、next 仍指向原后继）
//        - 若有效则删除这两个节点，并把新产生的相邻对入堆
//   4. 删除后检查链表是否有序，有序则结束
//   5. 同时借助一个 deleted 标记集合避免使用已删除节点
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function minimumOperationsToMakeSorted(arr: number[]): number {
  if (arr.length === 0) return 0;
  let head = arrayToDoublyList(arr);
  if (isNonDecreasing(head)) return 0;

  // 给每个节点分配 id
  let idCounter = 0;
  const nodeIds = new WeakMap<ListNode, number>();
  let cur = head;
  while (cur !== null) {
    nodeIds.set(cur, idCounter++);
    cur = cur.next;
  }

  // 用 WeakSet 标记已删除节点
  const deleted = new WeakSet<ListNode>();

  // 初始把所有相邻对入堆
  const heap = new MinHeap();
  cur = head;
  while (cur !== null && cur.next !== null) {
    const sum = cur.val + cur.next.val;
    heap.push([sum, nodeIds.get(cur)!, cur]);
    cur = cur.next;
  }

  let operations = 0;
  while (!heap.isEmpty()) {
    const top = heap.pop();
    if (top === undefined) break;
    const [_, id, node] = top;

    // 校验该堆项是否仍有效：
    // - 节点未被删除
    // - 节点仍有 next（相邻对还存在）
    if (deleted.has(node)) continue;
    if (node.next === null || deleted.has(node.next)) continue;
    // 校验 id 仍对应此相邻对的前节点（避免旧堆项误用）
    if (nodeIds.get(node) !== id) continue;

    // 删除 node 与 node.next
    const prevNode = node.prev;
    const nextNode = node.next.next;
    deleted.add(node);
    deleted.add(node.next);

    if (prevNode !== null) {
      prevNode.next = nextNode;
    } else {
      head = nextNode;
    }
    if (nextNode !== null) {
      nextNode.prev = prevNode;
    }

    operations++;

    // 新产生的相邻对入堆：prevNode <-> nextNode
    if (prevNode !== null && nextNode !== null && !deleted.has(prevNode)) {
      const sum = prevNode.val + nextNode.val;
      heap.push([sum, nodeIds.get(prevNode)!, prevNode]);
    }

    // 每次删除后检查是否已有序，提前结束
    if (isNonDecreasing(head)) break;
  }

  return operations;
}

// ============================================================
// 方法2（对照）：数组模拟实现，便于验证结果正确性
// ============================================================
function minimumOperationsToMakeSortedArray(arr: number[]): number {
  const a = arr.slice();
  let operations = 0;

  const sorted = (xs: number[]): boolean => {
    for (let i = 0; i + 1 < xs.length; i++) {
      if (xs[i] > xs[i + 1]) return false;
    }
    return true;
  };

  while (a.length >= 2 && !sorted(a)) {
    let minSum = Infinity;
    let idx = 0;
    for (let i = 0; i + 1 < a.length; i++) {
      const sum = a[i] + a[i + 1];
      if (sum < minSum) {
        minSum = sum;
        idx = i;
      }
    }
    a.splice(idx, 2);
    operations++;
  }

  return operations;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 082. 移除最小数对使数组有序 II =====");

// 已有序 -> 0
console.log("方法1 [1,2,3]:", minimumOperationsToMakeSorted([1, 2, 3])); // 0
// [2,1] -> 删 (2,1) -> [] 有序 -> 1
console.log("方法1 [2,1]:", minimumOperationsToMakeSorted([2, 1])); // 1
// [3,1,2] -> 相邻对: (3,1)=4, (1,2)=3 -> 删 (1,2) -> [3] 有序 -> 1
console.log("方法1 [3,1,2]:", minimumOperationsToMakeSorted([3, 1, 2])); // 1
// [5,3,1] -> 相邻对: (5,3)=8, (3,1)=4 -> 删 (3,1) -> [5] 有序 -> 1
console.log("方法1 [5,3,1]:", minimumOperationsToMakeSorted([5, 3, 1])); // 1

// 对照测试
console.log("方法2 [1,2,3]:", minimumOperationsToMakeSortedArray([1, 2, 3])); // 0
console.log("方法2 [2,1]:", minimumOperationsToMakeSortedArray([2, 1])); // 1
console.log("方法2 [3,1,2]:", minimumOperationsToMakeSortedArray([3, 1, 2])); // 1
console.log("方法2 [5,3,1]:", minimumOperationsToMakeSortedArray([5, 3, 1])); // 1

export {};
