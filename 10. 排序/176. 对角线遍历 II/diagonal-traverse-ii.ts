// ============================================================
// 176. 对角线遍历 II
// ============================================================
// LeetCode 1424. Diagonal Traverse II
// 给定二维不规则数组 nums，按对角线（左下到右上）遍历所有元素，
// 同一对角线内从左下（行大）到右上（行小）依次输出。

// 方法1：按 row+col 分组 + 反转（O(N)）
// 同一对角线 row+col 相同。按行从小到大遍历入组，
// 输出时反转让行大的先出。
function findDiagonalOrder(nums: number[][]): number[] {
  const groups: Map<number, number[]> = new Map();
  let maxKey = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums[i].length; j++) {
      const key = i + j;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(nums[i][j]);
      if (key > maxKey) maxKey = key;
    }
  }
  const result: number[] = [];
  for (let k = 0; k <= maxKey; k++) {
    const arr = groups.get(k);
    if (!arr) continue;
    for (let i = arr.length - 1; i >= 0; i--) result.push(arr[i]);
  }
  return result;
}

// 方法2：BFS 按 row+col 顺序（O(N)）
// 从 (0,0) 出发，每次先把 (i+1,j) 入队（仅当 j=0 避免重复），
// 再把 (i,j+1) 入队，自然得到对角线顺序。
function findDiagonalOrder2(nums: number[][]): number[] {
  const result: number[] = [];
  const queue: Array<[number, number]> = [];
  let head = 0;
  queue.push([0, 0]);
  while (head < queue.length) {
    const [i, j] = queue[head++];
    result.push(nums[i][j]);
    if (j === 0 && i + 1 < nums.length) queue.push([i + 1, j]);
    if (j + 1 < nums[i].length) queue.push([i, j + 1]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 176. 对角线遍历 II =====");
console.log(
  "方法1 [[1,2,3],[4,5,6],[7,8,9]]:",
  JSON.stringify(
    findDiagonalOrder([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]),
  ),
); // [1,4,2,7,5,3,8,6,9]
console.log(
  "方法1 [[1,2,3,4,5],[6,7],[8],[9,10,11],[12,13,14,15,16]]:",
  JSON.stringify(
    findDiagonalOrder([[1, 2, 3, 4, 5], [6, 7], [8], [9, 10, 11], [12, 13, 14, 15, 16]]),
  ),
); // [1,6,2,8,7,3,9,4,12,10,5,13,11,14,15,16]
console.log(
  "方法2 [[1,2,3],[4,5,6],[7,8,9]]:",
  JSON.stringify(
    findDiagonalOrder2([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]),
  ),
); // [1,4,2,7,5,3,8,6,9]
console.log(
  "方法2 [[1,2,3],[4],[5,6,7],[8],[9,10,11]]:",
  JSON.stringify(findDiagonalOrder2([[1, 2, 3], [4], [5, 6, 7], [8], [9, 10, 11]])),
); // [1,4,2,5,3,8,6,9,7,10,11]

export {};
