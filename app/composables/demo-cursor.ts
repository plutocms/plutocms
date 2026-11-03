export type DemoCursorKind = 'pointer' | 'text'

export interface DemoCursorState {
  x: number
  y: number
  visible: boolean
  pressed: boolean
  kind: DemoCursorKind
}

/**
 * A fake mouse pointer for the demos of the landing (PlutoDemoCursor). It moves inside
 * `container` to an element marked `data-demo-target="<name>"`, then presses it. Each move has
 * a delay, so a demo can plan its clicks for a step of its timeline. With `prefers-reduced-motion`
 * the pointer never shows.
 */
export function useDemoCursor(container: Ref<HTMLElement | null | undefined>) {
  const cursor = reactive<DemoCursorState>({
    x: 0,
    y: 0,
    visible: false,
    pressed: false,
    kind: 'pointer'
  })
  const motion = usePreferredReducedMotion()
  let timers: ReturnType<typeof setTimeout>[] = []

  function later(ms: number, task: () => void) {
    timers.push(setTimeout(task, ms))
  }

  /** Forgets the planned moves and hides the pointer. */
  function clear() {
    for (const timer of timers) {
      clearTimeout(timer)
    }
    timers = []
  }

  function locate(target: string, at: 'center' | 'end') {
    const root = container.value
    const element = root?.querySelector<HTMLElement>(
      `[data-demo-target="${target}"]`
    )
    if (!root || !element) {
      return null
    }
    const box = root.getBoundingClientRect()
    const rect = element.getBoundingClientRect()
    return {
      x:
        at === 'end'
          ? rect.right - box.left + 2
          : rect.left - box.left + rect.width / 2,
      y: rect.top - box.top + rect.height / 2
    }
  }

  /**
   * Plans a click: after `delay`, the pointer moves to the target (0.65 s), presses it, and
   * `onPress` runs. A hidden pointer first appears a little away from the target, so it travels.
   */
  function click(
    target: string,
    options: {
      delay?: number
      kind?: DemoCursorKind
      at?: 'center' | 'end'
      onPress?: () => void
    } = {}
  ) {
    if (motion.value === 'reduce') {
      later(options.delay ?? 0, () => options.onPress?.())
      return
    }
    later(options.delay ?? 0, () => {
      const point = locate(target, options.at ?? 'center')
      if (!point) {
        options.onPress?.()
        return
      }
      cursor.kind = options.kind ?? 'pointer'
      if (!cursor.visible) {
        cursor.x = point.x + 90
        cursor.y = point.y + 60
        cursor.visible = true
      }
      requestAnimationFrame(() => {
        cursor.x = point.x
        cursor.y = point.y
      })
      later(700, () => {
        cursor.pressed = true
        options.onPress?.()
        later(180, () => {
          cursor.pressed = false
        })
      })
    })
  }

  function hide(delay = 0) {
    later(delay, () => {
      cursor.visible = false
    })
  }

  onBeforeUnmount(clear)

  return { cursor, click, hide, clear }
}
