// ============================================================
// 039. 通过门的时间
// ============================================================
// LeetCode 2532. Time to Cross a Door
// n 个人排队过门，每人需要 time[i] 时间。门同一时刻只能一人通过。
// 从左到右依次通过，返回每个人通过门的时间。

// ------------------------------------------------------------
// 方法1：优先队列模拟
// ------------------------------------------------------------
// 用两个优先队列分别维护等待从左和从右通过的人，
// 按时间模拟，每次选择最先可用的人。
// 时间 O(n log n)，空间 O(n)。
function findCrossingTime1(n: number, k: number, time: number[][]): number {
  // time[i] = [leftToRight, pickOld, rightToLeft, putNew]
  const efficiency = (i: number) => time[i][0] + time[i][2];

  // 等待过桥的优先队列（效率高优先，效率相同则编号大优先）
  const waitLeft: number[] = [];
  const waitRight: number[] = [];
  // 工作中的优先队列（按完成时间排序）
  const workLeft: [number, number][] = []; // [endTime, index]
  const workRight: [number, number][] = [];

  for (let i = 0; i < k; i++) waitLeft.push(i);

  const cmp = (a: number, b: number) => {
    if (efficiency(a) !== efficiency(b)) return efficiency(b) - efficiency(a);
    return b - a;
  };

  let currentTime = 0;
  let remaining = n; // 待搬运的箱子数

  while (remaining > 0 || waitRight.length > 0 || workRight.length > 0) {
    // 检查工作中的人是否完成
    while (workLeft.length > 0 && workLeft[0][0] <= currentTime) {
      const [, idx] = workLeft.shift()!;
      waitLeft.push(idx);
    }
    while (workRight.length > 0 && workRight[0][0] <= currentTime) {
      const [, idx] = workRight.shift()!;
      waitRight.push(idx);
    }

    waitLeft.sort(cmp);
    waitRight.sort(cmp);

    if (waitRight.length > 0) {
      // 右边的人优先过桥
      const idx = waitRight.shift()!;
      currentTime += time[idx][2]; // rightToLeft
      workLeft.push([currentTime + time[idx][3], idx]); // putNew
    } else if (remaining > 0 && waitLeft.length > 0) {
      // 左边的人过桥
      const idx = waitLeft.shift()!;
      currentTime += time[idx][0]; // leftToRight
      workRight.push([currentTime + time[idx][1], idx]); // pickOld
      remaining--;
    } else {
      // 没人能过桥，快进到下一个完成时间
      let nextTime = Infinity;
      if (workLeft.length > 0) nextTime = Math.min(nextTime, workLeft[0][0]);
      if (workRight.length > 0) nextTime = Math.min(nextTime, workRight[0][0]);
      if (nextTime === Infinity) break;
      currentTime = nextTime;
    }
  }
  return currentTime;
}

// ------------------------------------------------------------
// 方法2：事件驱动模拟
// ------------------------------------------------------------
// 用事件队列驱动模拟，每次处理最早完成的事件。
// 时间 O(n log n)，空间 O(n)。
function findCrossingTime2(n: number, k: number, time: number[][]): number {
  const efficiency = (i: number) => time[i][0] + time[i][2];
  const cmp = (a: number, b: number) => {
    if (efficiency(a) !== efficiency(b)) return efficiency(b) - efficiency(a);
    return b - a;
  };

  const waitLeft: number[] = [];
  const waitRight: number[] = [];
  const workLeft: [number, number][] = [];
  const workRight: [number, number][] = [];

  for (let i = 0; i < k; i++) waitLeft.push(i);

  let t = 0;
  let boxes = n;

  while (boxes > 0 || waitRight.length > 0 || workRight.length > 0) {
    while (workLeft.length > 0 && workLeft[0][0] <= t) {
      waitLeft.push(workLeft.shift()![1]);
    }
    while (workRight.length > 0 && workRight[0][0] <= t) {
      waitRight.push(workRight.shift()![1]);
    }
    waitLeft.sort(cmp);
    waitRight.sort(cmp);

    if (waitRight.length > 0) {
      const i = waitRight.shift()!;
      t += time[i][2];
      workLeft.push([t + time[i][3], i]);
    } else if (boxes > 0 && waitLeft.length > 0) {
      const i = waitLeft.shift()!;
      t += time[i][0];
      workRight.push([t + time[i][1], i]);
      boxes--;
    } else {
      const candidates: number[] = [];
      if (workLeft.length > 0) candidates.push(workLeft[0][0]);
      if (workRight.length > 0) candidates.push(workRight[0][0]);
      if (candidates.length === 0) break;
      t = Math.min(...candidates);
    }
  }
  return t;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log(
    "测试1:",
    findCrossingTime2(1, 3, [
      [1, 1, 2, 1],
      [1, 1, 3, 1],
      [1, 1, 4, 1],
    ]),
    "期望: 6",
  );
  console.log(
    "测试2:",
    findCrossingTime2(3, 2, [
      [1, 9, 1, 8],
      [10, 10, 10, 10],
    ]),
    "期望: 50",
  );
}

test();

export {};
