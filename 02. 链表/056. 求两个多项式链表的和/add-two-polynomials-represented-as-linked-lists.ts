// ============================================================
// 056. 求两个多项式链表的和
// ============================================================
// LeetCode [Premium] Add Two Polynomials Represented as Linked Lists
// 多项式链表按幂次降序排列，每个节点含 coefficient(系数) 和 power(幂次)。
// 将两个多项式相加，返回结果链表（幂次降序，系数为 0 的项不保留）。
// 时间复杂度：O(n + m)，空间复杂度：O(n + m)

// 多项式节点定义
class PolyNode {
  coefficient: number;
  power: number;
  next: PolyNode | null;
  constructor(coefficient: number = 0, power: number = 0, next: PolyNode | null = null) {
    this.coefficient = coefficient;
    this.power = power;
    this.next = next;
  }
}

// 辅助：数组转多项式链表，数组元素为 [coefficient, power]
function arrayToPoly(arr: [number, number][]): PolyNode | null {
  const dummy = new PolyNode();
  let tail = dummy;
  for (const [c, p] of arr) {
    tail.next = new PolyNode(c, p);
    tail = tail.next;
  }
  return dummy.next;
}

// 辅助：多项式链表转数组
function polyToArray(head: PolyNode | null): [number, number][] {
  const res: [number, number][] = [];
  let cur = head;
  while (cur !== null) {
    res.push([cur.coefficient, cur.power]);
    cur = cur.next;
  }
  return res;
}

// 方法1：合并有序链表思路
// 相同幂次：系数相加（为 0 则跳过）；不同幂次：取幂次较大者。
function addPoly(poly1: PolyNode | null, poly2: PolyNode | null): PolyNode | null {
  const dummy = new PolyNode();
  let tail = dummy;
  let p1 = poly1;
  let p2 = poly2;
  while (p1 !== null && p2 !== null) {
    if (p1.power > p2.power) {
      tail.next = new PolyNode(p1.coefficient, p1.power);
      tail = tail.next;
      p1 = p1.next;
    } else if (p1.power < p2.power) {
      tail.next = new PolyNode(p2.coefficient, p2.power);
      tail = tail.next;
      p2 = p2.next;
    } else {
      // 幂次相同，系数相加
      const coeff = p1.coefficient + p2.coefficient;
      if (coeff !== 0) {
        tail.next = new PolyNode(coeff, p1.power);
        tail = tail.next;
      }
      p1 = p1.next;
      p2 = p2.next;
    }
  }
  // 拼接剩余部分
  while (p1 !== null) {
    tail.next = new PolyNode(p1.coefficient, p1.power);
    tail = tail.next;
    p1 = p1.next;
  }
  while (p2 !== null) {
    tail.next = new PolyNode(p2.coefficient, p2.power);
    tail = tail.next;
    p2 = p2.next;
  }
  return dummy.next;
}

// 测试
(function test() {
  // (1x^1 + 1) + (1x^2) = 1x^2 + 1x^1 + 1
  console.log(
    polyToArray(
      addPoly(
        arrayToPoly([
          [1, 1],
          [1, 0],
        ]),
        arrayToPoly([[1, 2]])
      )
    )
  ); // [[1,2],[1,1],[1,0]]
  // (2x^2 + 4x^1 + 3) + (3x^2 + -4x^1 + 1) = 5x^2 + 4
  console.log(
    polyToArray(
      addPoly(
        arrayToPoly([
          [2, 2],
          [4, 1],
          [3, 0],
        ]),
        arrayToPoly([
          [3, 2],
          [-4, 1],
          [1, 0],
        ])
      )
    )
  ); // [[5,2],[4,0]]
})();

export {};
