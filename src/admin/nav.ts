/** Navigate to a hash route from code (e.g. after a form submit). */
export const go = (to: string) => {
  window.location.hash = `#${to}`
}
