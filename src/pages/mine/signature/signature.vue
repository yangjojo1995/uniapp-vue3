<template>
	<view class="content">
		<view class="flex ai-center">
      <view class="btn-row flex ai-center border h-100 w-156 min-w-156 max-w-156 bg-white fs-32 text-color-primary ">
        <view class="flex h-100 flex-column jc-between">
					<text class="tips fs-32">在上方空白处写您的签名，身份通过后签名将会向平台内同身份用户展示。</text>
					<view>
						<view class="btn rounded-100 bg-grey " @tap="retDraw">
							<text>清除重写</text>
						</view>
						<view class="btn rounded-100 bg-grey" @tap="uploadCanvasImg">
							<text>提交签名</text>
						</view>
					</view>
        </view>
      </view>
      <view class="hand-center flex-1">
        <canvas
          class="hand-writing"
          disable-scroll="true"
          canvas-id="handWriting"
          @touchstart="uploadScaleStart"
          @touchmove="uploadScaleMove"
          @touchend="uploadScaleEnd"
        />
        <canvas canvas-id="trans" class="trans" />
      </view>
    </view>
	</view>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import config from '@/config/index'

export default defineComponent({
	data() {
		return {
			canvasName: 'handWriting',
			hasDraw: false, //默认没有画
			ctx:'',
			canvasWidth: 0,
			canvasHeight: 0,
			transparent: 1, // 透明度
			selectColor: 'black',
			lineColor: '#1A1A1A', // 颜色
			lineSize: 1.5,  // 笔记倍数
			lineMin: 0.5,   // 最小笔画半径
			lineMax: 4,     // 最大笔画半径
			pressure: 1,     // 默认压力
			smoothness: 60,  //顺滑度，用60的距离来计算速度
			currentPoint: {},
			currentLine: [],  // 当前线条
			firstTouch: true, // 第一次触发
			radius: 1, //画圆的半径
			cutArea: { top: 0, right: 0, bottom: 0, left: 0 }, //裁剪区域
			bethelPoint: [],  //保存所有线条 生成的贝塞尔点；
			lastPoint: {},
			chirography: [], //笔迹
			currentChirography: {}, //当前笔迹
			linePrack: [], //划线轨迹 , 生成线条的实际点
			signatureUrl: '', // 存放上传后返回的签名url
			type: '', // 类型： update 更新
			id: '', // 用户id
			from: '', //来自于哪里
			canvasTransWidth: 0,
      canvasTransHeight: 0,
			canvasTransName: 'trans',
			loading: false
		}
	},
	onLoad(options:any) {
		this.id = options.unionId
		this.type = options.type
		this.from = options.from
	},
	onReady () {
		let canvasName = this.canvasName
		let ctx = uni.createCanvasContext(canvasName) as any
		this.ctx = ctx
		var query = uni.createSelectorQuery();
		query.select('.hand-center').boundingClientRect( rect => {
		this.canvasWidth = rect.width
		this.canvasHeight = rect.height
		this.setCanvasBg('rgba(255, 255, 255,0)');
		}).exec();

		const canvasTransName = this.canvasTransName
    const ctxTrans = uni.createCanvasContext(canvasTransName) as any
    this.ctxTrans = ctxTrans
    const queryTrans = uni.createSelectorQuery()
    queryTrans.select('.trans').boundingClientRect(rect => {
      this.canvasTransWidth = rect.width || 0
      this.canvasTransHeight = rect.height || 0
      // this.setCanvasBg('rgba(255, 255, 255,0)')
    }).exec()
	},
	methods: {
		// 返回上级
		navigateBack () {
			uni.navigateBack()
		},
		//设置canvas背景色  不设置  导出的canvas的背景为透明 
		//@params：字符串  color
		setCanvasBg(color:any){
			/* 将canvas背景设置为 白底，不设置  导出的canvas的背景为透明 */
			//rect() 参数说明  矩形路径左上角的横坐标，左上角的纵坐标, 矩形路径的宽度, 矩形路径的高度
			//这里是 canvasHeight - 4 是因为下边盖住边框了，所以手动减了写
			this.ctx.rect(0, 0, this.canvasWidth, this.canvasHeight - 4);  
			// this.ctx.setFillStyle('red')
			this.ctx.setFillStyle( color )
			this.ctx.fill()  //设置填充
			this.ctx.draw()    //开画
		},
		// 笔迹开始
		uploadScaleStart (e:any) {
			if (e.type != 'touchstart') return false;
			let ctx = this.ctx;
			ctx.setFillStyle(this.lineColor);  // 初始线条设置颜色
			ctx.setGlobalAlpha(this.transparent);  // 设置半透明
			let currentPoint = {
			  x: e.touches[0].x,
			  y: e.touches[0].y
			}
			let currentLine = this.currentLine;
			currentLine.unshift({
			  time: new Date().getTime(),
			  dis: 0,
			  x: currentPoint.x,
			  y: currentPoint.y
			})
			this.currentPoint = currentPoint
			// this.currentLine = currentLine
			if (this.firstTouch) {
				this.cutArea = { top: currentPoint.y, right: currentPoint.x, bottom: currentPoint.y, left: currentPoint.x }
				this.firstTouch = false
			}
			this.pointToLine(currentLine);
		},
		// 笔迹移动
		uploadScaleMove (e:any) {
			if (e.type != 'touchmove') return false;
			this.hasDraw = true // 开始画了
			if (e.cancelable) {
				// 判断默认行为是否已经被禁用
				if (!e.defaultPrevented) {
				  e.preventDefault();
				}
			}
			let point = {
				x: e.touches[0].x,
				y: e.touches[0].y
			}
		  
			//测试裁剪
			if (point.y < this.cutArea.top) {
				this.cutArea.top = point.y;
			}
			if (point.y < 0) this.cutArea.top = 0;
		  
			if (point.x > this.cutArea.right) {
				this.cutArea.right = point.x;
			}
			if (this.canvasWidth - point.x <= 0) {
				this.cutArea.right = this.canvasWidth;
			}
			if (point.y > this.cutArea.bottom) {
				this.cutArea.bottom = point.y;
			}
			if (this.canvasHeight - point.y <= 0) {
				this.cutArea.bottom = this.canvasHeight;
			}
			if (point.x < this.cutArea.left) {
				this.cutArea.left = point.x;
			}
			if (point.x < 0) this.cutArea.left = 0;
		  
			this.lastPoint = this.currentPoint,
			this.currentPoint = point
			let currentLine = this.currentLine
			currentLine.unshift({
				time: new Date().getTime(),
				dis: this.distance(this.currentPoint, this.lastPoint),
				x: point.x,
				y: point.y
			})
			// this.currentLine = currentLine
			this.pointToLine(currentLine);
	    },
		// 笔迹结束
		uploadScaleEnd (e:any) {
		    if (e.type != 'touchend') return 0;
		    let point = {
		      x: e.changedTouches[0].x,
		      y: e.changedTouches[0].y
		    }
		    this.lastPoint = this.currentPoint,
			this.currentPoint = point
		    let currentLine = this.currentLine
		    currentLine.unshift({
		      time: new Date().getTime(),
		      dis: this.distance(this.currentPoint, this.lastPoint),
		      x: point.x,
		      y: point.y
		    })
		    // this.currentLine = currentLine
		    if (currentLine.length > 2) {
		      var info = (currentLine[0].time - currentLine[currentLine.length - 1].time) / currentLine.length;
		      //$("#info").text(info.toFixed(2));
		    }
		    //一笔结束，保存笔迹的坐标点，清空，当前笔迹
		    //增加判断是否在手写区域；
		    this.pointToLine(currentLine);
		    var currentChirography = {
		      lineSize: this.lineSize,
		      lineColor: this.lineColor
		    };
		    var chirography = this.chirography
		    chirography.unshift(currentChirography);
		    this.chirography = chirography
		    var linePrack = this.linePrack
		    linePrack.unshift(this.currentLine);
		    this.linePrack = linePrack
		    this.currentLine = []
		},
		retDraw () {
			this.hasDraw = false
			this.ctx.clearRect(0, 0, 700, 730)
			this.ctx.draw();
			
			//设置canvas背景
			this.setCanvasBg('rgba(255, 255, 255, 0)');
		},
		
		//画两点之间的线条；参数为:line，会绘制最近的开始的两个点；
		pointToLine (line:any) {
		    this.calcBethelLine(line);
		    return;
		},
		//计算插值的方式；
		calcBethelLine (line:any) {
		    if (line.length <= 1) {
		      line[0].r = this.radius;
		      return;
		    }
		    let x0, x1, x2, y0, y1, y2, r0, r1, r2, len, lastRadius, dis = 0, time = 0, curveValue = 0.5;
		    if (line.length <= 2) {
				x0 = line[1].x
				y0 = line[1].y
				x2 = line[1].x + (line[0].x - line[1].x) * curveValue;
				y2 = line[1].y + (line[0].y - line[1].y) * curveValue;
				//x2 = line[1].x;
				//y2 = line[1].y;
				x1 = x0 + (x2 - x0) * curveValue;
				y1 = y0 + (y2 - y0) * curveValue;;
		    } else {
				x0 = line[2].x + (line[1].x - line[2].x) * curveValue;
				y0 = line[2].y + (line[1].y - line[2].y) * curveValue;
				x1 = line[1].x;
				y1 = line[1].y;
				x2 = x1 + (line[0].x - x1) * curveValue;
				y2 = y1 + (line[0].y - y1) * curveValue;
		    }
		    //从计算公式看，三个点分别是(x0,y0),(x1,y1),(x2,y2) ；(x1,y1)这个是控制点，控制点不会落在曲线上；实际上，这个点还会手写获取的实际点，却落在曲线上
		    len = this.distance({ x: x2, y: y2 }, { x: x0, y: y0 });
		    lastRadius = this.radius;
		    for (let n = 0; n < line.length - 1; n++) {
				dis += line[n].dis;
				time += line[n].time - line[n + 1].time;
				if (dis > this.smoothness) break;
		    }
		    this.radius = Math.min(time / len * this.pressure + this.lineMin, this.lineMax) * this.lineSize
		    line[0].r = this.radius;
		    //计算笔迹半径；
		    if (line.length <= 2) {
				r0 = (lastRadius + this.radius) / 2;
				r1 = r0;
				r2 = r1;
				//return;
		    } else {
				r0 = (line[2].r + line[1].r) / 2;
				r1 = line[1].r;
				r2 = (line[1].r + line[0].r) / 2;
		    }
		    let n = 5;
		    let point = [];
		    for (let i = 0; i < n; i++) {
				let t = i / (n - 1);
				let x = (1 - t) * (1 - t) * x0 + 2 * t * (1 - t) * x1 + t * t * x2;
				let y = (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * y1 + t * t * y2;
				let r = lastRadius + (this.radius - lastRadius) / n * i;
				point.push({ x: x, y: y, r: r });
				if (point.length == 3) {
					let a = this.ctaCalc(point[0].x, point[0].y, point[0].r, point[1].x, point[1].y, point[1].r, point[2].x, point[2].y, point[2].r);
					a[0].color = this.lineColor;
					// let bethelPoint = this.bethelPoint;
					// bethelPoint = bethelPoint.push(a);
					this.bethelDraw(a, 1);
					point = [{ x: x, y: y, r: r }];
				}
		    }
		    this.currentLine = line
		},
		//求两点之间距离
		distance (a:any, b:any) {
		    let x = b.x - a.x;
		    let y = b.y - a.y;
		    return Math.sqrt(x * x + y * y);
		},
		ctaCalc (x0:any, y0:any, r0:any, x1:any, y1:any, r1:any, x2:any, y2:any, r2:any) {
		    let a = [], vx01, vy01, norm, n_x0, n_y0, vx21, vy21, n_x2, n_y2;
		    vx01 = x1 - x0;
		    vy01 = y1 - y0;
		    norm = Math.sqrt(vx01 * vx01 + vy01 * vy01 + 0.0001) * 2;
		    vx01 = vx01 / norm * r0;
		    vy01 = vy01 / norm * r0;
		    n_x0 = vy01;
		    n_y0 = -vx01;
		    vx21 = x1 - x2;
		    vy21 = y1 - y2;
		    norm = Math.sqrt(vx21 * vx21 + vy21 * vy21 + 0.0001) * 2;
		    vx21 = vx21 / norm * r2;
		    vy21 = vy21 / norm * r2;
		    n_x2 = -vy21;
		    n_y2 = vx21;
		    a.push({ mx: x0 + n_x0, my: y0 + n_y0, color: "#1A1A1A" });
		    a.push({ c1x: x1 + n_x0, c1y: y1 + n_y0, c2x: x1 + n_x2, c2y: y1 + n_y2, ex: x2 + n_x2, ey: y2 + n_y2 });
		    a.push({ c1x: x2 + n_x2 - vx21, c1y: y2 + n_y2 - vy21, c2x: x2 - n_x2 - vx21, c2y: y2 - n_y2 - vy21, ex: x2 - n_x2, ey: y2 - n_y2 });
		    a.push({ c1x: x1 - n_x2, c1y: y1 - n_y2, c2x: x1 - n_x0, c2y: y1 - n_y0, ex: x0 - n_x0, ey: y0 - n_y0 });
		    a.push({ c1x: x0 - n_x0 - vx01, c1y: y0 - n_y0 - vy01, c2x: x0 + n_x0 - vx01, c2y: y0 + n_y0 - vy01, ex: x0 + n_x0, ey: y0 + n_y0 });
		    a[0].mx = a[0].mx.toFixed(1);
		    a[0].mx = parseFloat(a[0].mx);
		    a[0].my = a[0].my.toFixed(1);
		    a[0].my = parseFloat(a[0].my);
		    for (let i = 1; i < a.length; i++) {
				a[i].c1x = a[i].c1x.toFixed(1);
				a[i].c1x = parseFloat(a[i].c1x);
				a[i].c1y = a[i].c1y.toFixed(1);
				a[i].c1y = parseFloat(a[i].c1y);
				a[i].c2x = a[i].c2x.toFixed(1);
				a[i].c2x = parseFloat(a[i].c2x);
				a[i].c2y = a[i].c2y.toFixed(1);
				a[i].c2y = parseFloat(a[i].c2y);
				a[i].ex = a[i].ex.toFixed(1);
				a[i].ex = parseFloat(a[i].ex);
				a[i].ey = a[i].ey.toFixed(1);
				a[i].ey = parseFloat(a[i].ey);
		    }
		    return a;
		},
		bethelDraw (point:any, is_fill:any, color:any) {
		    let ctx = this.ctx;
		    ctx.beginPath();
		    ctx.moveTo(point[0].mx, point[0].my);
		    if (undefined != color) {
		      ctx.setFillStyle(color);
		      ctx.setStrokeStyle(color);
		    } else {
		      ctx.setFillStyle(point[0].color);
		      ctx.setStrokeStyle(point[0].color);
		    }
		    for (let i = 1; i < point.length; i++) {
		      ctx.bezierCurveTo(point[i].c1x, point[i].c1y, point[i].c2x, point[i].c2y, point[i].ex, point[i].ey);
		    }
		    ctx.stroke();
		    if (undefined != is_fill) {
		      ctx.fill(); //填充图形 ( 后绘制的图形会覆盖前面的图形, 绘制时注意先后顺序 )
		    }
		    ctx.draw(true)
		},
		// 用来改变画笔颜色的，暂时不用
		selectColorEvent (event) {
			var color = event.currentTarget.dataset.colorValue;
			var colorSelected = event.currentTarget.dataset.color;
			this.selectColor = colorSelected,
			this.lineColor = color
		},
		//上传
		uploadCanvasImg() {
			const _that = this
			if (!_that.hasDraw) {
				uni.showToast({
					title: '签字是空白的，请输入签名',
					icon: 'none',
					duration: 2000
				})
				return false
			}
			uni.canvasToTempFilePath({
				canvasId: 'handWriting',
				fileType: 'png',
				quality: 1, //图片质量
				success:async (res) => {
					// console.log(res.tempFilePath, 'canvas生成图片地址');
					//上传
					if (!_that.loading) {
            _that.loading = true
            this.ctxTrans.rotate(-90 * Math.PI / 180)
            this.ctxTrans.drawImage(res.tempFilePath, -Math.abs((this.canvasHeight - this.canvasTransHeight)) / 3, Math.abs(this.canvasWidth - this.canvasTransWidth) / 3, this.canvasWidth / 2, this.canvasHeight / 2)
            await this.ctxTrans.draw()
            uni.canvasToTempFilePath({
              canvasId: 'trans',
              fileType: 'png',
              quality: 1, // 图片质量
              success: async (result) => {
                console.log(result.tempFilePath)
								uni.showToast({
									title: '图片上传中...',
									icon: 'loading'
								})
								const result2 = await	_that.$service.app.uploadSignatureFile({filePath:result.tempFilePath})
								let file = JSON.parse(result2.data)
								_that.loading = false
								if (_that.from === 'organization') {
								  if (_that.type === 'update') {
								    const result2 = await _that.$service.certification.updateInstitution({
								      id: _that.id,
								      signature:file.data.url
								    })
								    if (result2) {
								      uni.navigateBack({
								        delta: 1
								      })
								    }
								    return
								  }
									const result2 = await _that.$service.certification.addOrganizationDraft({
									id: _that.id,
									signature:file.data.url
									})
									if (result2) {
										uni.navigateBack({
											delta: 1
										})
									}
								
								} else if ( _that.from === 'enterprise') {
									const result2 = await _that.$service.certification.addEnterpriseDraft({
										id: _that.id,
										signatureUrl:file.data.url
									})
									if (result2) {
										uni.navigateBack({
											delta: 1
										})
									}
								} else if ( _that.from === 'manager') {
									const result2 = await _that.$service.certification.addManagerDraft({
										id: _that.id,
										signatureUrl:file.data.url
									})
									if (result2) {
										uni.navigateBack({
											delta: 1
										})
									}
								
								} else {
									const result2 = await _that.$service.certification.addObserverDraft({
										id: _that.id,
										signatureUrl:file.data.url
									})
									if (result2) {
										uni.navigateBack({
											delta: 1
										})
									}
								}
							}
						})
					}
					
				}
			})
		}
	}
})
</script>

<style>
	.wrapper {
		width: 100%;
		margin: 0 0 30rpx;
		overflow: hidden;
		font-size: 28rpx;
		background: #eee;
		border-radius: 20rpx;
		padding: 30rpx;
		box-sizing: border-box;
	}
	
	.hand-center {
  position: relative;
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
}

.hand-writing {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: none;
}
	
	.handBtn {
		display: flex;
		justify-content: space-between;
		align-content: space-between;
		margin-bottom: 20rpx;
	}
	
	.delBtn {
		opacity: 0.5;
	}
	
	.clearBtn {
		opacity: 0.5;
	}
	
	.previewBtn {
		position: absolute;
		top: 400rpx;
		left: 0rpx;
		transform: rotate(90deg);
		color: #666;
	}
	
	.black-select {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		position: absolute;
		top: 560rpx;
		left: 30rpx;
		background-color: #1A1A1A;
	}
	.black-select.color_select {
		border: 1px solid #fff;
	}
	.red-select {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		position: absolute;
		top:620rpx;
		left:30rpx;
		background-color: #ca262a;
	}
	.red-select.color_select {
		border: 1px solid #fff;
	}

		.primary{
		width: 550rpx;
		height: 82rpx;
		background: $--ym-bg-primary;
		border-radius: 50px;
		margin: 20rpx auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.border{
		border-right:1px solid  #DEDEDE;
	}
	.h-100{
		height:100vh;
	}
	.w-156{
		width:156rpx;
	}
	.min-w-156{
		min-width:156rpx;
	}
	.max-w-156{
		max-width:156rpx;
	}

	
.btn{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 229rpx;
  height: 96rpx;
  background: #f6f6f6;
  border: 1px solid #d4d4d4;
  transform:rotateZ(90deg)  translateY(40rpx) translateX(-300rpx);
  transform-origin: center;
}

.btn:last-child{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 229rpx;
  height: 96rpx;
  margin-top:48rpx;
  background: #f6f6f6;
  border: 1px solid #d4d4d4;
  transform:rotateZ(90deg)  translateY(40rpx) translateX(-200rpx);
  transform-origin: center;
}
.rounded-100{
	border-radius: 100rpx;
}
.bg-grey{
	background-color: #f6f6f6;
}
.tips{
	width:600rpx;
	transform: rotateZ(90deg) translateY(220rpx) translateX(300rpx);
}

.hand-center {
  position: relative;
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
}

.trans{
  position: absolute;
  top:0;
  right:-2000px;
  z-index: 9999;
  width:1000rpx;
  height:400rpx;
  background-color: antiquewhite;
}


</style>
