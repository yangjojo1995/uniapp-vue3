<template>
  <view  class="content" style="background: url(http://192.168.0.130:8088/business/static/file/蒙版_06239ca5245a4cf9840190d08ae6c094.png?v=123) no-repeat; background-size:100% 100%">
			<!-- <image :src="''" class="bg"></image> -->
			<cover-view class="voucher bg-white fs-24 u-p-b-40">
          <cover-view class="fs-34 bold u-p-y-42 flex ai-center jc-center block-name">壹启投盟区块链凭证</cover-view>
          <cover-view class="text-color-third u-m-b-24 flex ai-center u-p-l-64">存证编号 <cover-view class="text-color-secondary u-m-l-24">23DJ78L</cover-view></cover-view>
          <cover-view class="text-color-third u-m-b-24  flex ai-center u-p-l-64">存证哈希 <cover-view class="text-color-secondary  u-m-l-24">d6a30851fcsd2342342342352903</cover-view></cover-view>
          <cover-view class="text-color-third  flex ai-center u-p-l-64">存证时间 <cover-view class="text-color-secondary  u-m-l-24">2022.03.14 12:00:00</cover-view></cover-view>
          <cover-image src="../../assets/relation/chain.png" class="chain-img"></cover-image>
      </cover-view>
      <movable-area class="move-area"  :scale-area="true">
			  <movable-view
			    class="move-view"
			    :x="x"
			    :y="y"
			    direction="all"
			    scale="true"
			    out-of-bounds="true"
			    animation="true"
			    scale-max="1.3"
			  >
			    <view class="move-item">
			      <view v-for="(item, index) in dataArr" :key="index" class="tab" :style="{'transform': 'rotate(' + item.deg +'deg)'}">
			       <view v-if="item.point == false" class="arrow1" :class="[item.point===false?'ask':'', index % 2 ? 'color-blue':'']" />
			        <view class="line" :style="{'width': item.lineW + 'rpx'}">
			          {{ item.typeName  }}
			        </view>
			        <view v-if="item.point == true" class="arrow1" :class="[item.point===true?'assist':'', index % 2 ? 'color-blue':'']" />
			        <view class="top-btn" :style="{'transform': 'rotate(-' + item.deg +'deg)'}" @click="tabTo(item)">
			          <image :src="item.avatar" :style="{width: item.wh + 'rpx', height: item.wh + 'rpx'}" />
			          <view class="user-name" :style="{fontSize: item.fontSize + 'rpx'}">
			            {{ item.realName }}
			          </view>
			        </view>
			      </view>
			      <view class="icon-cell">
							<view class="border">
								<image class="icon" :src="avatar" />
							</view>
			      </view>
			    </view>
			  </movable-view>
			</movable-area>
				
    </view>
</template>

<script>
export default {
  onLoad(params) {
    this.typeName = params.typeName
    this.initChart()
    // this.accountType = Number(params.accountType)
    // this.getData()
    // this.getUserInfo()

  },
  onReady() {
    // 创建节点选择器
  },
  data () {
    return {
      nav: {
        navTitle: '关系图谱',
        isdisPlayNavTitle: true
      },
      titleBarHeight: 44,
      statusBarHeight: 0,
      moveAreaHeight: 0,
      voucherHeight: 100,
      x: -240,
      y: -340,
	    show: false,
      accountId: '',
      accountType: 0,
      avatar: 'https://gdxctm.cn/business/static/file/微信图片_20220429181948_b7931adc4d3e45069f2ce60b96e29c9a.png',
      dataArr: [
        { realName: '张三1',avatar: 'https://gdxctm.cn/business/static/file/微信图片_20220429181948_b7931adc4d3e45069f2ce60b96e29c9a.png',typeName: '活动', point: true },
        { realName: '张三2',avatar: 'https://gdxctm.cn/business/static/file/微信图片_20220429181948_b7931adc4d3e45069f2ce60b96e29c9a.png',typeName: '活动' },
        { realName: '张三3',avatar: 'https://gdxctm.cn/business/static/file/微信图片_20220429181948_b7931adc4d3e45069f2ce60b96e29c9a.png',typeName: '活动' },
        { realName: '张三4',avatar: 'https://gdxctm.cn/business/static/file/微信图片_20220429181948_b7931adc4d3e45069f2ce60b96e29c9a.png' ,typeName: '活动' },
        { realName: '王五5',avatar: 'https://gdxctm.cn/business/static/file/微信图片_20220429181948_b7931adc4d3e45069f2ce60b96e29c9a.png' ,typeName: '活动'},
        { realName: '张三6',avatar: 'https://gdxctm.cn/business/static/file/微信图片_20220429181948_b7931adc4d3e45069f2ce60b96e29c9a.png',typeName: '活动' },
        { realName: '张三7',avatar: 'https://gdxctm.cn/business/static/file/微信图片_20220429181948_b7931adc4d3e45069f2ce60b96e29c9a.png',typeName: '活动' },
        { realName: '李四8',avatar: 'https://gdxctm.cn/business/static/file/微信图片_20220429181948_b7931adc4d3e45069f2ce60b96e29c9a.png' ,typeName: '活动'},
        { realName: '张三',avatar: 'https://gdxctm.cn/business/static/file/微信图片_20220429181948_b7931adc4d3e45069f2ce60b96e29c9a.png',typeName: '活动' ,point: true}
      ],
	  clickItem: {}
    }
  },
  methods: {
   
    // 关系图谱
    initChart () {
      if (!this.dataArr) {
        return false
      }
      const arr = []
      const deg = 360 / this.dataArr.length
      const d= Math.ceil(this.dataArr.length/5)*100
      for (let i = 0; i < this.dataArr.length;) {
        const lineW = parseInt(Math.random() * d + 140)
        let fontSize = 22
        if (!arr.includes(lineW)) {
          const wh = parseInt(Math.random() * 80 + 68)
          if (wh <= 68) {
            fontSize = 22
          } else if (wh <= 88) {
            fontSize = 26
          } else {
            fontSize = 30
          }
          this.dataArr[i] = Object.assign(this.dataArr[i], { wh: wh, fontSize: fontSize, deg: deg * i - 20, lineW: lineW })
          i++
        }
      }
      this.$forceUpdate()
    },
  }
}
</script>

