// ============================================================
// 249. 游戏中弱角色的数量
// ============================================================
// LeetCode 1996. The Number of Weak Characters in the Game
// properties[i] = [attack, defense]。若另一角色攻击和防御都严格大于当前角色，
// 则当前角色为弱角色。返回弱角色数量。

// 方法1：按攻击降序 + 防御升序 + 维护最大防御（O(n log n)）
// 攻击降序保证前面的攻击 >= 后面，防御升序保证相同攻击时不会误判
function numberOfWeakCharacters(properties: number[][]): number {
  properties.sort((a, b) => {
    if (a[0] !== b[0]) return b[0] - a[0];
    return a[1] - b[1];
  });
  let count = 0;
  let maxDef = 0;
  for (const [, def] of properties) {
    if (def < maxDef) {
      count++;
    } else {
      maxDef = def;
    }
  }
  return count;
}

// 方法2：按攻击升序 + 后缀最大防御 + 二分查找（O(n log n)）
// 对每个元素，找攻击严格大于它的元素中，防御最大值是否 > 当前防御
function numberOfWeakCharacters2(properties: number[][]): number {
  // 按攻击升序排序
  properties.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const n = properties.length;
  // suffixMaxDef[i] = 从 i 到末尾的最大防御值
  const suffixMaxDef = new Array<number>(n);
  suffixMaxDef[n - 1] = properties[n - 1][1];
  for (let i = n - 2; i >= 0; i--) {
    suffixMaxDef[i] = Math.max(suffixMaxDef[i + 1], properties[i][1]);
  }
  let count = 0;
  for (let i = 0; i < n; i++) {
    // 二分查找第一个攻击严格大于当前元素的位置
    let lo = i + 1;
    let hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (properties[mid][0] > properties[i][0]) hi = mid;
      else lo = mid + 1;
    }
    // lo 是第一个攻击严格大于的位置
    if (lo < n && suffixMaxDef[lo] > properties[i][1]) {
      count++;
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 249. 游戏中弱角色的数量 =====");
console.log(
  "方法1:",
  numberOfWeakCharacters([
    [5, 5],
    [6, 3],
    [3, 6],
  ]),
); // 0
console.log(
  "方法2:",
  numberOfWeakCharacters2([
    [5, 5],
    [6, 3],
    [3, 6],
  ]),
); // 0
console.log(
  "方法1:",
  numberOfWeakCharacters([
    [2, 2],
    [3, 3],
  ]),
); // 1
console.log(
  "方法2:",
  numberOfWeakCharacters2([
    [2, 2],
    [3, 3],
  ]),
); // 1
console.log(
  "方法1:",
  numberOfWeakCharacters([
    [1, 5],
    [10, 4],
    [4, 3],
  ]),
); // 1
console.log(
  "方法2:",
  numberOfWeakCharacters2([
    [1, 5],
    [10, 4],
    [4, 3],
  ]),
); // 1
console.log(
  "方法1:",
  numberOfWeakCharacters([
    [1, 1],
    [2, 2],
    [3, 3],
  ]),
); // 2
console.log(
  "方法2:",
  numberOfWeakCharacters2([
    [1, 1],
    [2, 2],
    [3, 3],
  ]),
); // 2

export {};
