/**
 * A looping timeline for the animated demos of the landing. `step` goes from 0 to
 * `durations.length - 1`, one step after the other (each step waits its duration in ms), then
 * starts again. It plays only while `target` is on screen. With `prefers-reduced-motion`, it
 * stays on the last step. `pause()` stops it for good (for example when the visitor takes over).
 */
export function useDemoTimeline(
  target: Ref<HTMLElement | null | undefined>,
  durations: number[]
) {
  const last = durations.length - 1
  const step = ref(0)
  const stopped = ref(false)
  const motion = usePreferredReducedMotion()
  const visible = useElementVisibility(target, { threshold: 0.3 })
  let timer: ReturnType<typeof setTimeout> | undefined

  function clear() {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  function schedule() {
    clear()
    if (stopped.value || !visible.value || motion.value === 'reduce') {
      return
    }
    timer = setTimeout(() => {
      step.value = step.value >= last ? 0 : step.value + 1
      schedule()
    }, durations[step.value])
  }

  watch(
    [visible, motion],
    () => {
      if (motion.value === 'reduce') {
        step.value = last
      }
      schedule()
    },
    { immediate: true }
  )

  onBeforeUnmount(clear)

  return {
    step,
    reduced: computed(() => motion.value === 'reduce'),
    pause() {
      stopped.value = true
      clear()
    }
  }
}
