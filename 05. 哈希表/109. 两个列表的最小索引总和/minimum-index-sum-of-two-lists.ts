// ============================================================
// 109. 两个列表的最小索引总和
// ============================================================
// LeetCode 599. Minimum Index Sum of Two Lists
// 给定两个字符串列表，找出两列表中都出现且索引和最小的字符串，返回所有这样的字符串。
// 时间复杂度：O(n + m)，空间复杂度：O(n)

// 思路：哈希表记录 list1 中每个字符串的索引，遍历 list2 求最小索引和
function findRestaurant(list1: string[], list2: string[]): string[] {
  const indexMap = new Map<string, number>();
  list1.forEach((s, i) => indexMap.set(s, i));

  let minSum = Infinity;
  let result: string[] = [];

  for (let i = 0; i < list2.length; i++) {
    const s = list2[i];
    if (indexMap.has(s)) {
      const sum = i + indexMap.get(s)!;
      if (sum < minSum) {
        minSum = sum;
        result = [s];
      } else if (sum === minSum) {
        result.push(s);
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 109. 两个列表的最小索引总和 =====");
// 测试 1
console.log(
  findRestaurant(
    ["Shogun", "Tapioca Express", "Burger King", "KFC"],
    ["Piatti", "The Grill at Torrey Pines", "Hungry Hunter Steakhouse", "Shogun"],
  ),
); // 期望: ["Shogun"]
// 测试 2
console.log(
  findRestaurant(
    ["Shogun", "Tapioca Express", "Burger King", "KFC"],
    ["KFC", "Shogun", "Burger King"],
  ),
); // 期望: ["Shogun"]
// 测试 3: 多个相同最小索引和
console.log(
  findRestaurant(
    ["Shogun", "Tapioca Express", "Burger King", "KFC"],
    ["KFC", "Burger King", "Tapioca Express", "Shogun"],
  ),
); // 期望: ["KFC","Burger King","Tapioca Express","Shogun"] 中索引和最小的

export {};
