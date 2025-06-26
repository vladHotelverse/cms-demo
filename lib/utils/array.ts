/**
 * Array utility functions
 */

/**
 * Remove duplicates from array based on a key function
 */
export const uniqueBy = <T>(array: T[], keyFn: (item: T) => any): T[] => {
  const seen = new Set()
  return array.filter(item => {
    const key = keyFn(item)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

/**
 * Group array items by a key function
 */
export const groupBy = <T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<K, T[]>)
}

/**
 * Sort array by multiple criteria
 */
export const sortBy = <T>(
  array: T[],
  ...sortFns: Array<(item: T) => any>
): T[] => {
  return [...array].sort((a, b) => {
    for (const sortFn of sortFns) {
      const aVal = sortFn(a)
      const bVal = sortFn(b)
      
      if (aVal < bVal) return -1
      if (aVal > bVal) return 1
    }
    return 0
  })
}

/**
 * Chunk array into smaller arrays of specified size
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  if (size <= 0) return []
  
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Get random item from array
 */
export const randomItem = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Find item in array with optional default value
 */
export const findWithDefault = <T>(
  array: T[],
  predicate: (item: T) => boolean,
  defaultValue: T
): T => {
  return array.find(predicate) ?? defaultValue
}

/**
 * Check if arrays are equal (shallow comparison)
 */
export const arraysEqual = <T>(a: T[], b: T[]): boolean => {
  if (a.length !== b.length) return false
  return a.every((val, index) => val === b[index])
}

/**
 * Get intersection of two arrays
 */
export const intersection = <T>(a: T[], b: T[]): T[] => {
  const setB = new Set(b)
  return a.filter(item => setB.has(item))
}

/**
 * Get difference between two arrays (items in a but not in b)
 */
export const difference = <T>(a: T[], b: T[]): T[] => {
  const setB = new Set(b)
  return a.filter(item => !setB.has(item))
}

/**
 * Move item in array from one index to another
 */
export const moveItem = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  const result = [...array]
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)
  return result
}

/**
 * Create range of numbers
 */
export const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  return result
}

/**
 * Partition array into two arrays based on predicate
 */
export const partition = <T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] => {
  const truthy: T[] = []
  const falsy: T[] = []
  
  array.forEach(item => {
    if (predicate(item)) {
      truthy.push(item)
    } else {
      falsy.push(item)
    }
  })
  
  return [truthy, falsy]
}

