// ============================================================
// 175. 点菜展示表
// ============================================================
// LeetCode 1418. Display Table of Food Orders in a Restaurant
// 给定订单 [[顾客名, 桌号, 菜品], ...]，返回展示表：
// 第一行为表头 ["Table", 菜品1, 菜品2, ...]（菜品按字典序），
// 每一行为一桌，按桌号升序，列出每道菜的数量（字符串形式）。

// 方法1：Map + 有序集合（O(orders * 1 + T log T + F log F)）
// 用 Map<桌号, Map<菜品, 数量>> 计数，集合去重后排序。
function displayTable(orders: string[][]): string[][] {
  const foodSet = new Set<string>();
  const tableMap = new Map<number, Map<string, number>>();
  for (const order of orders) {
    const table = parseInt(order[1], 10);
    const food = order[2];
    foodSet.add(food);
    if (!tableMap.has(table)) tableMap.set(table, new Map());
    const foodMap = tableMap.get(table)!;
    foodMap.set(food, (foodMap.get(food) ?? 0) + 1);
  }
  const foods = Array.from(foodSet).sort();
  const tables = Array.from(tableMap.keys()).sort((a, b) => a - b);
  const result: string[][] = [["Table", ...foods]];
  for (const t of tables) {
    const foodMap = tableMap.get(t)!;
    const row: string[] = [String(t)];
    for (const f of foods) {
      row.push(String(foodMap.get(f) ?? 0));
    }
    result.push(row);
  }
  return result;
}

// 方法2：对象哈希计数 + 排序（O(orders + T log T + F log F)）
// 用普通对象（Record）记录每桌菜品数量。
function displayTable2(orders: string[][]): string[][] {
  const tableFoodCount: Record<number, Record<string, number>> = {};
  const foodSet = new Set<string>();
  for (const order of orders) {
    const table = parseInt(order[1], 10);
    const food = order[2];
    if (!tableFoodCount[table]) tableFoodCount[table] = {};
    tableFoodCount[table][food] = (tableFoodCount[table][food] ?? 0) + 1;
    foodSet.add(food);
  }
  const foods = Array.from(foodSet).sort();
  const tables = Object.keys(tableFoodCount)
    .map(Number)
    .sort((a, b) => a - b);
  const result: string[][] = [["Table", ...foods]];
  for (const t of tables) {
    const row: string[] = [String(t)];
    for (const f of foods) {
      row.push(String(tableFoodCount[t][f] ?? 0));
    }
    result.push(row);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 175. 点菜展示表 =====");
const orders1 = [
  ["David", "3", "Ceviche"],
  ["Corina", "10", "Beef Burrito"],
  ["David", "3", "Fried Chicken"],
  ["Carla", "5", "Water"],
  ["Carla", "5", "Ceviche"],
  ["Rous", "3", "Ceviche"],
];
console.log("方法1:", JSON.stringify(displayTable(orders1)));
console.log("方法2:", JSON.stringify(displayTable2(orders1)));

export {};
