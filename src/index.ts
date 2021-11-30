
/**
 * Nums类
 */
export
class Nums {
  /**
   * 构造函数
   * @param nums 数组
   */
  public constructor(
    private nums: number[],
  ) { }

  /**
   * 数组访问器
   */
  public get Nums() {
    return this.nums;
  }

  /**
   * 规范化end，start索引
   * @param end end索引
   * @param start start索引
   * @returns 规范化之后的end，start索引
   */
  public normalizeEndStart(
    end?: number,
    start?: number,
  ) {
    return [
      end != null && end >= 0 ? end : this.nums.length,
      start != null && start >= 0 ? start : 0,
    ];
  }

  /**
   * 规范化size
   * @param size size
   * @returns 规范化之后的size
   */
  public normalizeSize(
    size: number,
  ) {
    return size < 1 ? 1 : Math.floor(size);
  }

  /**
   * 切片
   * @param end 结束索引
   * @param start 开始索引
   * @returns 切片
   */
  public slice(end?: number, start?: number) {
    const [iend, istart] = this.normalizeEndStart(end, start);
    return new Nums(this.nums.slice(istart, iend));
  }

  /**
   * 获取最小值
   * @returns 最小值
   */
  public min() {
    return Math.min(...this.nums);
  }

  /**
   * 获取最大值
   * @returns 最大值
   */
  public max() {
    return Math.max(...this.nums);
  }

  /**
   * 数组求和
   * @returns 和
   */
  public sum() {
    let sum = 0;
    this.nums.forEach((num) => sum += num);
    return sum;
  }

  /**
   * 数组求平均值
   * @returns 平均值
   */
  public avg() {
    let sum = 0;
    this.nums.forEach((num) => sum += num);
    return sum / this.nums.length;
  }

  /**
   * 数组求方差
   * @returns 方差
   */
  public variance() {
    const avg = this.avg();
    let varianceSum = 0;
    this.nums.forEach((num) => varianceSum += Math.pow(num - avg, 2));
    return varianceSum / this.nums.length;
  }

  /**
   * 数组求标准差
   * @returns 标准差
   */
  public standardDeviation() {
    return Math.sqrt(this.variance());
  }

  /**
   * 从头部获取元素列表
   * @param size 元素个数
   * @returns 元素列表
   */
  public head(size: number) {
    return this.slice(size, 0);
  }

  /**
   * 从尾部获取元素列表
   * @param size 元素个数
   * @returns 元素列表
   */
  public tail(size: number) {
    return this.slice(this.nums.length, this.nums.length - size);
  }

  /**
   * 从尾部获取元素列表（倒叙）
   * @param size 元素个数
   * @returns 元素列表
   */
  public tailReverse(size: number) {
    return this.slice(this.nums.length, this.nums.length - size).reverse();
  }

  /**
   * 数组第一个数字
   */
  public get first() {
    return this.nums[0];
  }

  /**
   * 数组最后一个数字
   */
  public get last() {
    return this.nums[this.nums.length - 1];
  }

  /**
   * 数组长度
   */
  public get length() {
    return this.nums.length;
  }

  /**
   * 获取倒序的数组
   * @returns 倒序的数组
   */
  public reverse() {
    return new Nums(this.nums.reverse());
  }

  /**
   * 拼接Nums
   * @param nums 新的Nums
   * @returns 拼接之后的Nums
   */
  public concat(nums: Nums) {
    return new Nums(this.nums.concat(nums.nums));
  }

  /**
   * 推入数字
   * @param num 数字
   */
  public push(...items: number[]) {
    return this.nums.push(...items);
  }

  /**
   * 弹出数字
   * @returns 数字
   */
  public pop() {
    return this.nums.pop();
  }