<style lang="scss" scoped>

    .voucher {
      position:absolute;
      left:0; 
      top:20rpx;
      z-index:10;
      width:100%;
      overflow:hidden;
      .block-name{
        width:100%;
	    text-align: center;
      }
			.item {
				color: rgba(255, 255, 255, 0.8);
				line-height: 40rpx;
				word-break: break-all;
				.code {
					display: inline-block;
					width: 470rpx;
					vertical-align: top;
				}
			}
			.bgImg {
				position: absolute;
				top: 0;
				right: 0;
				width: 159rpx;
				height: 125rpx;
			}
		}
.content{
  height:100vh;
  width:100%;
}
	.move-area {
			position: absolute;
			top:0;
			left:0;
			width: 100%;
			height: 100%;
			overflow: hidden;
		}
		.icon-cell {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateX(-50%);
			box-shadow:0px 0px 0px 20px rgba(0, 198, 130, 0.08);
      
			border-radius: 50%;
			.border{
				background-color:#fff;
				padding:10rpx;
				border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
				box-shadow:0px 0px 0px 10px rgba(18, 194, 135, 0.12);
			}
			.icon {
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				position: relative;
				border: 4rpx solid rgba(0, 198, 130, 1);
			}
		}
		.top-btn {
			position: relative;
			text-align: center;
			font-weight: bold;
			image {
				border-radius: 50%;
				border: 2rpx solid #66EAFF;
			}
			.user-name {
				position: absolute;
				left: 50%;
				bottom: -30rpx;
				transform: translateX(-50%);
				min-width: 120rpx;
				font-size:24rpx;
				color:#333;
			}
		}
	
		.move-view {
			width: 200%;
			height: 200%;
			box-sizing: border-box;
			.move-item {
				position: relative;
				width: 1700rpx;
				height: 100%;
				.tab {
					position: absolute;
					top: 50%;
					left: 50%;
					display: flex;
					align-items:  center;
					transform-origin: left center;
					image{
            box-shadow: 0px 5rpx 6rpx 0px rgba(18, 194, 135, 0.35);
            border: 4rpx solid #00C682
					}
					.line {
						position: relative;
						height: 2rpx;
						text-align: right;
             padding-right:46rpx;
             padding-left:46rpx;
					}
					.arrow1 {
						width: 0rpx;
						height: 0rpx;
						border-radius: 4rpx;
						&.ask {
							margin-left: 100rpx;
							border-top: 12rpx solid transparent;
							border-right: 16rpx solid rgba(0, 198, 130, 1);
							border-bottom: 12rpx solid transparent;
							&.color-blue {
								border-right: 16rpx solid rgba(0, 198, 130, 1);
							}
						}
						&.assist {
							border-top: 12rpx solid transparent;
							border-left: 16rpx solid rgba(0, 198, 130, 1);
							border-bottom: 12rpx solid transparent;
							&.color-blue {
								border-left: 16rpx solid rgba(0, 198, 130, 1);
							}
						}
					}
					
				}
			}
		}
		.bg{
			height:100%;
			width:100%;
		}
		.line{
			color:#333;
			font-size:22rpx;
			border-bottom:4rpx solid rgba(0, 198, 130, 1);
     
		}
    .chain-img{
      width:180rpx;
      height:146rpx;
      position:absolute;
      right:0;
      top:-10rpx;
    }

</style>
