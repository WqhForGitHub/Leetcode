// ============================================================
// 091. 从给定原材料中找到所有可以做出的菜
// ============================================================
// LeetCode 2115. Find All Possible Recipes from Given Supplies
// recipes 菜谱，ingredients[i] 为所需原材料，supplies 初始拥有。
// 返回能做出的所有菜（已做出的菜可作为后续菜的原材料）。
// 时间复杂度：O(N + E)，空间复杂度：O(N + E)

// 方法1：拓扑排序 Kahn（推荐）
// 把"做菜"建成依赖图：做菜 r 依赖每个原材料；若原材料是另一道菜，则建立 r -> ingredient 的入边。
// 入度为 0 表示所有原材料都已就绪，可入队并产出去更新依赖它的菜。
function findAllRecipes(recipes: string[], ingredients: string[][], supplies: string[]): string[] {
  const supplySet = new Set<string>(supplies);
  // 邻接表：原材料 -> 依赖它的菜
  const graph = new Map<string, string[]>();
  const indegree = new Map<string, number>();
  for (let i = 0; i < recipes.length; i++) {
    let need = 0;
    for (const ing of ingredients[i]) {
      if (!supplySet.has(ing)) {
        // 缺失的原材料才作为依赖
        need++;
        if (!graph.has(ing)) graph.set(ing, []);
        graph.get(ing)!.push(recipes[i]);
      }
    }
    indegree.set(recipes[i], need);
  }

  const queue: string[] = [];
  for (const r of recipes) {
    if (indegree.get(r) === 0) queue.push(r);
  }

  const result: string[] = [];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    result.push(cur);
    // 当前菜做出来后，可解锁依赖它的菜
    if (graph.has(cur)) {
      for (const next of graph.get(cur)!) {
        const d = indegree.get(next)! - 1;
        indegree.set(next, d);
        if (d === 0) queue.push(next);
      }
    }
  }
  return result;
}

// 方法2：DFS 记忆化
// state: 0=未访问, 1=访问中, 2=可做, 3=不可做
function findAllRecipesDFS(
  recipes: string[],
  ingredients: string[][],
  supplies: string[],
): string[] {
  const supplySet = new Set<string>(supplies);
  const recipeIndex = new Map<string, number>();
  for (let i = 0; i < recipes.length; i++) recipeIndex.set(recipes[i], i);
  const state = new Map<string, number>(); // 菜名 -> 状态

  const dfs = (name: string): boolean => {
    if (supplySet.has(name)) return true;
    if (!recipeIndex.has(name)) return false; // 既非供应也非菜谱，做不出
    if (state.get(name) === 2) return true;
    if (state.get(name) === 3) return false;
    if (state.get(name) === 1) return false; // 出现环，做不出

    state.set(name, 1);
    const idx = recipeIndex.get(name)!;
    let ok = true;
    for (const ing of ingredients[idx]) {
      if (!dfs(ing)) {
        ok = false;
        break;
      }
    }
    state.set(name, ok ? 2 : 3);
    return ok;
  };

  const result: string[] = [];
  for (const r of recipes) {
    if (dfs(r)) result.push(r);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 091. 从给定原材料中找到所有可以做出的菜 =====");
console.log(findAllRecipes(["bread"], [["yeast", "flour"]], ["yeast", "flour", "corn"])); // 期望: ["bread"]

console.log(
  findAllRecipes(
    ["bread", "sandwich"],
    [
      ["yeast", "flour"],
      ["bread", "meat"],
    ],
    ["yeast", "flour", "meat"],
  ),
); // 期望: ["bread","sandwich"]

console.log(
  findAllRecipes(
    ["bread", "sandwich", "burger"],
    [
      ["yeast", "flour"],
      ["bread", "meat"],
      ["sandwich", "meat", "bread"],
    ],
    ["yeast", "flour", "meat"],
  ),
); // 期望: ["bread","sandwich","burger"]

console.log(
  findAllRecipesDFS(
    ["bread", "sandwich", "burger"],
    [
      ["yeast", "flour"],
      ["bread", "meat"],
      ["sandwich", "meat", "bread"],
    ],
    ["yeast", "flour", "meat"],
  ),
); // 期望: ["bread","sandwich","burger"]

export {};
