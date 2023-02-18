import type { App } from '@vue/runtime-core'
import type Request from './libs/luch-request'

interface $u {
  route: (options?: string | Record<string, any>, params?: Record<string, any>) => void
  date: (dateTime: string | number | Date, formatStr?: string) => string
  colorGradient: (startColor?: string, endColor?:  string, step?: number) => string[]
  hexToRgb: (sColor: string | number, str: boolean) => string
  rgbToHex: (rgb: string) => string
  colorToRgba: (color: string, alpha: number) => string
  test: {
    email: (value: any) => boolean
    mobile: (value: any) => boolean
    url: (value: any) => boolean
    date: (value: any) => boolean
    dateISO: (value: any) => boolean
    number: (value: any) => boolean
    digits: (value: any) => boolean
    idCard: (value: any) => boolean
    carNo: (value: any) => boolean
    amount: (value: any) => boolean
    chinese: (value: any) => boolean
    letter: (value: any) => boolean
    enOrNum: (value: any) => boolean
    contains: (value: any, param: any) => boolean
    range: (value: any, param: any[]) => boolean
    rangeLength: (value: any, param: any[]) => boolean
    empty: (value: any) => boolean
    isEmpty: (value: any) => boolean
    jsonString: (value: any) => boolean
    landline: (value: any) => boolean
    object: (value: any) => boolean
    array: (value: any) => boolean
    code: (value: any, len: number) => boolean
    func: (value: any) => boolean
    promise: (value: any) => boolean
    video: (value: any) => boolean
    image: (value: any) => boolean
    regExp: (value: any) => boolean
    string: (value: any) => boolean
  }
  type: 'primary' | 'success' | 'error' | 'warning' | 'info'
  http: Request
  config: {
    v: string
    version: string
    type: string[],
    color: Record<string, string>
    unit: string
  },
  zIndex: {
    toast: number
    noNetwork: number
    popup: number
    mask: number
    navbar: number
    topTips: number
    sticky: number
    indexListSticky: number
  }
  debounce: (func: Function, wait: number, immediate: boolean) => Function
  throttle: (func: Function, wait: number, immediate: boolean) => Function
  mixin: Record<string, string>
  mpMixin: Record<string, string>
  props: Record<string, string>
  
	range: Function
	getPx: Function
	sleep: Function
	os: Function
	sys: Function
	random: Function
	guid: Function
	$parent: Function
	addStyle: Function
	addUnit: Function
	deepClone: Function
	deepMerge: Function
	error: Function
	randomArray: Function
	timeFormat: Function
	timeFrom: Function
	trim: Function
	queryParams: Function
	toast: Function
	type2icon: Function
	priceFormat: Function
	getDuration: Function
	padZero: Function
	formValidate: Function
	getProperty: Function
	setProperty: Function
	page: Function
	pages: Function
	setConfig: Function

  color: {
    primary: string
    info: string
    default: string
    warning: string
    error: string
    success: string
    mainColor: string
    contentColor: string
    tipsColor: string
    lightColor: string
    borderColor: string
  }
  platform: string
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    readonly $u: $u
  }
}

export default function (app: App): any
