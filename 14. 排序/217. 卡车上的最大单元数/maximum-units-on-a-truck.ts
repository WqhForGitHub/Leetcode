// ============================================================
// 217. 卡车上的最大单元数
// ============================================================
// LeetCode 1710. Maximum Units on a Truck
// boxTypes[i] = [numberOfBoxes, unitsPerBox]，卡车最多装 truckSize 个箱子。
// 求可装载的最大单元数。

// 方法1：按单元数降序 + 贪心选取（O(n log n)）
function maximumUnits(boxTypes: number[][], truckSize: number): number {
  boxTypes.sort((a, b) => b[1] - a[1]);
  let units = 0;
  let remaining = truckSize;
  for (const [boxes, perBox] of boxTypes) {
    const take = Math.min(boxes, remaining);
    units += take * perBox;
    remaining -= take;
    if (remaining === 0) break;
  }
  return units;
}

// 方法2：按单元数降序 + reduce 累计（O(n log n)）
function maximumUnits2(boxTypes: number[][], truckSize: number): number {
  const sorted = [...boxTypes].sort((a, b) => b[1] - a[1]);
  let remaining = truckSize;
  return sorted.reduce((total, [boxes, perBox]) => {
    if (remaining <= 0) return total;
    const take = Math.min(boxes, remaining);
    remaining -= take;
    return total + take * perBox;
  }, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 217. 卡车上的最大单元数 =====");
console.log(
  "方法1 [[1,3],[2,2],[3,1]],4:",
  maximumUnits(
    [
      [1, 3],
      [2, 2],
      [3, 1],
    ],
    4,
  ),
); // 8
console.log(
  "方法1 [[5,10],[2,5],[4,7],[3,9]],10:",
  maximumUnits(
    [
      [5, 10],
      [2, 5],
      [4, 7],
      [3, 9],
    ],
    10,
  ),
); // 91
console.log(
  "方法2 [[1,3],[2,2],[3,1]],4:",
  maximumUnits2(
    [
      [1, 3],
      [2, 2],
      [3, 1],
    ],
    4,
  ),
); // 8
console.log(
  "方法2 [[5,10],[2,5],[4,7],[3,9]],10:",
  maximumUnits2(
    [
      [5, 10],
      [2, 5],
      [4, 7],
      [3, 9],
    ],
    10,
  ),
); // 91

export {};
