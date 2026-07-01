// ============================================================
// 107. 三数之和的多种可能
// ============================================================
// LeetCode 923. 3Sum With Multiplicity
// 统计满足 i<j<k 且 arr[i]+arr[j]+arr[k]==target 的三元组数量，
// 结果对 10^9+7 取模。值域 0..100，target 0..300。

// 方法1：排序 + 双指针（O(n^2) 时间，O(log n) 空间）
// 固定第一个数 i，用双指针在剩余区间寻找两数之和为 target-arr[i]。
function threeSumMulti(arr: number[], target: number): number {
  const MOD = 10 ** 9 + 7;
  const n = arr.length;
  arr.sort((a, b) => a - b);
  let result = 0;
  for (let i = 0; i < n - 2; i++) {
    let j = i + 1;
    let k = n - 1;
    const t = target - arr[i];
    while (j < k) {
      const sum = arr[j] + arr[k];
      if (sum < t) {
        j++;
      } else if (sum > t) {
        k--;
      } else {
        // arr[j] + arr[k] == t
        if (arr[j] === arr[k]) {
          // j..k 全部相同，任取两个的组合数 C(k-j+1, 2)
          const count = k - j + 1;
          result = (result + (count * (count - 1)) / 2) % MOD;
          break;
        } else {
          // 统计左值与右值各自的重复个数
          let leftCount = 1;
          while (j + 1 < k && arr[j] === arr[j + 1]) {
            j++;
            leftCount++;
          }
          let rightCount = 1;
          while (k - 1 > j && arr[k] === arr[k - 1]) {
            k--;
            rightCount++;
          }
          result = (result + leftCount * rightCount) % MOD;
          j++;
          k--;
        }
      }
    }
  }
  return result;
}

// 方法2：计数 + 组合（O(n + 101^2) 时间，O(101) 空间）
// 统计每个值出现次数，枚举两个值 x<=y，由 z=target-x-y 是否合法分类计算。
function threeSumMultiCount(arr: number[], target: number): number {
  const MOD = 10 ** 9 + 7;
  const count = new Array<number>(101).fill(0);
  for (const x of arr) count[x]++;
  let result = 0;
  for (let x = 0; x <= 100; x++) {
    if (count[x] === 0) continue;
    for (let y = x; y <= 100; y++) {
      if (count[y] === 0) continue;
      const z = target - x - y;
      if (z < y || z > 100) continue;
      if (count[z] === 0) continue;
      if (x === y && y === z) {
        // 三数相同：C(count[x], 3)
        const c = count[x];
        result = (result + (c * (c - 1) * (c - 2)) / 6) % MOD;
      } else if (x === y && y !== z) {
        // 前两数相同：C(count[x], 2) * count[z]
        const c = count[x];
        result = (result + ((c * (c - 1)) / 2) * count[z]) % MOD;
      } else if (x !== y && y === z) {
        // 后两数相同：count[x] * C(count[y], 2)
        const c = count[y];
        result = (result + count[x] * ((c * (c - 1)) / 2)) % MOD;
      } else {
        // 三数互异：count[x] * count[y] * count[z]
        result = (result + count[x] * count[y] * count[z]) % MOD;
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 107. 三数之和的多种可能 =====");
console.log("双指针:", threeSumMulti([1, 1, 2, 2, 2, 2], 5)); // 期望 12
console.log("双指针:", threeSumMulti([1, 1, 2, 2, 3, 3, 4, 4, 5, 5], 8)); // 期望 20
console.log("计数:", threeSumMultiCount([1, 1, 2, 2, 2, 2], 5)); // 期望 12
console.log("计数:", threeSumMultiCount([1, 1, 2, 2, 3, 3, 4, 4, 5, 5], 8)); // 期望 20

export {};
