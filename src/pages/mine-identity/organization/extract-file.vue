<template>
  <view class="flex flex-column jc-between wrap">
    <scroll-view scroll-y="true" class="scroll flex-1 u-m-t-20">
    	<view class="action-list u-p-x-32 bg-white u-m-b-20">
        <view class="action-title fs-36 text-color-primary bold u-p-y-48">基本信息</view>
				<view class="required action-item flex ai-center jc-between u-p-y-48 fs-28"  @tap="goCover">
					<view class="action-text flex-1 text-color-primary">LOGO</view>
          <view class="flex-grow-1 flex jc-end u-m-r-30">
							<image src="https://tuapi.eees.cc/api.php?category=dongman&type=302&t=1" class="head-icon"></image>
					</view>
					<image src="../../../assets/mine/arrow.png" class="arrow"></image>
				</view>
        	<view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
					<view class="action-text  text-color-primary">机构名称</view>
					<u-input maxlength="50" class="action-value text-color-third u-p-r-30 fs-28" trim="true" input-align="right" v-model="name" border="false" placeholder="请输入"></u-input>
					<image src="../../../assets/mine/arrow.png" class="arrow"></image>
				</view>
        <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28" >
					<view class="action-text text-color-primary">机构简称</view>
					<u-input maxlength="10" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="name" border="false" placeholder="请输入"></u-input>
					<image src="../../../assets/mine/arrow.png" class="arrow"></image>
				</view>
        <view class="action-item flex ai-center jc-between u-p-y-48 fs-28" >
					<view class="action-text text-color-primary">统一社会信用代码</view>
					<u-input maxlength="18" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="name" border="false" placeholder="请输入"></u-input>
					<image src="../../../assets/mine/arrow.png" class="arrow"></image>
				</view>
         <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28" >
					<view class="action-text  text-color-primary">所属地区</view>
					<view class="action-value text-color-third u-p-r-30 flex jc-end">请选择</view>
					<image src="../../../assets/mine/arrow.png" class="arrow"></image>
				</view>
        <view class="action-item flex ai-center jc-between u-p-y-48 fs-28" >
					<view class="action-text  text-color-primary">所属行业</view>
					<view class="action-value text-color-third u-p-r-30 flex jc-end">请选择</view>
					<image src="../../../assets/mine/arrow.png" class="arrow"></image>
				</view>
			</view>


      	<view class="action-list u-p-x-32 bg-white u-m-b-20">
        <view class="action-title fs-36 text-color-primary bold u-p-y-48">单位联系人</view>
        <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
					<view class="action-text  text-color-primary">姓名</view>
					<u-input maxlength="25" class="action-value text-color-third u-p-r-30 fs-28" trim="true" input-align="right" v-model="name" border="false" placeholder="请输入"></u-input>
					<image src="../../../assets/mine/arrow.png" class="arrow"></image>
				</view>
        <view class="action-item flex ai-center jc-between u-p-y-48 fs-28" >
					<view class="action-text text-color-primary">职务</view>
					<u-input maxlength="20" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="name" border="false" placeholder="请输入"></u-input>
					<image src="../../../assets/mine/arrow.png" class="arrow"></image>
				</view>
        <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28" >
					<view class="action-text text-color-primary">联系电话</view>
					<u-input  class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="name" border="false" placeholder="请输入"></u-input>
					<image src="../../../assets/mine/arrow.png" class="arrow"></image>
				</view>
         <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28" >
					<view class="action-text text-color-primary">通讯地址</view>
					<u-input maxlength="60"  class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="name" border="false" placeholder="请输入"></u-input>
					<image src="../../../assets/mine/arrow.png" class="arrow"></image>
				</view>
         <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28" >
					<view class="action-text text-color-primary">联系邮箱</view>
					<u-input maxlength="50"  class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="name" border="false" placeholder="请输入"></u-input>
					<image src="../../../assets/mine/arrow.png" class="arrow"></image>
				</view>
			</view>

      <view class="action-list u-p-x-32 bg-white u-m-b-20">
        <view class=" action-title fs-36 text-color-primary bold u-p-y-48">单位简介</view>
			  <view class="required-s action-item flex ai-start jc-between u-p-y-48 min-height"  @click="goIntroduce">
            <view class="flex-grow-1">
              <view class="action-text">单位简介</view>
              <view class="text-color-third fs-24 introduce">
                {{summary || '暂无'}}
              </view>
            </view>
            <image src="../../../assets/mine/arrow.png" class="arrow"></image>
         </view>
			</view>

      <view class="action-list u-p-x-32 bg-white u-m-b-20">
        <view class="action-title fs-36 text-color-primary bold u-p-y-48">上传加盖印章的营业执照附件照片（选填）</view>
        <view class="picture flex jc-between u-p-b-24 u-p-t-46">
          <view class="pic" v-for="(item,index) in images" :key="index">
            <image :src="item.url"  @tap="previewImage(item.url)" class="img"></image>
            <view class="fs-24 text-color-third">示例图片</view>
          </view>
          <!-- <view class="pic" v-for="(item,index) in images" :key="index">
            <image :src="item.url"  @tap="previewImage(item.url)" class="img"></image>
            <image class="del-icon" src="../../../assets/certification/del-icon.png" @tap.stop="deleteFile(index)"></image>
          </view> -->
          <view class="pic" @tap="chooseFile" >
            <image src="../../../assets/certification/add.png" class="img"></image>
          </view>
        </view>
     
			</view>

       <view class="action-list u-p-x-32 bg-white obey">
         <view class="action-title fs-36 text-color-primary bold u-p-y-48">自我承诺签名</view>
         <view class="required-s action-item flex ai-start jc-between u-p-y-48 min-height"  @click="goRule">
              <view class="flex-grow-1">
                <view class="action-text">签字承诺</view>
                <view class="text-color-third fs-24 introduce">
                  请阅读乡产投盟公约并承诺签名
                </view>
              </view>
              <image src="../../../assets/mine/arrow.png" class="arrow"></image>
          </view>
			</view>
    </scroll-view>

      <view class="footer-btn-wrap fs-32">
          <view class="footer-inner">
            <view class="next-btn">提交</view>
          </view>
      </view>

  </view>
