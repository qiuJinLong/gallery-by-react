"use strict";

import React from "react";
import ReactDOM from "react-dom";

require("../style/main.scss");

//获取图片相关数据
var imageDatas = require("../data/imageDatas.json");

//给每一个图片数据增加url
imageDatas = (function(imageDatasArr) {
  for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImageData = imageDatasArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDatasArr[i] = singleImageData;
    }
    return imageDatasArr;
})(imageDatas);

function getRangeRandom(low, high) {
  return Math.ceil(Math.random()*(high-low) + low);
}


//照片模块
var ImgFigure = React.createClass({
  render: function() {
    var styleObj = {};

    // 如果props属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
        styleObj = this.props.arrange.pos;
    }

    // 如果是居中的图片， z-index设为11
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL} 
          alt={this.props.data.title}
        />
        <figcaption><h2 className="img-title">{this.props.data.title}</h2></figcaption>
      </figure>
    );
  }
});

//总控制
var GalleryByReactApp = React.createClass({
  
  //存储图片排布的可取值范围
  Constant: {
    centerPos: {
      left:0,
      right:0
    },
    hPosRange :{//水平方向的取值范围
      leftSecX: [0,0],
      rightSecX:[0,0],
      y: [0,0]
    },
    vPosRange: { //垂直方向的取值范围
      x:[0,0],
      topY:[0,0] 
    }
  },

  /*
   *  重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
  */
  rearrange : function(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [], //用来存储布局在上侧区域的图片的状态信息
        topImgNum = Math.floor(Math.random()*2), //取一个或者不取
        topImgSpliceIndex = 0, //用来标记我们布局在上侧区域的这张图片是从数组对象的哪个位置拿出来的

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        //首先居中centerIndex的图片
        imgsArrangeCenterArr[0].pos = centerPos;

        //取出要布局上侧图片的状态信息
        topImgSpliceIndex = Math.floor(Math.random() * imgsArrangeArr.length);
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value, index) {
          value = {
            pos: {
                  top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                  left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
              }
          }
        });

        //布局左右两侧的图片
        for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
          var hPosRangeLORX = null;

            // 前半部分布局左边， 右半部分布局右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
              pos: {
                  top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                  left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
              }
            };
        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });



  },

  getInitialState: function() {
    return {
      imgsArrangeArr: [
        /*{
          pos: {
            left:0,
            top:0
          }
        }*/
      ]
    }
  },

  //组件加载以后为每张图片计算位置范围
  componentDidMount: function(){
    //拿到舞台
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    //拿到一个imgFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);

    //计算中心图片的位置点
    this.Constant.ceterPos = {
      left: halfStageW-halfImgW,
      top: halfStageH-halfImgH
    };

    //计算左侧和右侧区域图片排布的位置范围
    this.Constant.hPosRange.leftSecX[0] =  -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算中间区域的位置点
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW + imgW;
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;

    this.rearrange(0);

  },

  render: function() {
    var controllerUnits = [],
        imgFigures = [];

    imageDatas.forEach(function(value, index){
      console.log(value);
      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left:0,
            top:0 
          }
        }
      }
      imgFigures.push(<ImgFigure data={value} ref={"imgFigure"+index} arrange={this.state.imgsArrangeArr[index]} />);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
});

ReactDOM.render(<GalleryByReactApp />, document.getElementById('content'));