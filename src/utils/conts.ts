export const WIN_PATTERN: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export const INIT_BOARD: string[] = Array(9).fill('')

export const getBorderStyle = (i: number) => {
  if (i === 0) return { borderTop: 'none', borderLeft: 'none' }
  if (i === 1) return { borderTop: 'none' }
  if (i === 2) return { borderTop: 'none', borderRight: 'none' }
  if (i === 3) return { borderLeft: 'none' }
  if (i === 5) return { borderRight: 'none' }
  if (i === 6) return { borderLeft: 'none', borderBottom: 'none' }
  if (i === 7) return { borderBottom: 'none' }
  if (i === 8) return { borderRight: 'none', borderBottom: 'none' }
}
