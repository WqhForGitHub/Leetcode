// ============================================================
// 052. 设计共享出行系统
// ============================================================
// LeetCode 周赛题. 设计共享出行系统
// 设计共享出行系统，支持添加乘客、匹配车辆、下车结算等功能。

// ------------------------------------------------------------
// 方法1：优先队列 + 哈希表
// ------------------------------------------------------------
// 用优先队列按位置排序维护可用车辆，哈希表维护乘客信息。
// 时间 O(log n) addCar/pickup/dropoff，空间 O(n)。
class SharedRideSystem1 {
  private cars: Map<number, { id: number; position: number; available: boolean }> = new Map();
  private availableCars: number[] = []; // 最小堆按位置排序
  private passengers: Map<number, { carId: number; position: number }> = new Map();

  addCar(carId: number, position: number): void {
    this.cars.set(carId, { id: carId, position, available: true });
    this.availableCars.push(carId);
    // 上浮
    let i = this.availableCars.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (
        this.cars.get(this.availableCars[p])!.position <=
        this.cars.get(this.availableCars[i])!.position
      )
        break;
      [this.availableCars[p], this.availableCars[i]] = [
        this.availableCars[i],
        this.availableCars[p],
      ];
      i = p;
    }
  }

  pickup(passengerId: number, position: number): number {
    // 找最近的可用车辆
    while (this.availableCars.length > 0) {
      const carId = this.availableCars[0];
      const car = this.cars.get(carId)!;
      if (!car.available) {
        this.availableCars[0] = this.availableCars[this.availableCars.length - 1];
        this.availableCars.pop();
        this.heapDown();
        continue;
      }
      car.available = false;
      this.passengers.set(passengerId, { carId, position });
      // 弹出堆顶
      this.availableCars[0] = this.availableCars[this.availableCars.length - 1];
      this.availableCars.pop();
      this.heapDown();
      return carId;
    }
    return -1;
  }

  private heapDown(): void {
    let i = 0;
    const n = this.availableCars.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let smallest = i;
      if (
        l < n &&
        this.cars.get(this.availableCars[l])!.position <
          this.cars.get(this.availableCars[smallest])!.position
      )
        smallest = l;
      if (
        r < n &&
        this.cars.get(this.availableCars[r])!.position <
          this.cars.get(this.availableCars[smallest])!.position
      )
        smallest = r;
      if (smallest === i) break;
      [this.availableCars[smallest], this.availableCars[i]] = [
        this.availableCars[i],
        this.availableCars[smallest],
      ];
      i = smallest;
    }
  }

  dropoff(passengerId: number): number {
    const p = this.passengers.get(passengerId);
    if (!p) return -1;
    const car = this.cars.get(p.carId)!;
    car.available = true;
    // 重新入堆
    this.availableCars.push(p.carId);
    let i = this.availableCars.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (
        this.cars.get(this.availableCars[parent])!.position <=
        this.cars.get(this.availableCars[i])!.position
      )
        break;
      [this.availableCars[parent], this.availableCars[i]] = [
        this.availableCars[i],
        this.availableCars[parent],
      ];
      i = parent;
    }
    this.passengers.delete(passengerId);
    return p.carId;
  }
}

// ------------------------------------------------------------
// 方法2：排序数组 + 线性查找
// ------------------------------------------------------------
// 用排序数组维护可用车辆，pickup 时线性扫描找最近车辆。
// 时间 O(n) pickup，O(log n) addCar；空间 O(n)。
class SharedRideSystem2 {
  private cars: Map<number, { id: number; position: number; available: boolean }> = new Map();
  private passengers: Map<number, number> = new Map();

  addCar(carId: number, position: number): void {
    this.cars.set(carId, { id: carId, position, available: true });
  }

  pickup(passengerId: number, position: number): number {
    let bestCar = -1;
    let bestDist = Infinity;
    for (const [carId, car] of this.cars) {
      if (car.available) {
        const dist = Math.abs(car.position - position);
        if (dist < bestDist || (dist === bestDist && carId < bestCar)) {
          bestDist = dist;
          bestCar = carId;
        }
      }
    }
    if (bestCar >= 0) {
      this.cars.get(bestCar)!.available = false;
      this.passengers.set(passengerId, bestCar);
    }
    return bestCar;
  }

  dropoff(passengerId: number): number {
    const carId = this.passengers.get(passengerId);
    if (carId === undefined) return -1;
    this.cars.get(carId)!.available = true;
    this.passengers.delete(passengerId);
    return carId;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const s1 = new SharedRideSystem1();
  s1.addCar(1, 5);
  s1.addCar(2, 10);
  s1.addCar(3, 3);
  console.log("测试1 pickup:", s1.pickup(100, 4), "期望: 3");
  console.log("测试2 pickup:", s1.pickup(101, 8), "期望: 1");
  console.log("测试3 dropoff:", s1.dropoff(100), "期望: 3");
  console.log("测试4 pickup:", s1.pickup(102, 2), "期望: 3");

  const s2 = new SharedRideSystem2();
  s2.addCar(1, 1);
  s2.addCar(2, 10);
  console.log("测试5 pickup:", s2.pickup(200, 5), "期望: 1");
  console.log("测试6 dropoff:", s2.dropoff(200), "期望: 1");
}

test();

export {};
