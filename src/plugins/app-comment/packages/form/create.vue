<template>
  <div class="ac-write">
    <div class="ac-write-card">
      <!-- 评分 -->
      <ac-score 
        v-for="(item, index) in option"
        :key="index"
        :scale="item.levelSysDictItem"
        :orderIndex="index"
        :name="item.name"
        :value="item.defaultValue"
        @change="setAscore">
      </ac-score>
      <!-- 分割线 -->
      <div class="ac-write__cutting-line"></div>
      <div class="ac-write-textarea">
        <textarea 
         v-model="form.content"
          class="ac-write-textarea__inner"
          :maxlength="-1"
          placeholder-class="ac-write-textarea__placeholder"
          placeholder="请输入您对项目的看法，包括市场需求、技术/产品、团队/资源情况如何。"
          />
        <view class="ac-write-textarea__maxlength" >
          {{maxLength}}/<span class="ac-write-textarea__maxlength-max">2000</span>
        </view>
      </div>
      <!-- 上传图片 -->
      <view class="ac-write-upload">
        <view class="ac-write-upload__pic" v-for="item,index in form.pictures" :key="index" >
          <image class="ac-write-upload__delete" src="../../src/assets/img/close.png" @click="deleteImg(index)"></image>
          <image :src="assets(item)" class="ac-write-upload__img" mode="aspectFit"></image>
        </view>
        <view class="ac-write-upload__pic" @tap="chooseFile" v-if="form.pictures.length<6">
          <image src="../../src/assets/img/add.png" class="ac-write-upload__icon"></image>
          <view class="ac-write-upload__icon-text">评价贴图</view>
        </view>
      </view>
    </div>
    
    
    
    <div class="ac-write__info"><image src="../../src/assets/img/warnning.png" class="ac-write__info-icon"></image>您的评论将存证于投盟链，并公开显示</div>
    <div class="ac-write__footer">
      <button class="ac-write__submit" @click="submit()">发布</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, Ref, computed } from 'vue'
import { acUseService, useRouter } from '../../src/lib/app-core'
import { onLoad } from '@dcloudio/uni-app'
import assets from '../../src/lib/assets'
const acService = acUseService()
const router = useRouter()

let totalScore: Ref<number> = ref(0)
const option = reactive([])
// let option = reactive([
//   {
//     name:'总体',
//     levelSysDictItem:[
//         {itemName:'暂无评分',itemValue: 0},
//         {itemName:'一般',itemValue: 1},
//         {itemName:'一般',itemValue: 2},
//         {itemName:'良好',itemValue: 3},
//         {itemName:'良好',itemValue: 4},
//         {itemName:'优秀',itemValue: 5}
//     ],
//     defaultValue:0,
//     id:'465465'
//   },
//   {
//     name:'市场',
//     levelSysDictItem:[
//         {itemName:'暂无评分',itemValue: 0},
//         {itemName:'一般',itemValue: 1},
//         {itemName:'一般',itemValue: 2},
//         {itemName:'良好',itemValue: 3},
//         {itemName:'良好',itemValue: 4},
//         {itemName:'优秀',itemValue: 5}
//     ],
//     defaultValue:0,
//     id:'465465'
//   },
//   {
//     name:'技术',
//     levelSysDictItem:[
//         {itemName:'暂无评分',itemValue: 0},
//         {itemName:'一般',itemValue: 1},
//         {itemName:'一般',itemValue: 2},
//         {itemName:'良好',itemValue: 3},
//         {itemName:'良好',itemValue: 4},
//         {itemName:'优秀',itemValue: 5}
//     ],
//     defaultValue:0,
//     id:'465465'
//   },
//   {
//     name:'团队',
//     levelSysDictItem:[
//         {itemName:'暂无评分',itemValue: 0},
//         {itemName:'一般',itemValue: 1},
//         {itemName:'一般',itemValue: 2},
//         {itemName:'良好',itemValue: 3},
//         {itemName:'良好',itemValue: 4},
//         {itemName:'优秀',itemValue: 5}
//     ],
//     defaultValue:0,
//     id:'465465'
//   }
// ]) 
const form:any = reactive({commentScoringList:[], content:'', pictures:[], bindId:'', bindType:'0'})
const maxLength = computed(() =>  form.content ? form.content.length : 0)
const getValue = (e) => {
  console.log('e.detail'+e.detail)
  form.content = e.detail.value
}
const bindId = ref('') // 绑定ID:评论对象的id,此处是项目id
const bindType = ref('0') // 绑定类型 0项目
onLoad(async (options: any)=>{
  form.bindId= options.bindId || '1570652375220621314'
  form.bindType= options.bindType || '0'
  let res = await acService.createComment.getScoreItem()
  Object.assign(option, res)
})

