// ============================================================
// 189. 判断能否形成等差数列
// ============================================================
// LeetCode 1502. Can Make Arithmetic Progression From Sequence
// 给定数组 arr，判断是否能重新排列成等差数列（相邻差相等）。

// 方法1：排序后检查相邻差（O(n log n)）
function canMakeArithmeticProgression(arr: number[]): boolean {
  const sorted = [...arr].sort((a, b) => a - b);
  const diff = sorted[1] - sorted[0];
  for (let i = 2; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] !== diff) return false;
  }
  return true;
}

// 方法2：找最小最大值 + 集合验证（O(n)）
// 等差数列：a, a+d, a+2d, ..., a+(n-1)d。用集合判断所有项是否齐全。
function canMakeArithmeticProgression2(arr: number[]): boolean {
  const n = arr.length;
  if (n <= 2) return true;
  let min = Infinity;
  let max = -Infinity;
  const set = new Set<number>();
  for (const v of arr) {
    if (v < min) min = v;
    if (v > max) max = v;
    set.add(v);
  }
  // 公差必须能整除 (max - min)
  if ((max - min) % (n - 1) !== 0) return false;
  const d = (max - min) / (n - 1);
  if (d === 0) {
    // 所有元素必须相同
    return set.size === 1;
  }
  for (let i = 0; i < n; i++) {
    if (!set.has(min + i * d)) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 189. 判断能否形成等差数列 =====");
console.log("方法1 [3,5,1]:", canMakeArithmeticProgression([3, 5, 1])); // true
console.log("方法1 [1,2,4]:", canMakeArithmeticProgression([1, 2, 4])); // false
console.log("方法2 [3,5,1]:", canMakeArithmeticProgression2([3, 5, 1])); // true
console.log("方法2 [1,2,4]:", canMakeArithmeticProgression2([1, 2, 4])); // false
console.log("方法2 [0,0,0]:", canMakeArithmeticProgression2([0, 0, 0])); // true

export {};
