// ============================================================
// 043. 大礼包
// ============================================================
// LeetCode 638. Shopping Offers
// 在LeetCode的商店中，有许多在售的物品。给定每个物品的单价和每个大礼包包含的物品清单，
// 以及待购清单。求购买指定数量物品的最低花费。可以使用大礼包任意多次，但不能购买超出待购数量的物品。
// 时间复杂度：O(...), 空间复杂度：O(...)

// 方法1：回溯(尝试每个大礼包) (推荐)
// 对每个大礼包进行尝试，如果该大礼包不会导致购买数量超出需求，则递归使用；
// 否则不使用大礼包，直接按单价购买剩余物品。
// 时间复杂度 O(n * m^k) 其中 n 为物品种类数, m 为大礼包数, k 为递归深度, 空间复杂度 O(k)
function shoppingOffers(price: number[], special: number[][], needs: number[]): number {
  // 检查使用某个大礼包是否合法（不超量）
  const canUse = (offer: number[], needs: number[]): boolean => {
    for (let i = 0; i < needs.length; i++) {
      if (offer[i] > needs[i]) return false;
    }
    return true;
  };

  // 计算不使用大礼包时的总花费（按单价）
  const directCost = (needs: number[]): number => {
    let total = 0;
    for (let i = 0; i < needs.length; i++) {
      total += needs[i] * price[i];
    }
    return total;
  };

  const backtrack = (needs: number[]): number => {
    // 基准情况：当前按单价购买的花费
    let minCost = directCost(needs);

    // 尝试每个大礼包
    for (const offer of special) {
      if (!canUse(offer, needs)) continue;
      // 使用该大礼包，更新需求
      const newNeeds: number[] = [];
      for (let i = 0; i < needs.length; i++) {
        newNeeds.push(needs[i] - offer[i]);
      }
      // 递归求解，加上大礼包价格
      const cost = offer[offer.length - 1] + backtrack(newNeeds);
      if (cost < minCost) minCost = cost;
    }
    return minCost;
  };

  return backtrack(needs);
}

// 方法2：回溯+记忆化
// 使用字符串作为key缓存已经求解过的needs状态，避免重复计算
// 时间复杂度 O(状态数 * 大礼包数) 其中状态数为各物品数量组合数, 空间复杂度 O(状态数)
function shoppingOffersMemo(price: number[], special: number[][], needs: number[]): number {
  const memo = new Map<string, number>();

  const canUse = (offer: number[], needs: number[]): boolean => {
    for (let i = 0; i < needs.length; i++) {
      if (offer[i] > needs[i]) return false;
    }
    return true;
  };

  const directCost = (needs: number[]): number => {
    let total = 0;
    for (let i = 0; i < needs.length; i++) {
      total += needs[i] * price[i];
    }
    return total;
  };

  const keyOf = (needs: number[]): string => needs.join(",");

  const backtrack = (needs: number[]): number => {
    const key = keyOf(needs);
    if (memo.has(key)) return memo.get(key)!;

    let minCost = directCost(needs);

    for (const offer of special) {
      if (!canUse(offer, needs)) continue;
      const newNeeds: number[] = [];
      for (let i = 0; i < needs.length; i++) {
        newNeeds.push(needs[i] - offer[i]);
      }
      const cost = offer[offer.length - 1] + backtrack(newNeeds);
      if (cost < minCost) minCost = cost;
    }

    memo.set(key, minCost);
    return minCost;
  };

  return backtrack(needs);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 043. 大礼包 =====");
console.log(
  shoppingOffers(
    [2, 5],
    [
      [3, 0, 5],
      [1, 2, 10],
    ],
    [3, 2],
  ),
); // 期望结果: 14
console.log(
  shoppingOffers(
    [2, 3, 4],
    [
      [1, 1, 0, 4],
      [2, 2, 1, 9],
    ],
    [1, 2, 1],
  ),
); // 期望结果: 11
console.log(
  shoppingOffersMemo(
    [2, 5],
    [
      [3, 0, 5],
      [1, 2, 10],
    ],
    [3, 2],
  ),
); // 期望结果: 14
console.log(
  shoppingOffersMemo(
    [2, 3, 4],
    [
      [1, 1, 0, 4],
      [2, 2, 1, 9],
    ],
    [1, 2, 1],
  ),
); // 期望结果: 11

export {};
