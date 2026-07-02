// ============================================================
// 179. 通过翻转子数组使两个数组相等
// ============================================================
// LeetCode 1460. Make Two Arrays Equal by Reversing Subarrays
// 给定两个长度相同的数组 target 和 arr，可任意次数翻转 arr 的任意子数组。
// 判断 arr 能否变为 target。（等价于两数组元素多重集相同）

// 方法1：排序后比较（O(n log n)）
// 翻转可生成任意排列，故只需排序后逐位相等。
function canBeEqual(target: number[], arr: number[]): boolean {
  if (target.length !== arr.length) return false;
  target.sort((a, b) => a - b);
  arr.sort((a, b) => a - b);
  for (let i = 0; i < target.length; i++) {
    if (target[i] !== arr[i]) return false;
  }
  return true;
}

// 方法2：频率计数 + 比较（O(n)）
// 用 Map 统计 target 各元素频次，遍历 arr 抵消，负数即不等。
function canBeEqual2(target: number[], arr: number[]): boolean {
  if (target.length !== arr.length) return false;
  const count = new Map<number, number>();
  for (const x of target) count.set(x, (count.get(x) ?? 0) + 1);
  for (const x of arr) {
    const c = count.get(x) ?? 0;
    if (c === 0) return false;
    count.set(x, c - 1);
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 179. 通过翻转子数组使两个数组相等 =====");
console.log("方法1 target=[1,2,3,4] arr=[2,4,1,3]:", canBeEqual([1, 2, 3, 4], [2, 4, 1, 3])); // true
console.log("方法1 target=[7] arr=[7]:", canBeEqual([7], [7])); // true
console.log("方法1 target=[3,7,9] arr=[3,7,11]:", canBeEqual([3, 7, 9], [3, 7, 11])); // false
console.log("方法2 target=[1,2,3,4] arr=[2,4,1,3]:", canBeEqual2([1, 2, 3, 4], [2, 4, 1, 3])); // true
console.log("方法2 target=[7] arr=[7]:", canBeEqual2([7], [7])); // true
console.log("方法2 target=[3,7,9] arr=[3,7,11]:", canBeEqual2([3, 7, 9], [3, 7, 11])); // false

export {};