</template>

<script setup lang="ts">
  import {ref,reactive,computed} from 'vue'
import { onLoad,onShow } from "@dcloudio/uni-app";
import { router, useService, useConfig, useRouter, setToken, setUserInfo } from '@/plugins/app-core'

const name = ref('')
const agreeFlag = ref(false)
const avatar = ref('')
const idCard = ref('371559200212237834')
const summary = ref('')
const images =reactive([
   { url: 'https://cdn.seovx.com/ha/?mom=302&t=1' }
])

const goRule = () => {
    uni.navigateTo({
    url: '/pages/mine/rule'
  })
}
const goIntroduce = () => {
  uni.navigateTo({
    url: '/pages/mine-identity/observer/introduce'
  })
}
const previewImage =  (url:any) => {
  uni.previewImage({
    current: url + '?original=true',
    urls: [url + '?original=true']
  })
}
const	goCover = () => {
    uni.navigateTo({
      url: '/pages/cropper/cropper?destWidth='+320+'&rectWidth='+320
    })
  }
const deleteFile = (index:number) => {
  images.splice(index,1)
}

const chooseFile = () => {
 	uni.chooseImage({
      count: 1,
      success: res => {
       uploadFile(res.tempFilePaths)
      }
  })
}
  const uploadFile = (filePath: Array) => {
    uni.uploadFile({
      filePath:filePath[0],
      name: 'file',
      header: {
        'dreamkey-token': uni.getStorageSync('dreamkey-token')
      },
      url:  '',
      success: res => {
        // if(filePath.length>0) {
        //   let data = JSON.parse(res.data)
        //   this.images.push(FILE_URL + data.data.url)
        //   this.form.images.push(data.data.url)
        //   if (this.images.length<3) {
        //     filePath.shift()
        //     this.uploadFile(filePath)
        //   }
        // }
      }
    })
  }

onLoad(() => {
  uni.$once('uAvatarCropper', path => {
      avatar.value = path;
      // 可以在此上传到服务端
      uni.uploadFile({
        url: '',
        filePath: path,
        name: 'file',
        header: {
          'dreamkey-token': uni.getStorageSync('dreamkey-token')
        },
        complete: (res:any) => {
          const data = JSON.parse(res.data)
          avatar.value= data.data.url
        }
      });
    })
})

</script>

<style lang="scss" scoped>
	.action-list{
	
		.action-text{
			font-size:28rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-grow: 1;
      font-family: PingFangSC-Regular, PingFang SC;
		}
		.action-value{
      max-width: 520rpx;
      min-width: 520rpx;
			word-break: break-all;
      font-family: PingFangSC-Regular, PingFang SC;
		}
    .action-title{
      border-bottom: 1rpx solid #ECE7E3;
      position: relative;
      &:before{
        content: '';
        width: 8rpx;
        height: 36rpx;
        background: $--ym-bg-primary;
        border-radius: 8rpx;
        position: absolute;
        left:-32rpx;
        top:50%;
        transform: translateY(-50%);
      }
    }
		.action-item{
			border-bottom: 1rpx solid #ECE7E3;
			&:last-child{
				border-bottom: 1rpx solid transparent;
			}
		}
	}
  .action-icon{
			max-width:42rpx;
			min-width:42rpx;
			height:42rpx;
	}
  .theme-color{
    color:#12C287;
  }

  .min-height{
			height:unset !important;
			.introduce{
				padding-top:20rpx;
			}
		}
  .obey{
    padding-bottom:80rpx;
  }
  .agree{
    background-color: #FFF2DE;
    color:#FF9F00;
  }
  .default-agree{
    background-color:#dcdcdc;
  }
  .head-icon{
    width:70rpx;
    height:70rpx;
    border-radius: 50%;
    overflow: hidden;
    max-width: 70rpx;
    min-width: 70rpx;
  }

  .picture{
		.pic{
			position: relative;
			margin-right:32rpx;
      text-align: center;
			.img{
				max-width: 162rpx;
				min-width: 162rpx;
				height: 108rpx;
				border-radius: 6rpx;
				overflow: hidden;
			}
			.del-icon{
				width:32rpx;
				height:32rpx;
				position: absolute;
				top:-16rpx;
				right:-16rpx;
				
			}
		}
	}
  .scroll{
    height:calc(100vh - 146rpx)
  }
  .wrap{
    height:100vh;
    width:100%;
    box-sizing:border-box
  }
</style>
