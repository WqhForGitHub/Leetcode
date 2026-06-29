// ============================================================
// 028. 无法吃午餐的学生数量
// ============================================================
// LeetCode 1700. Number of Students Unable to Eat Lunch
// 学生排队取三明治，学生偏好 0 或 1，栈顶三明治为 0 或 1。
// 队首学生匹配则取走，否则排到队尾。返回无法吃到午餐的学生数。

// ------------------------------------------------------------
// 方法1：队列模拟
// ------------------------------------------------------------
// 用队列模拟学生排队取三明治的过程，当无人能取栈顶三明治时停止。
// 时间 O(n^2) 最坏，空间 O(n)。
function countStudents1(students: number[], sandwiches: number[]): number {
  const queue: number[] = [...students];
  let sandIdx = 0;
  let attempts = 0;
  while (queue.length > 0 && attempts < queue.length) {
    if (queue[0] === sandwiches[sandIdx]) {
      queue.shift();
      sandIdx++;
      attempts = 0;
    } else {
      queue.push(queue.shift()!);
      attempts++;
    }
  }
  return queue.length;
}

// ------------------------------------------------------------
// 方法2：计数（不模拟队列）
// ------------------------------------------------------------
// 只要还有学生喜欢栈顶三明治的类型，就会有人取走。
// 用计数直接判断。
// 时间 O(n)，空间 O(1)。
function countStudents2(students: number[], sandwiches: number[]): number {
  let count0 = 0;
  let count1 = 0;
  for (const s of students) {
    if (s === 0) count0++;
    else count1++;
  }
  for (const sand of sandwiches) {
    if (sand === 0) {
      if (count0 === 0) return count1;
      count0--;
    } else {
      if (count1 === 0) return count0;
      count1--;
    }
  }
  return 0;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", countStudents1([1, 1, 0, 0], [0, 1, 0, 1]), "期望: 0");
  console.log("测试2:", countStudents1([1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1]), "期望: 3");
  console.log("测试3:", countStudents2([1, 1, 0, 0], [0, 1, 0, 1]), "期望: 0");
  console.log("测试4:", countStudents2([1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1]), "期望: 3");
}

test();

export {};
