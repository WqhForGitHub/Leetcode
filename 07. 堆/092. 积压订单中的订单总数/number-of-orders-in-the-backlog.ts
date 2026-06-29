// ============================================================
// 092. 积压订单中的订单总数
// ============================================================
// LeetCode 1801. Number of Orders in the Backlog
// 买卖订单按价格撮合，求积压订单总数。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：双堆（最大堆买单 + 最小堆卖单）
function getNumberOfBacklogOrders(orders: number[][]): number {
  const MOD = 1000000007;
  // 买单最大堆
  const buy: Array<{ price: number; amt: number }> = [];
  // 卖单最小堆
  const sell: Array<{ price: number; amt: number }> = [];
  const pushBuy = (v: { price: number; amt: number }): void => {
    buy.push(v);
    let i = buy.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (buy[i].price > buy[p].price) {
        [buy[i], buy[p]] = [buy[p], buy[i]];
        i = p;
      } else break;
    }
  };
  const popBuy = (): { price: number; amt: number } | undefined => {
    if (buy.length === 0) return undefined;
    const top = buy[0];
    const last = buy.pop()!;
    if (buy.length > 0) {
      buy[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < buy.length && buy[l].price > buy[s].price) s = l;
        if (r < buy.length && buy[r].price > buy[s].price) s = r;
        if (s !== i) {
          [buy[i], buy[s]] = [buy[s], buy[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  const pushSell = (v: { price: number; amt: number }): void => {
    sell.push(v);
    let i = sell.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (sell[i].price < sell[p].price) {
        [sell[i], sell[p]] = [sell[p], sell[i]];
        i = p;
      } else break;
    }
  };
  const popSell = (): { price: number; amt: number } | undefined => {
    if (sell.length === 0) return undefined;
    const top = sell[0];
    const last = sell.pop()!;
    if (sell.length > 0) {
      sell[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < sell.length && sell[l].price < sell[s].price) s = l;
        if (r < sell.length && sell[r].price < sell[s].price) s = r;
        if (s !== i) {
          [sell[i], sell[s]] = [sell[s], sell[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  for (const [price, amount, type] of orders) {
    if (type === 0) {
      // 买单
      while (amount > 0 && sell.length > 0 && sell[0].price <= price) {
        const top = sell[0];
        if (top.amt > amount) {
          top.amt -= amount;
          amount = 0;
        } else {
          amount -= top.amt;
          popSell();
        }
      }
      if (amount > 0) pushBuy({ price, amt: amount });
    } else {
      // 卖单
      while (amount > 0 && buy.length > 0 && buy[0].price >= price) {
        const top = buy[0];
        if (top.amt > amount) {
          top.amt -= amount;
          amount = 0;
        } else {
          amount -= top.amt;
          popBuy();
        }
      }
      if (amount > 0) pushSell({ price, amt: amount });
    }
  }
  let result = 0;
  for (const { amt } of buy) result = (result + amt) % MOD;
  for (const { amt } of sell) result = (result + amt) % MOD;
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 092. 积压订单中的订单总数 =====");
console.log("总数:", getNumberOfBacklogOrders([[10, 5, 0], [15, 2, 1], [25, 1, 1], [30, 4, 0]])); // 期望 6
console.log("总数:", getNumberOfBacklogOrders([[7, 1000000000, 1], [15, 3, 0], [5, 999999995, 0], [5, 1, 1]])); // 期望 999999984

export {};
