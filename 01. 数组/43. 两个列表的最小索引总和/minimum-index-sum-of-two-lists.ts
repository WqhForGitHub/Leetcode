// ============================================================
// 43. 两个列表的最小索引总和
// ============================================================
// LeetCode 599. Minimum Index Sum of Two Lists
// 给定两个字符串列表 list1 和 list2，找出两个列表中都出现的餐厅，且索引和最小。返回所有符合条件的餐厅名。
// 时间复杂度：O(n+m)，空间复杂度：O(n)

// 方法1：哈希表映射（推荐）
function findRestaurant(list1: string[], list2: string[]): string[] {
  const indexMap = new Map<string, number>();
  // 将 list1 中的餐厅名映射到索引
  for (let i = 0; i < list1.length; i++) {
    indexMap.set(list1[i], i);
  }

  let minSum = Infinity;
  let result: string[] = [];

  // 遍历 list2，对每个存在于 list1 中的餐厅计算索引和
  for (let j = 0; j < list2.length; j++) {
    const i = indexMap.get(list2[j]);
    if (i !== undefined) {
      const sum = i + j;
      if (sum < minSum) {
        // 找到更小的索引和，重置结果
        minSum = sum;
        result = [list2[j]];
      } else if (sum === minSum) {
        // 索引和相同，添加到结果
        result.push(list2[j]);
      }
    }
  }

  return result;
}

// 方法2：双重遍历（暴力法）
function findRestaurantBruteForce(list1: string[], list2: string[]): string[] {
  let minSum = Infinity;
  const result: string[] = [];

  for (let i = 0; i < list1.length; i++) {
    for (let j = 0; j < list2.length; j++) {
      if (list1[i] === list2[j]) {
        const sum = i + j;
        if (sum < minSum) {
          minSum = sum;
          result.length = 0;
          result.push(list1[i]);
        } else if (sum === minSum) {
          result.push(list1[i]);
        }
      }
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 43. 两个列表的最小索引总和 =====");
console.log(
  "哈希表:",
  findRestaurant(
    ["Shogun", "Tapioca Express", "Burger King", "KFC"],
    ["Piatti", "The Grill at Torrey Pines", "Hungry Hunter Steakhouse", "Shogun"],
  ),
); // 期望结果: ["Shogun"]
console.log(
  "哈希表:",
  findRestaurant(
    ["Shogun", "Tapioca Express", "Burger King", "KFC"],
    ["KFC", "Shogun", "Burger King"],
  ),
); // 期望结果: ["Shogun"]
console.log("哈希表:", findRestaurant(["happy", "sad", "good"], ["sad", "happy", "good"])); // 期望结果: ["sad","happy"] 或 ["happy","sad"]
console.log(
  "暴力:",
  findRestaurantBruteForce(
    ["Shogun", "Tapioca Express", "Burger King", "KFC"],
    ["KFC", "Shogun", "Burger King"],
  ),
); // 期望结果: ["Shogun"]

export {};