  /**
   * 在数组范围内随机选取开始结束索引
   * @param size 区间大小
   * @returns 结束索引，开始索引
   */
  public randomRangeEndStart(size: number) {
    let nsize = size < 0 ? 0 : size;
    nsize = nsize > this.length ? this.length : nsize;
    const start = Math.floor(Math.random() * (this.length - nsize + 1));
    const end = start + nsize;
    return [end, start];
  }

  /**
   * 在数组范围内随机选取切片
   * @param size 区间大小
   * @returns 切片
   */
  public randomRange(size: number) {
    return this.slice(...this.randomRangeEndStart(size));
  }

  public MA(size: number) {
    const nsize = this.normalizeSize(size);
    return new Nums(
      this.nums.map((num, index) =>
        this.slice(index + 1, index - nsize + 1).avg()
      )
    );
  }

  public EMA(size: number) {
    const nsize = this.normalizeSize(size);
    const weight = 2 / (nsize + 1);
    const result: number[] = [];
    this.nums.forEach((num, index) => {
      let prevEMA = result[index - 1];
      if (prevEMA == null) {
        prevEMA = num;
      }
      result.push(num * weight + prevEMA * (1 - weight));
    });
    return new Nums(result);
  }

  public MACD_MA(
    fast: number,
    slow: number,
    size: number,
  ) {
    const fastNums = this.MA(fast).nums;
    const slowNums = this.MA(slow).nums;
    const DIFNums = fastNums.map((num, index) => num - slowNums[index]);
    const DEANums = new Nums(DIFNums).MA(size).nums;
    const MACDNums = DIFNums.map((num, index) => num - DEANums[index]);
    return {
      DIF: new Nums(DIFNums),
      DEA: new Nums(DEANums),
      MACD: new Nums(MACDNums),
    };
  }

  public MACD(
    fast: number,
    slow: number,
    size: number,
  ) {
    const fastNums = this.EMA(fast).nums;
    const slowNums = this.EMA(slow).nums;
    const DIFNums = fastNums.map((num, index) => num - slowNums[index]);
    const DEANums = new Nums(DIFNums).EMA(size).nums;
    const MACDNums = DIFNums.map((num, index) => num - DEANums[index]);
    return {
      DIF: new Nums(DIFNums),
      DEA: new Nums(DEANums),
      MACD: new Nums(MACDNums),
    };
  }

  /**
   * 判断数据是否下降
   * @param end 
   * @param start 
   */
  public IsFall(end?: number, start?: number) {
    const sliceNums = this.slice(end, start).nums;
    if (sliceNums.length < 2) {
      return false;
    }
    return sliceNums.every(
      (num, index) => (index === 0 || num < sliceNums[index - 1])
    );
  }

  /**
   * 判断数据是否上升
   * @param end 
   * @param start 
   */
  public IsRise(end?: number, start?: number) {
    const sliceNums = this.slice(end, start).nums;
    if (sliceNums.length < 2) {
      return false;
    }
    return sliceNums.every(
      (num, index) => (index === 0 || num > sliceNums[index - 1])
    );
  }

  /**
   * 是否是V形反转
   * @param index 
   * @param size 
   * @returns 
   */
  public IsVPattern(
    index: number,
    sizeFall: number = 2,
    sizeRise: number = 2,
  ) {
    return this.IsFall(index + 2 - sizeRise, index + 2 - sizeRise - sizeFall) &&
      this.IsRise(index + 1, index + 1 - sizeRise);
  }

  /**
   * 是否是A形反转
   * @param index 
   * @param size 
   * @returns 
   */
  public IsAPattern(
    index: number,
    sizeRise: number = 2,
    sizeFall: number = 2,
  ) {
    return this.IsRise(index + 2 - sizeFall, index + 2 - sizeFall - sizeRise) &&
      this.IsFall(index + 1, index + 1 - sizeFall);
  }
}

/**
 * 便捷访问工厂函数
 * @param nums 数组
 * @returns Nums对象
 */
export
function nums(nums: number[]) {
  return new Nums(nums);
}
