import { ref, reactive, Ref} from 'vue'
import { onLoad, onShow } from "@dcloudio/uni-app";
import { useService, useConfig } from '@/plugins/app-core'
import { operateConfirm, errorCatch, requireCheck } from '@/utils/toast'
interface refType<T> extends Ref<T> {}


export { ref, reactive, refType,  onLoad, onShow, useService, useConfig, operateConfirm, errorCatch, requireCheck }

