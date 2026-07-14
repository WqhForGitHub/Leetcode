// ============================================================
// 225. 你能构造出连续值的最大数目
// ============================================================
// LeetCode 1798. Maximum Number of Consecutive Values You Can Make
// 给定硬币数组 coins，可以用任意子集之和构造一个值。
// 返回从 0 开始可构造的连续整数最大数目。

// 方法1：排序 + 贪心扩展可达范围 [0, reach]（O(n log n)）
// 维护 reach 表示当前能连续构造 [0, reach]。
// 将硬币升序排序后逐个处理：若 coin <= reach+1，
// 则加入该硬币后可扩展到 [0, reach+coin]；否则无法填补 reach+1 的缺口，停止。
function maxConsecutiveCoins1(coins: number[]): number {
  coins.sort((a, b) => a - b);
  let reach = 0; // 当前能构造 [0, reach]
  for (const c of coins) {
    if (c <= reach + 1) {
      reach += c;
    } else {
      break;
    }
  }
  return reach + 1;
}

// 方法2：排序 + DP 集合（O(n * sum)）
// 用 Set 维护所有可达和，逐个硬币把每个已有和加上硬币加入集合，
// 最后从 0 开始数连续可达值的个数。适合硬币数与面额较小的场景。
function maxConsecutiveCoins2(coins: number[]): number {
  coins.sort((a, b) => a - b);
  const reachable = new Set<number>([0]);
  for (const c of coins) {
    const existing = [...reachable];
    for (const v of existing) {
      reachable.add(v + c);
    }
  }
  let x = 0;
  while (reachable.has(x)) x++;
  return x;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 225. 你能构造出连续值的最大数目 =====");
console.log("方法1 [1,3]:", maxConsecutiveCoins1([1, 3])); // 2
console.log("方法2 [1,3]:", maxConsecutiveCoins2([1, 3])); // 2
console.log("方法1 [1,1,1,4]:", maxConsecutiveCoins1([1, 1, 1, 4])); // 8
console.log("方法2 [1,1,1,4]:", maxConsecutiveCoins2([1, 1, 1, 4])); // 8
console.log("方法1 [1,4,10,3,1]:", maxConsecutiveCoins1([1, 4, 10, 3, 1])); // 20
console.log("方法2 [1,4,10,3,1]:", maxConsecutiveCoins2([1, 4, 10, 3, 1])); // 20

export {};
