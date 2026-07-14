// ============================================================
// 250. 数组的最大公因数排序
// ============================================================
// LeetCode 1998. GCD Sort of an Array
// 给定一个整数数组 nums，若两个元素的最大公因数大于 1，则可以交换它们；
// 也可以通过链式 GCD 关系间接交换。判断能否通过这种交换使数组非递减排序。

// 方法1：并查集 + 埃氏筛预处理最小质因数 + 比较原数组与排序数组同位置分组
// 时间复杂度 O(n * sqrt(M) + M log log M + n log n)
function gcdSort1(nums: number[]): boolean {
  if (nums.length <= 1) return true;
  const maxVal = Math.max(...nums);
  // 预处理最小质因数
  const spf: number[] = new Array(maxVal + 1);
  for (let i = 0; i <= maxVal; i++) spf[i] = i;
  for (let i = 2; i * i <= maxVal; i++) {
    if (spf[i] === i) {
      for (let j = i * i; j <= maxVal; j += i) {
        if (spf[j] === j) spf[j] = i;
      }
    }
  }
  const parent: number[] = new Array(maxVal + 1);
  for (let i = 0; i <= maxVal; i++) parent[i] = i;
  function find(x: number): number {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a: number, b: number): void {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  }
  // 获取所有质因数
  function getPrimes(v: number): number[] {
    const res: number[] = [];
    let x = v;
    while (x > 1) {
      const p = spf[x];
      res.push(p);
      while (x % p === 0) x = Math.floor(x / p);
    }
    return res;
  }
  // 把同一数字的所有质因数合并到一起
  for (const v of nums) {
    if (v === 1) continue;
    const primes = getPrimes(v);
    for (let i = 1; i < primes.length; i++) {
      union(primes[0], primes[i]);
    }
  }
  const sorted = [...nums].sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === sorted[i]) continue;
    if (nums[i] === 1 || sorted[i] === 1) return false;
    if (find(nums[i]) !== find(sorted[i])) return false;
  }
  return true;
}

// 方法2：并查集按质因数分组 + 验证每个位置上原数组与排序数组元素属于同一连通分量
// 时间复杂度 O(n * sqrt(M) + M log log M + n log n)
function gcdSort2(nums: number[]): boolean {
  if (nums.length <= 1) return true;
  const maxVal = Math.max(...nums);
  const parent: Map<number, number> = new Map();
  function find(x: number): number {
    if (!parent.has(x)) parent.set(x, x);
    let root = x;
    while (parent.get(root)! !== root) root = parent.get(root)!;
    let cur = x;
    while (parent.get(cur)! !== root) {
      const nxt = parent.get(cur)!;
      parent.set(cur, root);
      cur = nxt;
    }
    return root;
  }
  function union(a: number, b: number): void {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  }
  function getPrimes(v: number): number[] {
    const res: number[] = [];
    let x = v;
    for (let i = 2; i * i <= x; i++) {
      if (x % i === 0) {
        res.push(i);
        while (x % i === 0) x = Math.floor(x / i);
      }
    }
    if (x > 1) res.push(x);
    return res;
  }
  for (const v of nums) {
    if (v <= 1) continue;
    const primes = getPrimes(v);
    for (let i = 1; i < primes.length; i++) union(primes[0], primes[i]);
  }
  const sorted = [...nums].sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === sorted[i]) continue;
    if (nums[i] === 1 || sorted[i] === 1) return false;
    if (find(nums[i]) !== find(sorted[i])) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 250. 数组的最大公因数排序 =====");
console.log("方法1 [7,2,5,4]:", gcdSort1([7, 2, 5, 4]));
console.log("方法1 [3,2,1]:", gcdSort1([3, 2, 1]));
console.log("方法1 [5,2,6,2]:", gcdSort1([5, 2, 6, 2]));
console.log("方法2 [7,2,5,4]:", gcdSort2([7, 2, 5, 4]));
console.log("方法2 [3,2,1]:", gcdSort2([3, 2, 1]));
console.log("方法2 [5,2,6,2]:", gcdSort2([5, 2, 6, 2]));

export {};
