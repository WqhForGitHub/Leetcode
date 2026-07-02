// ============================================================
// 153. 划分数组为连续数字的集合
// ============================================================
// LeetCode 1296. Divide Array in Sets of K Consecutive Numbers
// 判断数组是否能划分为若干组，每组包含 k 个连续数字。

// 方法1：哈希计数 + 贪心（从小到大取，O(n log n)）
function isPossibleDivide(nums: number[], k: number): boolean {
  if (nums.length % k !== 0) return false;
  const count = new Map<number, number>();
  for (const num of nums) {
    count.set(num, (count.get(num) ?? 0) + 1);
  }
  // 按升序遍历每个不同的数字
  const sortedKeys = [...count.keys()].sort((a, b) => a - b);
  for (const start of sortedKeys) {
    const c = count.get(start) ?? 0;
    if (c === 0) continue;
    // 以 start 为起点消耗 c 组连续 k 个数
    for (let i = 0; i < k; i++) {
      const need = start + i;
      const have = count.get(need) ?? 0;
      if (have < c) return false;
      count.set(need, have - c);
    }
  }
  return true;
}

// 方法2：哈希计数 + 需求映射（按有序键处理，O(n)）
// 用 count 记录剩余数量，用 need 记录有多少条链正等待某个数字。
// 每个数字若能续上已有链则续上，否则开新链。
function isPossibleDivide2(nums: number[], k: number): boolean {
  if (nums.length % k !== 0) return false;
  const count = new Map<number, number>();
  for (const num of nums) {
    count.set(num, (count.get(num) ?? 0) + 1);
  }
  const need = new Map<number, number>();
  const sortedKeys = [...count.keys()].sort((a, b) => a - b);
  for (const num of sortedKeys) {
    let c = count.get(num) ?? 0;
    if (c === 0) continue;
    // 先尽量续上已有链
    const needCnt = need.get(num) ?? 0;
    const useToAppend = Math.min(c, needCnt);
    c -= useToAppend;
    need.set(num, needCnt - useToAppend);
    need.set(num + 1, (need.get(num + 1) ?? 0) + useToAppend);
    // 剩余的必须开新链
    if (c > 0) {
      for (let i = 0; i < k; i++) {
        const need2 = num + i;
        const have = count.get(need2) ?? 0;
        if (have < c) return false;
        count.set(need2, have - c);
      }
      need.set(num + k, (need.get(num + k) ?? 0) + c);
    }
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 153. 划分数组为连续数字的集合 =====");
console.log("方法1 [1,2,3,3,4,4,5,6], k=4:", isPossibleDivide([1, 2, 3, 3, 4, 4, 5, 6], 4)); // true
console.log(
  "方法1 [3,2,1,2,3,4,3,4,5,9,10,11], k=3:",
  isPossibleDivide([3, 2, 1, 2, 3, 4, 3, 4, 5, 9, 10, 11], 3),
); // true
console.log("方法1 [1,2,3,4], k=3:", isPossibleDivide([1, 2, 3, 4], 3)); // false
console.log("方法2 [1,2,3,3,4,4,5,6], k=4:", isPossibleDivide2([1, 2, 3, 3, 4, 4, 5, 6], 4)); // true
console.log("方法2 [1,2,3,4], k=3:", isPossibleDivide2([1, 2, 3, 4], 3)); // false

export {};
