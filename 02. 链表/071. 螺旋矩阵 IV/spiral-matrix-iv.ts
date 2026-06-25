// ============================================================
// 071. 螺旋矩阵 IV
// ============================================================
// LeetCode 2326. Spiral Matrix IV
// 给定 m×n 矩阵和链表头，从矩阵 [0,0] 开始按螺旋顺序（右→下→左→上）填充链表节点值。
// 链表节点不足时填充 -1。
// 思路：模拟方向行走，越界或已填时转向。
// 时间复杂度：O(m*n)，空间复杂度：O(m*n)

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 数组转链表辅助函数
function arrayToList(arr: number[]): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy;
  for (const v of arr) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}

function spiralMatrix(m: number, n: number, head: ListNode | null): number[][] {
  // 初始化矩阵为 -1
  const matrix: number[][] = [];
  for (let i = 0; i < m; i++) {
    matrix.push(new Array<number>(n).fill(-1));
  }

  // 方向：右、下、左、上
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  let dir = 0;
  let row = 0;
  let col = 0;

  let curr = head;
  // 最多填 m*n 个节点
  while (curr !== null) {
    matrix[row][col] = curr.val;
    curr = curr.next;

    // 计算下一个位置
    const nextRow = row + dirs[dir][0];
    const nextCol = col + dirs[dir][1];
    // 越界或已填（非 -1）则转向
    if (
      nextRow < 0 ||
      nextRow >= m ||
      nextCol < 0 ||
      nextCol >= n ||
      matrix[nextRow][nextCol] !== -1
    ) {
      dir = (dir + 1) % 4;
    }
    row += dirs[dir][0];
    col += dirs[dir][1];
  }

  return matrix;
}

// ============================================================
// 测试
// ============================================================
function testSpiralMatrix(): void {
  // m=3, n=5, list=[3,0,2,6,8,1,7,9,4,2,5,5,0]
  const list1 = arrayToList([3, 0, 2, 6, 8, 1, 7, 9, 4, 2, 5, 5, 0]);
  console.log(spiralMatrix(3, 5, list1));
  // 预期 [[3,0,2,6,8],[5,0,-1,-1,1],[5,2,4,9,7]]

  // m=1, n=4, list=[0,1,2]
  const list2 = arrayToList([0, 1, 2]);
  console.log(spiralMatrix(1, 4, list2));
  // 预期 [[0,1,2,-1]]

  console.log("spiralMatrix 测试完成");
}

testSpiralMatrix();

export {};