function setAscore(index:number, orderIndex:number) {
  option[orderIndex].defaultValue = index
}


// 选择图片上传

// 选择图片
const chooseFile = () => {
  uni.chooseImage({
    count: 6 - form.pictures.length,
    success: res => {
      if(Array.isArray(res.tempFilePaths)){
        res.tempFilePaths.forEach(function(ele){
          uploadFile(ele)
        })
      }
    }
  })
}

// 上传图片
const uploadFile = async (filePath: any) => {
  const result = await acService.upload.uploadFile({
    filePath: filePath
  })
  const file = JSON.parse(result.data)
  form.pictures.push(file.data.url)
}

// 删除图片
const deleteImg = (index: string|number) => {
  form.pictures.splice(index,1)
}

const submitting = ref(false)
// 提交评论
const submit = async ()=> {
  if(submitting.value) { return }
  submitting.value = true
  if(!form.content){
    uni.showToast({
      icon: 'none',
      title: '请输入评论',
      duration: 1000
    })
    submitting.value = false
    return
  }
  if(form.content.length>2000){
    uni.showToast({
      icon: 'none',
      title: '字数限制为2000字，格式为多行文本。',
      duration: 1000
    })
    submitting.value = false
    return
  }
  let params = {...form}
  params.commentScoringList = option.map(item=>{
    return { commentScoringItemId: item.id, score: item.defaultValue }
  })

  try{
    await acService.createComment.addComment(params)
    uni.showToast({
      icon: 'none',
      title: '点评发布成功',
      duration: 1000
    })
    uni.$emit('updateCommentList',{})

    submitting.value = false
    setTimeout(()=>{
      router.back()
    }, 1000)
    } catch(e){
      submitting.value = false
    }
}

</script>
<style lang="scss">
.ac-write{
  margin-bottom: 166rpx;
}
.ac-write-card {
  margin: 24rpx;
  padding: 32rpx 24rpx;
  background: #FFFFFF;
  border-radius: 12rpx;
}
.ac-write{
  &__cutting-line{
    margin: 32rpx 24rpx 24rpx;
    height: 2px;
    background: #F2F2F2;
  }
  &__info{
    height: 87rpx;
    line-height: 87rpx;
    padding: 0 24rpx;
    margin: 0 24rpx 170rpx;
    color: $--ac-color-yellow;
    background: #FFF2DE;
    border-radius: 12rpx;
  }
  &__info-icon{
    width: 26rpx;
    height: 26rpx;
    margin-right: 9rpx;
  }
  &__footer{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    height: 146rpx;
    padding: 30rpx 100rpx;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 0 30rpx #999999;
  }
  &__submit{
    width: 100%;
    color: #fff;
    height: 82rpx;
    line-height: 82rpx;
    background: $--ac-bg-primary;
    border-radius: 50rpx;
  }
}

.ac-write-textarea{
  &__inner{
    width: 100%;
    box-sizing: border-box;
    min-height: 220rpx;
    padding: 0;
    font-size: 26rpx;
    border: none;
  }
  &__placeholder{
    font-weight: 400;
    color: #C8C8C8;
  }
  &__maxlength{
    margin-top: 10rpx;
    width: 100%;
    text-align: right;
    font-size: 24rpx;
    color:#C8C8C8;
  }
  &__maxlength-max{
    color:#333;
  }
}

 .ac-write-upload{
    display: flex;
    width: calc(100% + 20rpx);
    margin: 16rpx 0 16rpx -10rpx;
    flex-wrap: wrap;
    justify-content: flex-start;

    &__pic{
      position: relative;
      margin-bottom: 32rpx;
      background: #F7F7F7;
      border: 1px dotted #999;
      border-radius: 8rpx;
      width: 200rpx;
      height: 200rpx;
      margin: 10rpx;
      position: relative;
    }

    &__delete{
      position: absolute;
      right: 12rpx;
      top: 12rpx;
      width: 32rpx;
      height: 32rpx;
      background: #B8B8B8;
      border-radius: 32rpx;
    }

    &__img{
      width: 100%;
      height: 100%;
    }
    &__icon{
      margin-top: 52rpx;
      margin-left: 72rpx;
      width: 61rpx;    
      height: 58rpx;
    }
    &__icon-text{
      margin-top: 16rpx;
      margin-left: 50rpx;
      font-size: 26rpx;
      font-weight: 400;
      color: #666666;
      line-height: 1;
    }
  }


</style>