// ============================================================
// 142. 打开转盘锁
// ============================================================
// LeetCode 752. Open the Lock
// 转盘锁有 4 个拨盘，每个拨盘 0-9。从 "0000" 出发，每次可将一个拨盘 +1 或 -1，
// 避开死亡数字列表 deadends，求转到目标 target 的最少步数。
// 时间复杂度：O(10^4)，状态空间；空间复杂度：O(10^4)

function openLock(deadends: string[], target: string): number {
  const dead = new Set(deadends);
  if (dead.has("0000")) return -1;
  if (target === "0000") return 0;

  // BFS
  const visited = new Set<string>(["0000"]);
  const queue: [string, number][] = [["0000", 0]];

  while (queue.length > 0) {
    const [cur, steps] = queue.shift()!;
    // 枚举所有下一个状态
    for (let i = 0; i < 4; i++) {
      for (const d of [-1, 1]) {
        const next = rotate(cur, i, d);
        if (next === target) return steps + 1;
        if (!dead.has(next) && !visited.has(next)) {
          visited.add(next);
          queue.push([next, steps + 1]);
        }
      }
    }
  }
  return -1;
}

// 转动第 i 位拨盘
function rotate(s: string, i: number, d: number): string {
  const digits = s.split("");
  let num = parseInt(digits[i]);
  num = (num + d + 10) % 10;
  digits[i] = num.toString();
  return digits.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 142. 打开转盘锁 =====");
console.log(openLock(["0201", "0101", "0102", "1212", "2002"], "0202")); // 期望: 6
console.log(openLock(["8888"], "0009")); // 期望: 1
console.log(openLock(["8887", "8889", "8878", "8898", "8788", "8988", "7888", "9888"], "8888")); // 期望: -1

export {};
