// ============================================================
// 108. 最小可整除数位乘积 II
// ============================================================
// LeetCode 3326. Minimum Divisible Digit Product II
// 给定 n，找最小的正整数使其各位数字乘积能被 n 整除，返回字符串形式
// 将 n 分解为 2-9 的数位因子，无法分解则需含 0（乘积为 0 可被任何数整除）
// 时间复杂度：O(log n), 空间复杂度：O(log n)

// 方法1：回溯从 9 到 2 贪心分解 n 的因子（推荐）
// 从大到小尝试数位因子，回溯寻找最少位数分解，排序后拼接
function smallestNumber(n: number): string {
  if (n === 1) return "1";
  // 检查是否有大于 7 的质因子
  let temp: number = n;
  for (const p of [2, 3, 5, 7]) {
    while (temp % p === 0) temp = Math.floor(temp / p);
  }
  if (temp !== 1) return "10"; // 需要 0 使乘积为 0

  let best: number[] | null = null;

  function backtrack(remaining: number, digits: number[]): void {
    if (remaining === 1) {
      const sorted: number[] = [...digits].sort((a, b) => a - b);
      if (
        best === null ||
        sorted.length < best.length ||
        (sorted.length === best.length && sorted.join("") < best.join(""))
      ) {
        best = sorted;
      }
      return;
    }
    // 剪枝：当前位数已超过最优解
    if (best !== null && digits.length >= best.length) return;
    for (let d: number = 9; d >= 2; d--) {
      if (remaining % d === 0) {
        digits.push(d);
        backtrack(Math.floor(remaining / d), digits);
        digits.pop();
      }
    }
  }

  backtrack(n, []);
  // best 可能被闭包 backtrack 修改，但 TS 控制流分析无法追踪闭包内的赋值
  // 使用中间变量绕过类型收窄问题
  const result: number[] | null = best as number[] | null;
  return result ? result.join("") : "10";
}

// 方法2：数论分解 + 排序
// 统计 n 的质因子（2,3,5,7）个数，按 9->2 顺序贪心组合为数位
function smallestNumber2(n: number): string {
  if (n === 1) return "1";
  // 统计质因子个数
  let c2: number = 0,
    c3: number = 0,
    c5: number = 0,
    c7: number = 0;
  let temp: number = n;
  while (temp % 2 === 0) {
    c2++;
    temp = Math.floor(temp / 2);
  }
  while (temp % 3 === 0) {
    c3++;
    temp = Math.floor(temp / 3);
  }
  while (temp % 5 === 0) {
    c5++;
    temp = Math.floor(temp / 5);
  }
  while (temp % 7 === 0) {
    c7++;
    temp = Math.floor(temp / 7);
  }
  if (temp !== 1) return "10";

  const digits: number[] = [];
  while (c3 >= 2) {
    digits.push(9);
    c3 -= 2;
  } // 9 = 3^2
  while (c2 >= 3) {
    digits.push(8);
    c2 -= 3;
  } // 8 = 2^3
  while (c7 >= 1) {
    digits.push(7);
    c7--;
  } // 7 = 7
  while (c2 >= 1 && c3 >= 1) {
    digits.push(6);
    c2--;
    c3--;
  } // 6 = 2*3
  while (c5 >= 1) {
    digits.push(5);
    c5--;
  } // 5 = 5
  while (c2 >= 2) {
    digits.push(4);
    c2 -= 2;
  } // 4 = 2^2
  while (c3 >= 1) {
    digits.push(3);
    c3--;
  } // 3 = 3
  while (c2 >= 1) {
    digits.push(2);
    c2--;
  } // 2 = 2
  digits.sort((a, b) => a - b);
  return digits.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 108. 最小可整除数位乘积 II =====");
console.log(smallestNumber(10)); // 期望结果: "25"
console.log(smallestNumber(7)); // 期望结果: "7"
console.log(smallestNumber(12)); // 期望结果: "26"
console.log("--- 方法2测试 ---");
console.log(smallestNumber2(10)); // 期望结果: "25"
console.log(smallestNumber2(7)); // 期望结果: "7"
console.log(smallestNumber2(12)); // 期望结果: "26"

export {};
