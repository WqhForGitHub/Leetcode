// ============================================================
// 132. 拼车
// ============================================================
// LeetCode 1094. Car Pooling
// 给定 trips[i] = [numPassengers, from, to] 与车辆容量 capacity，
// 判断所有行程是否能一次性完成（车上乘客数任意时刻不超过 capacity）。

// 方法1：事件排序（O(n log n)）
// 将每段旅程拆为 [from, +num] 与 [to, -num] 两个事件，按位置排序后扫描。
function carPooling(trips: number[][], capacity: number): boolean {
  const events: Array<[number, number]> = [];
  for (const [num, from, to] of trips) {
    events.push([from, num]);
    events.push([to, -num]);
  }
  // 按位置升序；同位置先下车（负数）再上车，保证不误判
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  let cur = 0;
  for (const [, delta] of events) {
    cur += delta;
    if (cur > capacity) return false;
  }
  return true;
}

// 方法2：差分数组 / 线段扫描（O(n + 1001)）
// 位置范围 0..1000，用差分数组记录每个位置乘客变化，前缀和得到车上人数。
function carPooling2(trips: number[][], capacity: number): boolean {
  const MAX = 1001;
  const diff = new Array<number>(MAX).fill(0);
  for (const [num, from, to] of trips) {
    diff[from] += num;
    diff[to] -= num;
  }
  let cur = 0;
  for (let i = 0; i < MAX; i++) {
    cur += diff[i];
    if (cur > capacity) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 132. 拼车 =====");
console.log(
  "方法1:",
  carPooling(
    [
      [2, 1, 5],
      [3, 3, 7],
    ],
    4,
  ),
); // 期望: false
console.log(
  "方法1:",
  carPooling(
    [
      [2, 1, 5],
      [3, 3, 7],
    ],
    5,
  ),
); // 期望: true
console.log(
  "方法2:",
  carPooling2(
    [
      [2, 1, 5],
      [3, 3, 7],
    ],
    4,
  ),
); // 期望: false
console.log(
  "方法2:",
  carPooling2(
    [
      [2, 1, 5],
      [3, 3, 7],
    ],
    5,
  ),
); // 期望: true
console.log(
  "方法2:",
  carPooling2(
    [
      [2, 1, 5],
      [3, 5, 7],
    ],
    3,
  ),
); // 期望: true
console.log(
  "方法2:",
  carPooling2(
    [
      [3, 2, 7],
      [1, 3, 7],
      [2, 5, 8],
    ],
    6,
  ),
); // 期望: true

export {};
