// ============================================================
// 040. 根据身高重建队列
// ============================================================
// LeetCode 406. Queue Reconstruction by Height
// 每个人表示为 [h, k]：h 为身高，k 为前面身高 >= h 的人数。
// 重建并返回队列。

// 方法1：按身高降序、k 升序排序后按 k 插入（O(n²) 时间，O(n) 空间）
// 先处理高个子：当插入某人身前已有更高（或等高）的人时，其 k 即插入位置。
// 后插入的矮个子不影响已插入高个子的 k 计数。
function reconstructQueue(people: number[][]): number[][] {
  // 身高降序；同身高时 k 升序
  people.sort((a, b) => {
    if (a[0] !== b[0]) return b[0] - a[0];
    return a[1] - b[1];
  });
  const result: number[][] = [];
  for (const p of people) {
    // 在位置 p[1] 处插入：前 p[1] 个人都 >= p[0]
    result.splice(p[1], 0, p);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 040. 根据身高重建队列 =====");

// 验证重建队列是否满足每个人的 k 约束
function isValidQueue(queue: number[][]): boolean {
  for (let i = 0; i < queue.length; i++) {
    const [h, k] = queue[i];
    let cnt = 0;
    for (let j = 0; j < i; j++) {
      if (queue[j][0] >= h) cnt++;
    }
    if (cnt !== k) return false;
  }
  return true;
}

const q1 = reconstructQueue([
  [7, 0],
  [4, 4],
  [7, 1],
  [5, 0],
  [6, 1],
  [5, 2],
]);
console.log("重建队列:", JSON.stringify(q1));
console.log("合法:", isValidQueue(q1)); // 期望 true
// 期望输出: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]

const q2 = reconstructQueue([
  [6, 0],
  [5, 0],
  [4, 0],
  [3, 2],
  [2, 2],
  [1, 4],
]);
console.log("重建队列:", JSON.stringify(q2));
console.log("合法:", isValidQueue(q2)); // 期望 true

const q3 = reconstructQueue([]);
console.log("空队列:", JSON.stringify(q3)); // 期望 []

export {};
