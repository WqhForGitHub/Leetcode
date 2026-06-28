// ============================================================
// 122. 键值映射
// ============================================================
// LeetCode 677. Map Sum Pairs
// 实现 MapSum 类，支持 insert(key, val) 和 sum(prefix)。
// sum 返回所有以 prefix 为前缀的 key 对应 val 之和。
// 时间复杂度：insert O(L)，sum O(N*L)；空间复杂度：O(N*L)

class MapSum {
  // key -> val
  private map = new Map<string, number>();

  insert(key: string, val: number): void {
    this.map.set(key, val);
  }

  sum(prefix: string): number {
    let total = 0;
    for (const [key, val] of this.map) {
      if (key.startsWith(prefix)) {
        total += val;
      }
    }
    return total;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 122. 键值映射 =====");
const mapSum = new MapSum();
mapSum.insert("apple", 3);
console.log(mapSum.sum("ap")); // 期望: 3
mapSum.insert("app", 2);
console.log(mapSum.sum("ap")); // 期望: 5
mapSum.insert("apple", 5); // 更新
console.log(mapSum.sum("ap")); // 期望: 7
console.log(mapSum.sum("b")); // 期望: 0

export {};
