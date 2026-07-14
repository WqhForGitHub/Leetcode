// ============================================================
// 153. 破解锁的最少时间 II
// ============================================================
// 自定义题：n 位锁，每位 0-9，初始全 0，每次旋转某位 +1 或 -1（耗时 1），
// 求到目标的最少时间。每位独立，等价于每位到目标的最小旋转步数之和。
// 思路：BFS 状态空间 / 直接每位贪心取 min(d, 10-d)。
// 时间复杂度：O(10^n) BFS / O(n) 直接法，空间复杂度对应。

function lockToState(digits: number[]): number {
  let v = 0;
  for (const d of digits) v = v * 10 + d;
  return v;
}

// 方法1：BFS 状态空间
// 从 0 状态出发，每次旋转一位 ±1，搜索到目标的最短步数。
function minTimeToCrackLockBFS(n: number, target: number[]): number {
  const targetVal = lockToState(target);
  if (targetVal === 0) return 0;
  const visited = new Set<number>();
  visited.add(0);
  const queue: Array<{ digits: number[]; step: number }> = [
    { digits: new Array(n).fill(0), step: 0 },
  ];
  while (queue.length > 0) {
    const { digits, step } = queue.shift()!;
    for (let i = 0; i < n; i++) {
      for (const delta of [1, -1]) {
        const nd = [...digits];
        nd[i] = (nd[i] + delta + 10) % 10;
        const val = lockToState(nd);
        if (val === targetVal) return step + 1;
        if (!visited.has(val)) {
          visited.add(val);
          queue.push({ digits: nd, step: step + 1 });
        }
      }
    }
  }
  return -1;
}

// 方法2：每位独立贪心
// 每位从 0 旋转到目标值最小步数为 min(d, 10 - d)，求和即可。
function minTimeToCrackLockDirect(n: number, target: number[]): number {
  let total = 0;
  for (const d of target) {
    total += Math.min(d, 10 - d);
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 153. 破解锁的最少时间 II =====");
console.log("BFS [0,1,2]:", minTimeToCrackLockBFS(3, [0, 1, 2])); // 期望 3
console.log("Direct [0,1,2]:", minTimeToCrackLockDirect(3, [0, 1, 2])); // 期望 3
console.log("BFS [9,9]:", minTimeToCrackLockBFS(2, [9, 9])); // 期望 2
console.log("Direct [9,9]:", minTimeToCrackLockDirect(2, [9, 9])); // 期望 2
console.log("BFS [0,0,0]:", minTimeToCrackLockBFS(3, [0, 0, 0])); // 期望 0
console.log("Direct [0,0,0]:", minTimeToCrackLockDirect(3, [0, 0, 0])); // 期望 0
console.log("BFS [5,5]:", minTimeToCrackLockBFS(2, [5, 5])); // 期望 10
console.log("Direct [5,5]:", minTimeToCrackLockDirect(2, [5, 5])); // 期望 10
console.log("BFS [1,9,5]:", minTimeToCrackLockBFS(3, [1, 9, 5])); // 期望 7
console.log("Direct [1,9,5]:", minTimeToCrackLockDirect(3, [1, 9, 5])); // 期望 7

export {};
