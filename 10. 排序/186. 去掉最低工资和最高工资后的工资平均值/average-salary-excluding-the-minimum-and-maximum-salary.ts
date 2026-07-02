// ============================================================
// 186. 去掉最低工资和最高工资后的工资平均值
// ============================================================
// LeetCode 1491. Average Salary Excluding the Minimum and Maximum Salary
// 给定工资数组 salary（每个值唯一，长度 >= 3），
// 去掉一个最高和一个最低工资后，返回剩余工资的平均值。

// 方法1：排序 + 去头尾切片（O(n log n)）
function average(salary: number[]): number {
  const sorted = [...salary].sort((a, b) => a - b);
  const trimmed = sorted.slice(1, sorted.length - 1);
  let sum = 0;
  for (const v of trimmed) sum += v;
  return sum / trimmed.length;
}

// 方法2：一次遍历找最小、最大、总和（O(n)）
function average2(salary: number[]): number {
  let min = Infinity;
  let max = -Infinity;
  let sum = 0;
  for (const v of salary) {
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  }
  return (sum - min - max) / (salary.length - 2);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 186. 去掉最低工资和最高工资后的工资平均值 =====");
console.log("方法1 [4000,3000,1000,2000]:", average([4000, 3000, 1000, 2000])); // 2500.0
console.log("方法1 [1000,2000,3000]:", average([1000, 2000, 3000])); // 2000.0
console.log("方法2 [4000,3000,1000,2000]:", average2([4000, 3000, 1000, 2000])); // 2500.0
console.log("方法2 [1000,2000,3000]:", average2([1000, 2000, 3000])); // 2000.0

export {};
