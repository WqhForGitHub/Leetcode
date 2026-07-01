// ============================================================
// 102. 找出给定方程的正整数解
// ============================================================
// LeetCode 1237. Find Positive Integer Solution for a Given Equation
// 给定函数 f(x, y)，找出所有正整数解使得 f(x, y) = z。

// 模拟 CustomFunction
class CustomFunction {
  f(x: number, y: number): number {
    return x + y; // 示例
  }
}

// 方法1：暴力枚举
function findSolution(
  customfunction: CustomFunction,
  z: number
): number[][] {
  const result: number[][] = [];
  for (let x = 1; x <= 1000; x++) {
    for (let y = 1; y <= 1000; y++) {
      const val = customfunction.f(x, y);
      if (val === z) {
        result.push([x, y]);
      } else if (val > z) {
        break;
      }
    }
    if (customfunction.f(x, 1) > z) break;
  }
  return result;
}

// 方法2：二分查找
function findSolutionBinary(
  customfunction: CustomFunction,
  z: number
): number[][] {
  const result: number[][] = [];
  for (let x = 1; x <= 1000; x++) {
    if (customfunction.f(x, 1) > z) break;
    let lo = 1;
    let hi = 1000;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const val = customfunction.f(x, mid);
      if (val === z) {
        result.push([x, mid]);
        break;
      } else if (val < z) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
  }
  return result;
}

// 方法3：双指针（假设 f 关于 x 和 y 都单调递增）
function findSolutionTwoPointer(
  customfunction: CustomFunction,
  z: number
): number[][] {
  const result: number[][] = [];
  let x = 1;
  let y = 1000;
  while (x <= 1000 && y >= 1) {
    const val = customfunction.f(x, y);
    if (val === z) {
      result.push([x, y]);
      x++;
      y--;
    } else if (val < z) {
      x++;
    } else {
      y--;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 102. 找出给定方程的正整数解 =====");
const cf = new CustomFunction();
console.log("暴力 5:", findSolution(cf, 5)); // [[1,4],[2,3],[3,2],[4,1]]
console.log("二分 5:", findSolutionBinary(cf, 5));
console.log("双指针 5:", findSolutionTwoPointer(cf, 5));

export {};
