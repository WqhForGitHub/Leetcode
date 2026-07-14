// ============================================================
// 094. 车队
// ============================================================
// LeetCode 853. Car Fleet
// N 辆车驶向同一目的地 target，起始位置 position[i]、速度 speed[i]。
// 车不能超车：快车追上慢车后合并为一个车队以慢车速度行驶。求到达终点的车队数量。

// 方法1：按位置降序 + 比较到达时间（推荐，O(n log n) 时间，O(n) 空间）
// 每辆车到达终点时间 t = (target - position) / speed。
// 按位置从大到小（离终点近的先处理）扫描，维护当前最慢车队的到达时间 maxT。
// 若后车（位置更靠后）t > maxT，则追不上前方车队，自成新车队；否则并入。
function carFleet(target: number, position: number[], speed: number[]): number {
  const cars = position.map((p, i) => ({ p, t: (target - p) / speed[i] }));
  cars.sort((a, b) => b.p - a.p); // 位置降序

  let count = 0;
  let maxTime = -Infinity;
  for (const car of cars) {
    if (car.t > maxTime) {
      count++;
      maxTime = car.t;
    }
  }
  return count;
}

// 方法2：按位置降序 + 单调栈合并（O(n log n) 时间，O(n) 空间）
// 同样按位置降序，把到达时间入栈；若栈顶时间 <= 次栈顶（后车追上前车）则弹出合并。
// 最终栈中元素个数即为车队数。
function carFleetStack(target: number, position: number[], speed: number[]): number {
  const cars = position.map((p, i) => ({ p, t: (target - p) / speed[i] }));
  cars.sort((a, b) => b.p - a.p);

  const stack: number[] = [];
  for (const car of cars) {
    stack.push(car.t);
    // 若当前车（更靠后）能追上前方车队，则合并
    const m = stack.length;
    if (m >= 2 && stack[m - 1] <= stack[m - 2]) {
      stack.pop();
    }
  }
  return stack.length;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 094. 车队 =====");
console.log(
  "比较法 target=12,[10,8,0,5,3],[2,4,1,1,3]:",
  carFleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]),
); // 期望 3
console.log("比较法 target=10,[3],[3]:", carFleet(10, [3], [3])); // 期望 1
console.log("比较法 target=100,[0,2,4],[4,2,1]:", carFleet(100, [0, 2, 4], [4, 2, 1])); // 期望 1
console.log(
  "栈法 target=12,[10,8,0,5,3],[2,4,1,1,3]:",
  carFleetStack(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]),
); // 期望 3
console.log("栈法 target=10,[3],[3]:", carFleetStack(10, [3], [3])); // 期望 1
console.log("栈法 target=100,[0,2,4],[4,2,1]:", carFleetStack(100, [0, 2, 4], [4, 2, 1])); // 期望 1

export {};
