// ============================================================
// 151. 使两个整数相等的数位操作
// ============================================================
// 自定义题：两整数 a, b，每次可改变 a 的某一位数字（0-9），
// 求 a 变为 b 所需的最少操作数。每次只能改变一位。
// 思路：BFS 数位状态，把整数按位展开，逐位搜索。
// 时间复杂度：O(10^k * k)，空间复杂度：O(10^k)，k 为位数。

function digitCount(n: number): number {
  if (n === 0) return 1;
  let c = 0;
  let x = Math.abs(n);
  while (x > 0) {
    c++;
    x = Math.floor(x / 10);
  }
  return c;
}

function toDigits(n: number, k: number): number[] {
  const arr: number[] = new Array(k).fill(0);
  let x = n;
  for (let i = k - 1; i >= 0; i--) {
    arr[i] = x % 10;
    x = Math.floor(x / 10);
  }
  return arr;
}

function fromDigits(arr: number[]): number {
  let v = 0;
  for (const d of arr) v = v * 10 + d;
  return v;
}

// 方法1：BFS 数位状态（按整数状态搜索）
// 把 a 作为起点状态，每次改变一位得到新状态，求到达 b 的最短步数。
function minOperationsEqualBFS(a: number, b: number): number {
  if (a === b) return 0;
  const k = Math.max(digitCount(a), digitCount(b));
  const start = toDigits(a, k);
  const target = fromDigits(toDigits(b, k));
  const startVal = fromDigits(start);
  if (startVal === target) return 0;
  const visited = new Set<number>();
  visited.add(startVal);
  const queue: Array<{ val: number; step: number }> = [{ val: startVal, step: 0 }];
  while (queue.length > 0) {
    const { val, step } = queue.shift()!;
    const digits = toDigits(val, k);
    for (let i = 0; i < k; i++) {
      const orig = digits[i];
      for (let d = 0; d < 10; d++) {
        if (d === orig) continue;
        digits[i] = d;
        const next = fromDigits(digits);
        if (next === target) return step + 1;
        if (!visited.has(next)) {
          visited.add(next);
          queue.push({ val: next, step: step + 1 });
        }
      }
      digits[i] = orig;
    }
  }
  return -1;
}

// 方法2：位差直接统计（每位差值取最小，每位独立只需1步）
// 由于每次可任意改变某一位为任意值，每位至多1步即可对齐。
function minOperationsDirect(a: number, b: number): number {
  if (a === b) return 0;
  const k = Math.max(digitCount(a), digitCount(b));
  const da = toDigits(a, k);
  const db = toDigits(b, k);
  let ops = 0;
  for (let i = 0; i < k; i++) {
    if (da[i] !== db[i]) ops++;
  }
  return ops;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 151. 使两个整数相等的数位操作 =====");
console.log("BFS 123 -> 121:", minOperationsEqualBFS(123, 121)); // 期望 1
console.log("Direct 123 -> 121:", minOperationsDirect(123, 121)); // 期望 1
console.log("BFS 123 -> 456:", minOperationsEqualBFS(123, 456)); // 期望 3
console.log("Direct 123 -> 456:", minOperationsDirect(123, 456)); // 期望 3
console.log("BFS 0 -> 0:", minOperationsEqualBFS(0, 0)); // 期望 0
console.log("Direct 0 -> 0:", minOperationsDirect(0, 0)); // 期望 0
console.log("BFS 9 -> 10:", minOperationsEqualBFS(9, 10)); // 期望 2
console.log("Direct 9 -> 10:", minOperationsDirect(9, 10)); // 期望 2
console.log("BFS 555 -> 555:", minOperationsEqualBFS(555, 555)); // 期望 0
console.log("Direct 555 -> 555:", minOperationsDirect(555, 555)); // 期望 0

export {};
