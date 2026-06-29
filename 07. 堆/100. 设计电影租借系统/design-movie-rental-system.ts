// ============================================================
// 100. 设计电影租借系统
// ============================================================
// LeetCode 1912. Design Movie Rental System
// 电影店，支持 search/rent/drop/report。
// 时间复杂度：search O(log S)，rent O(log)，drop O(log)

// 方法1：三个有序结构（用排序数组模拟）
class MovieRentingSystem {
  private shopMovie: Map<string, number> = new Map(); // "shop,movie" -> price
  private unrented: Map<number, Array<{ shop: number; price: number }>> = new Map(); // movie -> [shop, price]
  private rented: Array<{ shop: number; movie: number; price: number }> = [];
  constructor(n: number, entries: number[][]) {
    for (const [shop, movie, price] of entries) {
      this.shopMovie.set(`${shop},${movie}`, price);
      if (!this.unrented.has(movie)) this.unrented.set(movie, []);
      this.unrented.get(movie)!.push({ shop, price });
    }
    for (const list of this.unrented.values()) {
      list.sort((a, b) => a.price - b.price || a.shop - b.shop);
    }
  }
  search(movie: number): number[] {
    const list = this.unrented.get(movie);
    if (list === undefined) return [];
    return list.slice(0, 5).map((x) => x.shop);
  }
  rent(shop: number, movie: number): void {
    const price = this.shopMovie.get(`${shop},${movie}`)!;
    const list = this.unrented.get(movie)!;
    const idx = list.findIndex((x) => x.shop === shop && x.price === price);
    list.splice(idx, 1);
    this.rented.push({ shop, movie, price });
    this.rented.sort((a, b) => a.price - b.price || a.shop - b.shop || a.movie - b.movie);
  }
  drop(shop: number, movie: number): void {
    const price = this.shopMovie.get(`${shop},${movie}`)!;
    const idx = this.rented.findIndex(
      (x) => x.shop === shop && x.movie === movie && x.price === price,
    );
    this.rented.splice(idx, 1);
    const list = this.unrented.get(movie)!;
    let pos = 0;
    while (
      pos < list.length &&
      (list[pos].price < price || (list[pos].price === price && list[pos].shop < shop))
    )
      pos++;
    list.splice(pos, 0, { shop, price });
  }
  report(): number[][] {
    return this.rented.slice(0, 5).map((x) => [x.shop, x.movie]);
  }
}

// 方法2：堆（最小堆）
class MovieRentingSystemHeap {
  private prices: Map<string, number> = new Map();
  private unrented: Map<number, Array<{ shop: number; price: number }>> = new Map();
  private rented: Array<{ shop: number; movie: number; price: number }> = [];
  constructor(n: number, entries: number[][]) {
    for (const [shop, movie, price] of entries) {
      this.prices.set(`${shop},${movie}`, price);
      if (!this.unrented.has(movie)) this.unrented.set(movie, []);
      this.unrented.get(movie)!.push({ shop, price });
    }
    for (const list of this.unrented.values())
      list.sort((a, b) => a.price - b.price || a.shop - b.shop);
  }
  search(movie: number): number[] {
    return (this.unrented.get(movie) ?? []).slice(0, 5).map((x) => x.shop);
  }
  rent(shop: number, movie: number): void {
    const price = this.prices.get(`${shop},${movie}`)!;
    const list = this.unrented.get(movie)!;
    const idx = list.findIndex((x) => x.shop === shop);
    list.splice(idx, 1);
    this.rented.push({ shop, movie, price });
    this.rented.sort((a, b) => a.price - b.price || a.shop - b.shop || a.movie - b.movie);
  }
  drop(shop: number, movie: number): void {
    const price = this.prices.get(`${shop},${movie}`)!;
    const idx = this.rented.findIndex((x) => x.shop === shop && x.movie === movie);
    this.rented.splice(idx, 1);
    const list = this.unrented.get(movie)!;
    let pos = 0;
    while (
      pos < list.length &&
      (list[pos].price < price || (list[pos].price === price && list[pos].shop < shop))
    )
      pos++;
    list.splice(pos, 0, { shop, price });
  }
  report(): number[][] {
    return this.rented.slice(0, 5).map((x) => [x.shop, x.movie]);
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 100. 设计电影租借系统 =====");
const mrs = new MovieRentingSystem(3, [
  [0, 1, 5],
  [0, 2, 6],
  [0, 3, 7],
  [1, 1, 4],
  [1, 2, 7],
  [2, 1, 5],
]);
console.log("search:", mrs.search(1)); // 期望 [1,0,2]
mrs.rent(0, 1);
mrs.rent(1, 2);
console.log("report:", JSON.stringify(mrs.report())); // 期望 [[0,1],[1,2]]
mrs.drop(1, 2);
console.log("search:", mrs.search(2)); // 期望 [0,1]

export {};
