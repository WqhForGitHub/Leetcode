// ============================================================
// 051. 逆序打印不可变链表
// ============================================================
// LeetCode 1265. Print Immutable Linked List in Reverse
// 给定一个不可变链表，逆序打印每个节点的值。不可直接访问节点内部数据，
// 只能用 printValue 和 getNext 接口。
// 时间复杂度：O(n)，空间复杂度：O(n)（递归栈或显式栈）

// 不可变链表节点接口
interface ImmutableListNode {
  printValue(): void;
  getNext(): ImmutableListNode | null;
}

// 具体实现类（用于测试）
class ImmutableLinkedListNode implements ImmutableListNode {
  private _val: number;
  private _next: ImmutableListNode | null;
  constructor(val: number, next: ImmutableListNode | null = null) {
    this._val = val;
    this._next = next;
  }
  printValue(): void {
    console.log(this._val);
  }
  getNext(): ImmutableListNode | null {
    return this._next;
  }
}

// 方法1：递归。先递归到链表末尾，返回时再打印当前节点。
function printLinkedListInReverse(head: ImmutableListNode | null): void {
  if (head === null) return;
  printLinkedListInReverse(head.getNext());
  head.printValue();
}

// 方法2：显式栈。先遍历入栈，再依次出栈打印。
function printLinkedListInReverseStack(head: ImmutableListNode | null): void {
  const stack: ImmutableListNode[] = [];
  let cur = head;
  while (cur !== null) {
    stack.push(cur);
    cur = cur.getNext();
  }
  while (stack.length > 0) {
    stack.pop()!.printValue();
  }
}

// 测试
(function test() {
  // 构造链表 1 -> 2 -> 3 -> 4
  const n4 = new ImmutableLinkedListNode(4);
  const n3 = new ImmutableLinkedListNode(3, n4);
  const n2 = new ImmutableLinkedListNode(2, n3);
  const n1 = new ImmutableLinkedListNode(1, n2);
  console.log("递归法:");
  printLinkedListInReverse(n1); // 4 3 2 1
  console.log("栈方法:");
  printLinkedListInReverseStack(n1); // 4 3 2 1
})();

export {};
