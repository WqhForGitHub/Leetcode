// ============================================================
// 077. 基于时间的键值存储
// ============================================================
// LeetCode 981. Time Based Key-Value Store
// 设计数据结构，能设置 key-value-timestamp 并查询某时刻 <= timestamp 的值。

// 方法1：Map + 数组 + 二分查找
class TimeMap {
  private map: Map<string, [number, string][]>;

  constructor() {
    this.map = new Map();
  }

  set(key: string, value: string, timestamp: number): void {
    if (!this.map.has(key)) {
      this.map.set(key, []);
    }
    this.map.get(key)!.push([timestamp, value]);
  }

  get(key: string, timestamp: number): string {
    if (!this.map.has(key)) return "";
    const arr = this.map.get(key)!;
    // 二分找 <= timestamp 的最大时间戳
    let left = 0;
    let right = arr.length - 1;
    let result = "";
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid][0] <= timestamp) {
        result = arr[mid][1];
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return result;
  }
}

// 方法2：Map + Map（适合时间戳唯一）
class TimeMapSimple {
  private data: Map<string, Map<number, string>>;
  private sortedKeys: Map<string, number[]>;

  constructor() {
    this.data = new Map();
    this.sortedKeys = new Map();
  }

  set(key: string, value: string, timestamp: number): void {
    if (!this.data.has(key)) {
      this.data.set(key, new Map());
      this.sortedKeys.set(key, []);
    }
    this.data.get(key)!.set(timestamp, value);
    this.sortedKeys.get(key)!.push(timestamp);
  }

  get(key: string, timestamp: number): string {
    if (!this.data.has(key)) return "";
    const timestamps = this.sortedKeys.get(key)!;
    let left = 0;
    let right = timestamps.length - 1;
    let result = -1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (timestamps[mid] <= timestamp) {
        result = timestamps[mid];
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    if (result === -1) return "";
    return this.data.get(key)!.get(result)!;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 077. 基于时间的键值存储 =====");
const tm = new TimeMap();
tm.set("foo", "bar", 1);
console.log("get(1):", tm.get("foo", 1)); // "bar"
console.log("get(3):", tm.get("foo", 3)); // "bar"
tm.set("foo", "bar2", 4);
console.log("get(4):", tm.get("foo", 4)); // "bar2"
console.log("get(5):", tm.get("foo", 5)); // "bar2"

export {};
