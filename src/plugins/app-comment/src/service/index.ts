const files = import.meta.globEager('./*.ts')
const modules: Record<string, any> = {}
for (const key of Object.keys(files)) {
  if (key === './index.ts') continue
  modules[key.replace(/(\.\/|\.ts)/g, '')] = files[key].default || files[key]
}
export default <{
  createComment: typeof import('./createComment'),
  upload: typeof import('./upload'),
  history: typeof import('./history'),
  comment: typeof import('./comment'),
}>modules

