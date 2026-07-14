// ============================================================
// 195. 你可以获得的最大硬币数目
// ============================================================
// LeetCode 1561. Maximum Number of Coins You Can Get
// 有 3n 堆硬币，每轮取 3 堆：Alice 取最大，你取中间，Bob 取最小。
// 共 n 轮，返回你能获得的最大硬币总数。

// 方法1：排序 + 从倒数第二起隔一个取（O(n log n)）
// 排序后 Bob 取最小 n 个，剩余 2n 中你取下标 n, n+2, ..., 3n-2。
function maxCoins(piles: number[]): number {
  const sorted = [...piles].sort((a, b) => a - b);
  const total = sorted.length; // 3n
  const n = total / 3;
  let sum = 0;
  for (let i = n; i < total; i += 2) {
    sum += sorted[i];
  }
  return sum;
}

// 方法2：排序 + 双指针（O(n log n)）
// left 指向 Bob 取的最小，right 指向 Alice 取的最大，你取 right-1。
function maxCoins2(piles: number[]): number {
  const sorted = [...piles].sort((a, b) => a - b);
  const rounds = sorted.length / 3;
  let left = 0;
  let right = sorted.length - 1;
  let me = 0;
  for (let r = 0; r < rounds; r++) {
    left++; // Bob 取最小
    me += sorted[right - 1]; // 你取中间
    right -= 2; // Alice 取最大
  }
  return me;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 195. 你可以获得的最大硬币数目 =====");
console.log("方法1 [2,4,1,2,7,8]:", maxCoins([2, 4, 1, 2, 7, 8])); // 9
console.log("方法1 [2,4,5]:", maxCoins([2, 4, 5])); // 4
console.log("方法1 [9,8,7,6,5,1,2,3,4]:", maxCoins([9, 8, 7, 6, 5, 1, 2, 3, 4])); // 18
console.log("方法2 [2,4,1,2,7,8]:", maxCoins2([2, 4, 1, 2, 7, 8])); // 9
console.log("方法2 [2,4,5]:", maxCoins2([2, 4, 5])); // 4
console.log("方法2 [9,8,7,6,5,1,2,3,4]:", maxCoins2([9, 8, 7, 6, 5, 1, 2, 3, 4])); // 18

export {};
