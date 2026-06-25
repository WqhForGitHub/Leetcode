// ============================================================
// 058. 车队
// ============================================================
// LeetCode 853. Car Fleet
// N 辆车沿单行道向 target 行驶，给定位置和速度。后车追上前车后以前车速度行驶（成车队），
// 问到达终点时有多少个车队。

// ------------------------------------------------------------
// 方法1：单调栈（按位置排序）
// ------------------------------------------------------------
// 按起始位置降序排序，计算每辆车到达终点的时间。若后车时间 <= 前车，
// 则追上合并为一个车队。用栈维护车队数。时间 O(n log n)，空间 O(n)。
function carFleet(target: number, position: number[], speed: number[]): number {
  const n = position.length;
  if (n === 0) return 0;
  // 按位置降序排序
  const cars = position
    .map((p, i) => ({ p, t: (target - p) / speed[i] }))
    .sort((a, b) => b.p - a.p);

  const stack: number[] = []; // 存到达时间
  for (const car of cars) {
    if (stack.length === 0 || car.t > stack[stack.length - 1]) {
      stack.push(car.t); // 形成新车队
    }
    // 否则追上前车，合并（不入栈）
  }
  return stack.length;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1:', carFleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]), '期望: 3');
  console.log('测试2:', carFleet(10, [3], [3]), '期望: 1');
  console.log('测试3:', carFleet(100, [0, 2, 4], [4, 2, 1]), '期望: 1');
}

test();

export {};
