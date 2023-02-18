const files = import.meta.globEager('./*.ts')
const modules: Record<string, any> = {}
for (const key of Object.keys(files)) {
  if (key === './index.ts') continue
  modules[key.replace(/(\.\/|\.ts)/g, '')] = files[key].default || files[key]
}
export default <{
  app: typeof import('./app')
  mine: typeof import('./mine')
  identity: typeof import('./identity'),
  user: typeof import('./user'),
  certification: typeof import('./certification'),
  history: typeof import('./history'),
  organization: typeof import('./organization'),
  manager: typeof import('./manager'),
  observer: typeof import('./observer'),
  home: typeof import('./home'),
  project: typeof import('./project'),
  company: typeof import('./company'),
  commitment: typeof import('./commitment'),
  notify: typeof import('./notify'),
  active: typeof import('./active'),
  activity: typeof import('./activity'),
  subaccount: typeof import('./subaccount'),
  review: typeof import('./review'),
  message: typeof import('./message'),
  notice: typeof import('./notice'),
  collectBp: typeof import('./collectBp')

}>modules

