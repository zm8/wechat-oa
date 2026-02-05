type ListItem<T = object> = T & { id: string | number }

export type Props<T> = {
  listData: ListItem<T>[]
  estimatedItemSize: number
  bufferCount: number
  height: number
}

export type Positions = { id: string | number; height: number; top: number }[]
