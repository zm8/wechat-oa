type BaseRule<T> = {
  col: number;
  keys?: (keyof T)[];
  getSpan?: (row: T) => [number, number] | void;
  filter?: (row: T) => boolean | void;
};

export type MergedRules<T> = BaseRule<T>[];

type State<T> = Array<
  BaseRule<T> & {
    count: number;
    start: number | null;
    prevRow: T | null;
  }
>;

export default function computeMergedRows<T extends object>(data: T[], rules: MergedRules<T>) {
  const rowSpanObj: Record<number, Record<number, [number, number]>> = {};

  // 初始化每列状态
  const state: State<T> = rules.map((rule) => ({
    ...rule,
    count: 0,
    start: null,
    prevRow: null,
  }));

  // 初始化 rowSpanObj
  rules.forEach((rule) => {
    rowSpanObj[rule.col] = {};
  });

  data.forEach((currRow, i) => {
    state.forEach((s) => {
      const colStore = rowSpanObj[s.col];
      if (!colStore) return; // 防止 ts 报错

      // 检查是否有特殊合并规则 getSpan
      const customSpan = s.getSpan?.(currRow);
      if (customSpan) {
        if (s.count > 0 && s.start !== null) {
          colStore[s.start] = [s.count, 1];
        }

        // 记录当前特殊行的 span
        colStore[i] = customSpan;

        // 重置状态: 特殊行(如标题) 不参与前后行的数值比较
        // 下一行进来时，会视为新的一组开始
        s.count = 0;
        s.start = null;
        s.prevRow = null;
        return;
      }

      // 2. 常规比对逻辑
      // 如果 prevRow 为 null，说明是第一行，或者刚遇到特殊行(Header) 被重置了
      if (!s.prevRow) {
        s.start = i;
        s.count = 1;
      } else {
        // 只有当有 keys 且所有的 key 对应的值都相等时
        const isSame =
          s.keys && s.keys.length > 0
            ? s.keys.every((k) => currRow[k] === (s.prevRow as T)[k])
            : false;
        // 过滤器检查
        const filterPassed = s.filter ? s.filter(currRow) : true;

        if (isSame && filterPassed) {
          colStore[i] = [0, 0];
          s.count++;
        } else {
          // 不同，结算上一组
          if (s.start !== null) {
            colStore[s.start] = [s.count, 1];
          }
          // 开启新的一组
          s.start = i;
          s.count = 1;
        }
      }
      // 更新 preRow 用于下一次比对
      s.prevRow = currRow;
    });
  });

  // 3. 循环结束，计算所有列的最后遗留的一组
  state.forEach((s) => {
    const colStore = rowSpanObj[s.col];
    if (s.count > 0 && colStore && s.start !== null) {
      colStore[s.start] = [s.count, 1];
    }
  });

  return rowSpanObj;
}
