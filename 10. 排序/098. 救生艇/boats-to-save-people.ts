// ============================================================
// 098. 救生艇
// ============================================================
// LeetCode 881. Boats to Save People
// 每艘船最多载 2 人且重量不超过 limit，求救起所有人所需最少船数。

// 方法1：排序 + 双指针（推荐，时间 O(n log n)，空间 O(log n) 排序栈）
// 排序后用最轻 + 最重配对：若两人合计不超过 limit 则同船，否则最重者独占一船。
function numRescueBoats(people: number[], limit: number): number {
  people.sort((a, b) => a - b);
  let light = 0;
  let heavy = people.length - 1;
  let boats = 0;

  while (light <= heavy) {
    if (people[light] + people[heavy] <= limit) {
      // 最轻与最重可同船
      light++;
    }
    // 最重者一定上船
    heavy--;
    boats++;
  }

  return boats;
}

// 方法2：贪心 + 计数（时间 O(n log n)，思路同方法1，结构化写法）
// 本质相同，仅展示双指针边界处理的不同写法。
function numRescueBoats2(people: number[], limit: number): number {
  const arr = [...people].sort((a, b) => a - b);
  let i = 0;
  let j = arr.length - 1;
  let boats = 0;
  while (i <= j) {
    // 尝试让最轻者与最重者配对
    if (i < j && arr[i] + arr[j] <= limit) {
      i++;
      j--;
    } else {
      // 最重者独占一船
      j--;
    }
    boats++;
  }
  return boats;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 098. 救生艇 =====");
console.log("方法1:", numRescueBoats([1, 2], 3)); // 期望: 1
console.log("方法1:", numRescueBoats([3, 2, 2, 1], 3)); // 期望: 3
console.log("方法1:", numRescueBoats([3, 5, 3, 4], 5)); // 期望: 4
console.log("方法2:", numRescueBoats2([3, 2, 2, 1], 3)); // 期望: 3

export {};
