// ============================================================
// 129. 套餐内商品的排列顺序
// ============================================================
// 面试金典 / LeetCode 47. 全排列 II
// 给定一组可能包含重复的商品，返回所有不重复的排列顺序。
// 时间复杂度：O(N*N!), 空间复杂度：O(N)

// 方法1：排序+回溯+去重 (推荐)
// 先排序使相同元素相邻，回溯时若当前元素与前一个相同且前一个未被使用，
// 则跳过以避免产生重复排列。
// 时间复杂度 O(N*N!), 空间复杂度 O(N)
function permuteProducts(products: string[]): string[][] {
  const sorted: string[] = [...products].sort();
  const n: number = sorted.length;
  const result: string[][] = [];
  const path: string[] = [];
  const used: boolean[] = new Array(n).fill(false);

  const backtrack = (): void => {
    if (path.length === n) {
      result.push([...path]);
      return;
    }
    for (let i: number = 0; i < n; i++) {
      // 已使用的元素跳过
      if (used[i]) {
        continue;
      }
      // 去重：当前元素与前一个相同，且前一个未使用（说明同层已处理过该值）
      if (i > 0 && sorted[i] === sorted[i - 1] && !used[i - 1]) {
        continue;
      }
      used[i] = true;
      path.push(sorted[i]);
      backtrack();
      path.pop();
      used[i] = false;
    }
  };

  backtrack();
  return result;
}

// 方法2：计数+回溯
// 统计每个商品的出现次数，回溯时按不同商品值选取，天然避免重复。
// 时间复杂度 O(N*N!), 空间复杂度 O(N)
function permuteProductsCount(products: string[]): string[][] {
  const count: Map<string, number> = new Map();
  for (const p of products) {
    count.set(p, (count.get(p) ?? 0) + 1);
  }
  // 取出唯一值并排序保证输出顺序稳定
  const keys: string[] = [...count.keys()].sort();
  const n: number = products.length;
  const result: string[][] = [];
  const path: string[] = [];

  const backtrack = (): void => {
    if (path.length === n) {
      result.push([...path]);
      return;
    }
    for (const k of keys) {
      const cnt: number = count.get(k) ?? 0;
      if (cnt === 0) {
        continue;
      }
      count.set(k, cnt - 1);
      path.push(k);
      backtrack();
      path.pop();
      count.set(k, cnt);
    }
  };

  backtrack();
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 129. 套餐内商品的排列顺序 =====");
console.log(permuteProducts(["a", "b", "b"]));
// 期望结果: [["a","b","b"],["b","a","b"],["b","b","a"]]
console.log(permuteProductsCount(["a", "b", "b"]));
// 期望结果: [["a","b","b"],["b","a","b"],["b","b","a"]]
console.log(permuteProducts(["a", "a", "a"]));
// 期望结果: [["a","a","a"]]
console.log(permuteProductsCount(["a", "a", "a"]));
// 期望结果: [["a","a","a"]]

export {};
