
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

  private normalizeSize(
    size: number,
  ) {
    return size < 1 ? 1 : Math.floor(size);
  }

  public slice(end?: number, start?: number) {
    const [iend, istart] = this.normalizeEndStart(end, start);
    return new Nums(this.nums.slice(istart, iend));
  }

  public min(end?: number, start?: number) {
    return Math.min(...this.slice(end, start).nums);
  }

  public max(end?: number, start?: number) {
    return Math.max(...this.slice(end, start).nums);
  }

  public get first() {
    return this.nums[0];
  }

  public get last() {
    return this.nums[this.nums.length - 1];
  }

  public get length() {
    return this.nums.length;
  }

  public reverse() {
    return new Nums(this.nums.reverse());
  }

  public randomRange(size: number) {
    return this.slice(...this.randomRangeEndStart(size));
  }

  public randomRangeEndStart(size: number) {
    let nsize = size < 0 ? 0 : size;
    nsize = nsize > this.length ? this.length : nsize;
    const start = Math.floor(Math.random() * (this.length - nsize + 1));
    const end = start + nsize;
    return [end, start];
  }

  public sum(end?: number, start?: number) {
    const slice = this.slice(end, start).nums;
    let sum = 0;
    slice.forEach((num) => sum += num);
    return sum;
  }

  public avg(end?: number, start?: number) {
    const slice = this.slice(end, start).nums;
    let sum = 0;
    slice.forEach((num) => sum += num);
    return sum / slice.length;
  }

  public variance(end?: number, start?: number) {
    const slice = this.slice(end, start).nums;
    let sum = 0;
    slice.forEach((num) => sum += num);
    const avg = sum / slice.length;
    let varianceSum = 0;
    slice.forEach((num) => varianceSum += Math.pow(num - avg, 2));
    return varianceSum / slice.length;
  }

  public standardDeviation(end?: number, start?: number) {
    return Math.sqrt(this.variance(end, start));
  }

  public concat(nums: Nums) {
    return new Nums(this.nums.concat(nums.nums));
  }

  public push(num: number) {
    this.nums.push(num);
  }

  public MA(size: number) {
    const nsize = this.normalizeSize(size);
    return new Nums(
      this.nums.map((num, index) =>
        this.avg(index + 1, index - nsize + 1)
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
