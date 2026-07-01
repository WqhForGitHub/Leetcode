// ============================================================
// 160. 餐厅过滤器
// ============================================================
// LeetCode 1333. Filter Restaurants by Vegan-Friendly, Price and Distance
// 餐厅数组 [id, rating, veganFriendly, price, distance]，
// 按 veganFriendly（为1则仅留素餐）、maxPrice、maxDistance 过滤，
// 返回 id 列表，按 rating 降序，rating 相同按 id 降序。

// 方法1：数组解构过滤 + 排序（O(n log n)）
function filterRestaurants(
  restaurants: number[][],
  veganFriendly: number,
  maxPrice: number,
  maxDistance: number
): number[] {
  const filtered = restaurants.filter((r) => {
    const [, , vegan, price, distance] = r;
    if (veganFriendly === 1 && vegan === 0) return false;
    if (price > maxPrice) return false;
    if (distance > maxDistance) return false;
    return true;
  });
  filtered.sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return b[0] - a[0];
  });
  return filtered.map((r) => r[0]);
}

// 方法2：映射为对象 + 自定义比较器排序（O(n log n)）
// 用具名对象提升可读性，比较器显式处理多级排序。
interface Restaurant {
  id: number;
  rating: number;
  vegan: number;
  price: number;
  distance: number;
}

function filterRestaurants2(
  restaurants: number[][],
  veganFriendly: number,
  maxPrice: number,
  maxDistance: number
): number[] {
  const list: Restaurant[] = restaurants.map((r) => ({
    id: r[0],
    rating: r[1],
    vegan: r[2],
    price: r[3],
    distance: r[4],
  }));

  const filtered = list.filter((r) => {
    if (veganFriendly === 1 && r.vegan === 0) return false;
    if (r.price > maxPrice) return false;
    if (r.distance > maxDistance) return false;
    return true;
  });

  // 多级比较器：rating 降序，id 降序
  const compare = (a: Restaurant, b: Restaurant): number => {
    if (a.rating !== b.rating) return b.rating - a.rating;
    return b.id - a.id;
  };
  filtered.sort(compare);
  return filtered.map((r) => r.id);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 160. 餐厅过滤器 =====");
const restaurants = [
  [1, 4, 1, 40, 10],
  [2, 8, 0, 50, 5],
  [3, 8, 1, 30, 4],
  [4, 10, 1, 10, 3],
  [5, 1, 0, 15, 1],
];
console.log("方法1 vegan=1,price=50,dist=10:", filterRestaurants(restaurants, 1, 50, 10)); // [4,3,1]
console.log("方法1 vegan=0,price=30,dist=3:", filterRestaurants(restaurants, 0, 30, 3)); // [4,5]
console.log("方法2 vegan=1,price=50,dist=10:", filterRestaurants2(restaurants, 1, 50, 10)); // [4,3,1]
console.log("方法2 vegan=0,price=50,dist=10:", filterRestaurants2(restaurants, 0, 50, 10)); // [4,3,2,1,5]

export {};
