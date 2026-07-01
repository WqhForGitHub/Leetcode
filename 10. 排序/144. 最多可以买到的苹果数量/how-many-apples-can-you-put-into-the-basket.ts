// ============================================================
// 144. 最多可以买到的苹果数量
// ============================================================
// LeetCode 1196. How Many Apples Can You Put into the Basket
// 给定苹果重量数组 arr，篮子最多承重 5000，求最多能放入多少个苹果。

const MAX_WEIGHT = 5000;

// 方法1：排序 + 贪心（推荐，时间 O(n log n)）
// 为使苹果数量最多，优先挑选最轻的苹果。排序后从小到大累加，直到超过 5000。
function maxNumberOfApples(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  let sum = 0;
  let count = 0;
  for (const w of sorted) {
    if (sum + w > MAX_WEIGHT) break;
    sum += w;
    count++;
  }
  return count;
}

// 方法2：计数排序（时间 O(n + 5000)）
// 重量范围有限（题目保证 1 <= arr[i] <= 5000），用桶计数后从小 weight 取即可。
function maxNumberOfApples2(arr: number[]): number {
  const bucket = new Array(MAX_WEIGHT + 1).fill(0);
  for (const w of arr) {
    if (w >= 1 && w <= MAX_WEIGHT) bucket[w]++;
  }
  let sum = 0;
  let count = 0;
  for (let w = 1; w <= MAX_WEIGHT; w++) {
    while (bucket[w] > 0 && sum + w <= MAX_WEIGHT) {
      sum += w;
      count++;
      bucket[w]--;
    }
    if (sum + w > MAX_WEIGHT) break;
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 144. 最多可以买到的苹果数量 =====");
console.log("方法1:", maxNumberOfApples([100, 200, 150, 1000])); // 期望: 4
console.log("方法1:", maxNumberOfApples([900, 950, 800, 1000, 700, 800])); // 期望: 5
console.log("方法1:", maxNumberOfApples([4900, 300, 200])); // 期望: 2
console.log("方法2:", maxNumberOfApples2([100, 200, 150, 1000])); // 期望: 4
console.log("方法2:", maxNumberOfApples2([900, 950, 800, 1000, 700, 800])); // 期望: 5
console.log("方法2:", maxNumberOfApples2([4900, 300, 200])); // 期望: 2

export {};
