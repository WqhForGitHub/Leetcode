// ============================================================
// 050. 小行星碰撞
// ============================================================
// LeetCode 735. Asteroid Collision
// 给定一个整数数组 asteroids，正数向右、负数向左，相撞时绝对值大的留下，相等都爆炸。

// ------------------------------------------------------------
// 方法1：栈
// ------------------------------------------------------------
// 当前向左（负）且栈顶向右（正）时碰撞，按规则处理。
// 时间 O(n)，空间 O(n)。
function asteroidCollision(asteroids: number[]): number[] {
  const stack: number[] = [];
  for (const ast of asteroids) {
    let alive = true;
    while (alive && ast < 0 && stack.length > 0 && stack[stack.length - 1] > 0) {
      // 碰撞
      if (stack[stack.length - 1] < -ast) {
        stack.pop(); // 栈顶爆炸，继续
      } else if (stack[stack.length - 1] === -ast) {
        stack.pop(); // 都爆炸
        alive = false;
      } else {
        // 当前爆炸
        alive = false;
      }
    }
    if (alive) stack.push(ast);
  }
  return stack;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1:', asteroidCollision([5, 10, -5]), '期望: [5,10]');
  console.log('测试2:', asteroidCollision([8, -8]), '期望: []');
  console.log('测试3:', asteroidCollision([10, 2, -5]), '期望: [10]');
  console.log('测试4:', asteroidCollision([-2, -1, 1, 2]), '期望: [-2,-1,1,2]');
}

test();

export {};
