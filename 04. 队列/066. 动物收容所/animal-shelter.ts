// ============================================================
// 066. 动物收容所
// ============================================================
// LeetCode LCR 042 / 剑指 Offer 41. 动物收容所
// 动物收容所有猫和狗，收养人可以收养最老的动物、最老的猫或最老的狗。
// 实现入队和各种出队操作。

// ------------------------------------------------------------
// 方法1：两个队列（猫队列 + 狗队列）
// ------------------------------------------------------------
// 用两个队列分别存储猫和狗，按时间戳排序。
// 收养全部时比较两个队首的时间戳取最老的。
// 时间 O(1) 入队/出队，空间 O(n)。
class AnimalShelf1 {
  private cats: [number, number][] = []; // [动物编号, 入队序号]
  private dogs: [number, number][] = [];
  private order: number = 0;

  enqueue(animal: number[]): void {
    const [animalType, animalId] = animal; // animalType: 0=猫, 1=狗
    if (animalType === 0) {
      this.cats.push([animalId, this.order++]);
    } else {
      this.dogs.push([animalId, this.order++]);
    }
  }

  dequeueAny(): number[] {
    if (this.cats.length === 0 && this.dogs.length === 0) return [-1, -1];
    if (this.cats.length === 0) return this.dequeueDog();
    if (this.dogs.length === 0) return this.dequeueCat();
    if (this.cats[0][1] < this.dogs[0][1]) {
      return this.dequeueCat();
    } else {
      return this.dequeueDog();
    }
  }

  dequeueDog(): number[] {
    if (this.dogs.length === 0) return [-1, -1];
    const [animalId] = this.dogs.shift()!;
    return [1, animalId];
  }

  dequeueCat(): number[] {
    if (this.cats.length === 0) return [-1, -1];
    const [animalId] = this.cats.shift()!;
    return [0, animalId];
  }
}

// ------------------------------------------------------------
// 方法2：单队列 + 过滤
// ------------------------------------------------------------
// 用一个队列存储所有动物，出队时按条件过滤。
// 时间 O(n) dequeueDog/Cat，O(1) enqueue；空间 O(n)。
class AnimalShelf2 {
  private queue: { type: number; id: number; order: number }[] = [];
  private order: number = 0;

  enqueue(animal: number[]): void {
    const [animalType, animalId] = animal;
    this.queue.push({ type: animalType, id: animalId, order: this.order++ });
  }

  dequeueAny(): number[] {
    if (this.queue.length === 0) return [-1, -1];
    const animal = this.queue.shift()!;
    return [animal.type, animal.id];
  }

  dequeueDog(): number[] {
    const idx = this.queue.findIndex((a) => a.type === 1);
    if (idx === -1) return [-1, -1];
    const animal = this.queue.splice(idx, 1)[0];
    return [animal.type, animal.id];
  }

  dequeueCat(): number[] {
    const idx = this.queue.findIndex((a) => a.type === 0);
    if (idx === -1) return [-1, -1];
    const animal = this.queue.splice(idx, 1)[0];
    return [animal.type, animal.id];
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const s1 = new AnimalShelf1();
  s1.enqueue([0, 0]); // 猫 0
  s1.enqueue([1, 1]); // 狗 1
  s1.enqueue([0, 2]); // 猫 2
  console.log(
    "测试1 dequeueAny:",
    JSON.stringify(s1.dequeueAny()),
    "期望: [0,0]",
  );
  console.log(
    "测试2 dequeueDog:",
    JSON.stringify(s1.dequeueDog()),
    "期望: [1,1]",
  );
  console.log(
    "测试3 dequeueCat:",
    JSON.stringify(s1.dequeueCat()),
    "期望: [0,2]",
  );
  console.log(
    "测试4 dequeueAny:",
    JSON.stringify(s1.dequeueAny()),
    "期望: [-1,-1]",
  );

  const s2 = new AnimalShelf2();
  s2.enqueue([1, 10]);
  s2.enqueue([0, 20]);
  s2.enqueue([1, 30]);
  console.log(
    "测试5 dequeueCat:",
    JSON.stringify(s2.dequeueCat()),
    "期望: [0,20]",
  );
  console.log(
    "测试6 dequeueAny:",
    JSON.stringify(s2.dequeueAny()),
    "期望: [1,10]",
  );
}

test();

export {};
