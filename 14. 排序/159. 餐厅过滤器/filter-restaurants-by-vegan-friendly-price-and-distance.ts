// ============================================================
// 159. 餐厅过滤器
// ============================================================
// LeetCode 1333. Filter Restaurants by Vegan-Friendly, Price and Distance
// 餐厅数组 [id, rating, veganFriendly, price, distance]，
// 按 veganFriendly（为1则仅留素餐）、maxPrice、maxDistance 过滤，
// 返回 id 列表，按 rating 降序，rating 相同按 id 降序。

// 方法1：过滤 + 排序（O(n log n)）
function filterRestaurants(
  restaurants: number[][],
  veganFriendly: number,
  maxPrice: number,
  maxDistance: number,
): number[] {
  const filtered = restaurants.filter((r) => {
    const vegan = r[2];
    const price = r[3];
    const distance = r[4];
    if (veganFriendly === 1 && vegan === 0) return false;
    if (price > maxPrice) return false;
    if (distance > maxDistance) return false;
    return true;
  });
  // 按 rating 降序，相同则按 id 降序
  filtered.sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return b[0] - a[0];
  });
  return filtered.map((r) => r[0]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 159. 餐厅过滤器 =====");
const restaurants = [
  [1, 4, 1, 40, 10],
  [2, 8, 0, 50, 5],
  [3, 8, 1, 30, 4],
  [4, 10, 1, 10, 3],
  [5, 1, 0, 15, 1],
];
console.log("vegan=1,price=50,dist=10:", filterRestaurants(restaurants, 1, 50, 10)); // [4,3,1]
console.log("vegan=0,price=30,dist=3:", filterRestaurants(restaurants, 0, 30, 3)); // [4,5]
console.log("vegan=0,price=50,dist=10:", filterRestaurants(restaurants, 0, 50, 10)); // [4,3,2,1,5]

export {};
