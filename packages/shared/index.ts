export const isArray = Array.isArray
export const isObject = (val: any) => {
  return val !== null && typeof val === 'object'
}
