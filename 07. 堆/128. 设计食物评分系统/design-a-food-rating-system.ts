// ============================================================
// 128. 设计食物评分系统
// ============================================================
// LeetCode 2353. Design a Food Rating System
// 设计一个系统，支持修改食物评分和查询某菜系中评分最高的食物。
// 时间复杂度：changeRating O(log n)，highestRated O(1)

// 方法1：哈希表 + 最大堆（懒删除）
class FoodRatings {
  private foodToCuisine: Map<string, string> = new Map();
  private foodToRating: Map<string, number> = new Map();
  private cuisineHeap: Map<string, Array<[number, string]>> = new Map();

  constructor(foods: string[], cuisines: string[], ratings: number[]) {
    for (let i = 0; i < foods.length; i++) {
      this.foodToCuisine.set(foods[i], cuisines[i]);
      this.foodToRating.set(foods[i], ratings[i]);
      if (!this.cuisineHeap.has(cuisines[i])) this.cuisineHeap.set(cuisines[i], []);
      const heap = this.cuisineHeap.get(cuisines[i])!;
      heap.push([ratings[i], foods[i]]);
      this.siftUp(heap, heap.length - 1);
    }
  }

  changeRating(food: string, newRating: number): void {
    this.foodToRating.set(food, newRating);
    const cuisine = this.foodToCuisine.get(food)!;
    const heap = this.cuisineHeap.get(cuisine)!;
    heap.push([newRating, food]);
    this.siftUp(heap, heap.length - 1);
  }

  highestRated(cuisine: string): string {
    const heap = this.cuisineHeap.get(cuisine)!;
    while (heap.length > 0) {
      const [rating, food] = heap[0];
      if (this.foodToRating.get(food) === rating) return food;
      heap[0] = heap[heap.length - 1];
      heap.pop();
      if (heap.length > 0) this.siftDown(heap, 0);
    }
    return "";
  }

  private siftUp(heap: Array<[number, string]>, i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.compare(heap[i], heap[p]) > 0) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  }

  private siftDown(heap: Array<[number, string]>, i: number): void {
    const n = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.compare(heap[l], heap[s]) > 0) s = l;
      if (r < n && this.compare(heap[r], heap[s]) > 0) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  }

  private compare(a: [number, string], b: [number, string]): number {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0;
  }
}

// 方法2：哈希表 + TreeMap（用有序数组模拟）
class FoodRatings2 {
  private foodToCuisine: Map<string, string> = new Map();
  private foodToRating: Map<string, number> = new Map();
  private cuisineMap: Map<string, Map<number, Set<string>>> = new Map();

  constructor(foods: string[], cuisines: string[], ratings: number[]) {
    for (let i = 0; i < foods.length; i++) {
      this.foodToCuisine.set(foods[i], cuisines[i]);
      this.foodToRating.set(foods[i], ratings[i]);
      if (!this.cuisineMap.has(cuisines[i])) this.cuisineMap.set(cuisines[i], new Map());
      const cm = this.cuisineMap.get(cuisines[i])!;
      if (!cm.has(ratings[i])) cm.set(ratings[i], new Set());
      cm.get(ratings[i])!.add(foods[i]);
    }
  }

  changeRating(food: string, newRating: number): void {
    const cuisine = this.foodToCuisine.get(food)!;
    const oldRating = this.foodToRating.get(food)!;
    const cm = this.cuisineMap.get(cuisine)!;
    cm.get(oldRating)!.delete(food);
    if (cm.get(oldRating)!.size === 0) cm.delete(oldRating);
    if (!cm.has(newRating)) cm.set(newRating, new Set());
    cm.get(newRating)!.add(food);
    this.foodToRating.set(food, newRating);
  }

  highestRated(cuisine: string): string {
    const cm = this.cuisineMap.get(cuisine)!;
    const maxRating = Math.max(...cm.keys());
    return Array.from(cm.get(maxRating)!).sort()[0];
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 128. 设计食物评分系统 =====");
const fr = new FoodRatings(
  ["kimchi", "miso", "sushi", "moussaka", "ramen", "bulgogi"],
  ["korean", "japanese", "japanese", "greek", "japanese", "korean"],
  [9, 12, 8, 15, 14, 7]
);
console.log("highestRated(japanese):", fr.highestRated("japanese")); // ramen
console.log("highestRated(korean):", fr.highestRated("korean")); // kimchi
fr.changeRating("sushi", 16);
console.log("highestRated(japanese):", fr.highestRated("japanese")); // sushi
fr.changeRating("ramen", 16);
console.log("highestRated(japanese):", fr.highestRated("japanese")); // ramen

export {};
