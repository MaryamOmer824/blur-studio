// Add size prop handling
size = 'md' // 'sm', 'md', 'lg'

const sizes = {
  sm: {
    track: 'h-1.5',
    thumb: 'w-4 h-4',
    label: 'text-[10px]',
    value: 'text-[10px] px-2 py-0.5',
  },
  md: {
    track: 'h-2',
    thumb: 'w-5 h-5',
    label: 'text-sm',
    value: 'text-sm px-2.5 py-1',
  },
  lg: {
    track: 'h-2.5',
    thumb: 'w-6 h-6',
    label: 'text-base',
    value: 'text-base px-3 py-1.5',
  },
}