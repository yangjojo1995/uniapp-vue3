<template>
	<view class="container">
		<view class="cropper-wrap">
		  <ym-nice-cropper
			id="image-cropper"
			:zoom="1"
			:angle="0"
			:minZoom="0.2"
			:src="src"
			:cutWidth="'80%'"
			canvasBackground="#fff"
			:disableRotate="true"
			:boundDetect="false"
			@cropped="cropped"
			@afterDraw="afterDraw"
			@beforeDraw="beforeDraw"
			@load="loading"
		  />
      <canvas   :style="{ width: '320px', height: '320px', opacity:0 }"
            canvas-id="c"></canvas>
		 <image :src="cutUrl"  class="preview" v-if="show" @click="previewImg"></image>
		<view class="bottom">
			<view v-if="!src">
				<button  @tap="chooseImage" type="primary" class="primary">打开图片</button>
				<button @tap="back" type="default" class="default">返回</button>
			</view>
			  <view v-else>
				<button @tap="crop" type="primary" class="primary" :disabled="disable">确认</button>
				<button @tap="clear" type="default" class="default">取消</button>
			  </view>
		</view>
	</view>
  </view>
</template>

<script lang="ts" > 
import {defineComponent} from 'vue'
	export default defineComponent ({
		data() {
			return {
				src: '',
				url: '',
        cutUrl: '',
				width: 0,
				show: true,
				disable: false,
        timer: null,
        timerCanvas:null,
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: res => {
					this.width = res.windowWidth
				}
			})
		},
		 methods: {
        beforeDraw(context, transform) {
    
      },
			loading (img) {
				
			},
      back(){
        uni.navigateBack({})
      },
			chooseImage () {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success:res => {
						if (res.tempFiles[0].size / 1024 / 1024 > 6) {
							uni.showToast({
								title: '上传的图片不能超过6M',
								icon: 'none',
								duration: 2000
							})
							return false
						}
						this.src = res.tempFilePaths.shift()
					}
				})
			},
      afterDraw(ctx, info) {
      },
		  async cropped(imagePath, imageInfo) {
        this.url =imagePath
        const ctx = uni.createCanvasContext('c')
        let url =  imagePath
        ctx.arc(160, 160, 160, 0, Math.PI * 2, false); // 画出圆
        // ctx.arc(this.destWidth/2, this.destHeight/2, this.destWidth/2, 0, Math.PI * 2, false); // 画出圆
        ctx.fill() // 先设置颜色填充
        ctx.clip() // 裁剪上面的圆形
        ctx.save()
        ctx.drawImage(url, 0, 0, 320, 320);
        ctx.setFillStyle('transparent') // 设置颜色
        // ctx.drawImage(url, 0, 0, this.destWidth, this.destHeight);
        ctx.save(); // 保存当前ctx的状态
        await ctx.draw()
        clearTimeout(this.timerCanvas)
        this.timerCanvas = setTimeout(() => {
          uni.canvasToTempFilePath({
            canvasId: 'c',
            success:  (res)=>{
              this.cutUrl = res.tempFilePath
               clearTimeout(this.timerCanvas)
            },
            fail: ()=>{},
            complete: ()=>{}
          })
        }, 100)
      
      }, 
			previewImg () {
				if (this.url) {
					uni.previewImage({
						urls:[this.url]
					})
				}
			},
			crop () {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          if (this.cutUrl) {
          uni.$emit('uAvatarCropper',this.cutUrl)
           clearTimeout(this.timer)
            this.$u.route({
              type: 'back'
            })
          }
        }, 200)
			},
			clear () {
				this.url = ''
				this.src = ''
        this.cutUrl = ''
			}
		  }
	})
</script>
<style>
	.preview{
		width:200rpx;
		height:200rpx;
		border-radius: 50%;
		overflow: hidden;
		position: fixed;
		left:50%;
		margin-left:-100rpx;
		top:8%;
		box-shadow: 0 0 10px 1px #fff;
		background-color: transparent;
	}
	.container{
		width:100%;
    height:100vh;
	}
	.cropper-wrap{
		width:100%;
		height:100%;
	}

	.bottom {
	  position: fixed;
	  left: 50%;
	  bottom: 20rpx;
	  width: 80%;
	  transform: translateX(-50%);
	}
	button {
	  margin-top: 20rpx;
	}
</style>
