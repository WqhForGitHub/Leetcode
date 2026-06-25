// ============================================================
// 076. 链表游戏的获胜者
// ============================================================
// 链表游戏：给定一个链表，两名玩家 A 和 B 轮流从头取节点，
// A 先取第 1 个节点，B 取第 2 个，A 取第 3 个，以此类推。
// 比较各自取到的节点值之和，返回获胜者："A"、"B" 或 "Tie"（平局）。
// 遍历统计奇数位（玩家A）和偶数位（玩家B）的和，比较大小。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 辅助函数：数组转链表
function arrayToList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy = new ListNode();
  let cur = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}

// ============================================================
// 方法1：一次遍历，按位置奇偶性累加（推荐）
// ============================================================
// 思路：用 index 标记当前节点的位置（从 1 开始），
//   奇数位累加到 A 的得分，偶数位累加到 B 的得分，
//   最后比较两者大小。
// 时间复杂度 O(n)，空间复杂度 O(1)
function gameWinner(head: ListNode | null): string {
  let sumA = 0; // 玩家 A 的得分（奇数位）
  let sumB = 0; // 玩家 B 的得分（偶数位）
  let index = 1;
  let cur = head;

  while (cur !== null) {
    if (index % 2 === 1) {
      sumA += cur.val;
    } else {
      sumB += cur.val;
    }
    index++;
    cur = cur.next;
  }

  if (sumA > sumB) return "A";
  if (sumB > sumA) return "B";
  return "Tie";
}

// ============================================================
// 方法2：交替累加（用 flag 标记当前是否轮到 A）
// ============================================================
// 思路：用布尔标志 isATurn 表示当前是否为 A 的回合，
//   每取一个节点就切换标志，更直观地模拟取节点过程。
// 时间复杂度 O(n)，空间复杂度 O(1)
function gameWinnerFlag(head: ListNode | null): string {
  let sumA = 0;
  let sumB = 0;
  let isATurn = true; // A 先取
  let cur = head;

  while (cur !== null) {
    if (isATurn) {
      sumA += cur.val;
    } else {
      sumB += cur.val;
    }
    isATurn = !isATurn;
    cur = cur.next;
  }

  if (sumA > sumB) return "A";
  if (sumB > sumA) return "B";
  return "Tie";
}

// ============================================================
// 测试
// ============================================================
console.log("===== 076. 链表游戏的获胜者 =====");

// [1,2,3,4,5] -> A:1+3+5=9, B:2+4=6 -> A 胜
console.log("方法1 [1,2,3,4,5]:", gameWinner(arrayToList([1, 2, 3, 4, 5]))); // A
// [2,1,3,4] -> A:2+3=5, B:1+4=5 -> Tie
console.log("方法1 [2,1,3,4]:", gameWinner(arrayToList([2, 1, 3, 4]))); // Tie
// [1,5,2,5] -> A:1+2=3, B:5+5=10 -> B 胜
console.log("方法1 [1,5,2,5]:", gameWinner(arrayToList([1, 5, 2, 5]))); // B
// [4] -> A:4, B:0 -> A 胜
console.log("方法1 [4]:", gameWinner(arrayToList([4]))); // A

// 方法2 测试
console.log("方法2 [1,2,3,4,5]:", gameWinnerFlag(arrayToList([1, 2, 3, 4, 5]))); // A
console.log("方法2 [2,1,3,4]:", gameWinnerFlag(arrayToList([2, 1, 3, 4]))); // Tie
console.log("方法2 [1,5,2,5]:", gameWinnerFlag(arrayToList([1, 5, 2, 5]))); // B

export {};
