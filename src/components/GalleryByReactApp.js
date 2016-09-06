"use strict";

import React from "react";
import ReactDOM from "react-dom";

require("../style/main.scss");

//获取图片的相关数据
var imageData = require("../data/imageDatas.json");

//给每一个图片数据增加url
imageData = (function(imageDataArr) {
  for(var i=0; i<imageDataArr.length; i++) {    
    imageDataArr[i].imageURL = "../images/"+imageDataArr[i].fileName;  
  }
  return imageDataArr;
})(imageData);

function getRangeRandom(low, high) {
  return Math.ceil(Math.random()*(high-low)+low);
}

//获取0到30°的任意正负值
function get30DegRandom() {
  return ((Math.random() > 0.5 ? "" : "-")+Math.ceil(Math.random()*30));
}

//照片模块
var ImgFigure = React.createClass({

  handlerClick: function(e) {

    if(this.props.arrange.isCenter) {
         this.props.inverse();  
    } else {
      this.props.center();       
    }
    e.stopPropagation();
    e.preventDefault();
  },

  render: function() {
    var styleObj = {};

    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    //如果图片的旋转角度有值切不为0，添加旋转角度
    if(this.props.arrange.rotate) {
      (["MozTransform", "msTransform", "WebKitTransform", "transform"]).forEach(function(value){
        styleObj[value] = "rotate("+this.props.arrange.rotate+"deg)";
      }.bind(this));
    }

    if(this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    var imgFigureClassName = "img-figure";
    imgFigureClassName += this.props.arrange.isInverse?" is-inverse":"";

    return (
      <div className={imgFigureClassName} style={styleObj} onClick={this.handlerClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <div className="figcaption">
          <h2 className="img-title">{this.props.data.title}</h2>  
          <div className="img-back" onClick={this.handlerClick}>
            <p>{this.props.data.desc}</p>
          </div>      
        </div>
      </div>
    );
  }
});

var GalleryByReactApp = React.createClass({

  //存储图片排布的可取值范围
  Constant: {
    centerPos: {
      left:0,
      top:0
    },
    hPosRange: {
      //水平方向的取值范围
      leftSecX:[0,0],
      rightSecX:[0,0],
      y:[0, 0]
    },
    vPosRange:{//垂直方向的取值范围
      x:[0,0],
      topY:[0,0]
    }
  },

  //组件初始化时，定义状态相关数据
  getInitialState: function() {
    return {
      imgsArrangeArr: [
        /*{
          pos: {
            left:0,
            top:0
          },
          rotate: 0,
          isInverse: false,//图片正反面，false正面，true反面，默认false
          isCenter: false
        }*/
      ]
    };
  },

  /*
   *翻转图片
   * @param index 输入当前被执行的inverse操作的图片index
   * @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
  */
  inverse: function(index) {
    return function() {
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  },
  /*
   * 利用arrange函数，居中对应index的图片
   * @param index，需要被居中的图片对应的图片信息数组的index值
  */
  center : function(index) {
    return function() {
      this.arrangeData(index);
    }.bind(this);
  },
  /*
  * 计算图片布局的取值范围,整理数据
  * @param centerIndex 指定居中排布哪个图片
  */
  arrangeData: function(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeX = vPosRange.x,
        vPosRangeTopY = vPosRange.topY,

        imgsArrangeTopArr = [], //用来存储布局在上侧区域的图片的状态信息
        topImgNum = Math.floor(Math.random()*2), //取一个或者不取
        topImgSpliceIndex = 0, //用来标记我们布局在上侧区域的这张图片是从数组对象的哪个位置拿出来的
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        //首先居中centerIndex的图片,居中的centerIndex图片不需要旋转
        imgsArrangeCenterArr[0] = {
          pos:centerPos,
          rotate:0,
          isCenter: true
        }

        //取出要布局上侧图片的
        topImgSpliceIndex = Math.floor(Math.random()*imgsArrangeArr.length);
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value, index) {
          value.pos={
            top:getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
            left:getRangeRandom(vPosRangeX[0], vPosRangeX[1])
          };
          value.rotate = get30DegRandom();
          value.isCenter = false;
        });

        //布局左右两侧的图片
        for(var i=0, j=imgsArrangeArr.length, k=j/2; i<j; i++) {
          var hPosRangeLorRX = null;
          //前半部分布局左边，右半部分布局右边
          if(i<k) {
            hPosRangeLorRX = hPosRangeLeftSecX;
          } else {
            hPosRangeLorRX = hPosRangeRightSecX;
          }

          imgsArrangeArr[i] = {
            pos: {
              top:getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLorRX[0], hPosRangeLorRX[1])
            },
            rotate: get30DegRandom(),
            isCenter: false
          }
        }
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
          imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        })

  },

  //组件加载以后计算各个区域的图片位置范围
  componentDidMount: function() {
    //拿到舞台    
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
    //拿到一个imgFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgFigureW = imgFigureDOM.scrollWidth,
        imgFigureH = imgFigureDOM.scrollHeight,
        halfImgFigureH = Math.ceil(imgFigureH/2),
        halfImgFigureW = Math.ceil(imgFigureW/2);
    //计算中心图片的位置点
    this.Constant.centerPos = {
      left : halfStageW - halfImgFigureW,
      top : halfStageH - halfImgFigureH
    };

    //计算左侧和右侧图片的排布范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgFigureW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - 3*halfImgFigureW;
    this.Constant.hPosRange.y[0] = -halfImgFigureH;
    this.Constant.hPosRange.y[1] = stageH - halfImgFigureH;
    this.Constant.hPosRange.rightSecX[0] = halfStageW+halfImgFigureW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgFigureW;

    //计算上侧区域的排布范围
    this.Constant.vPosRange.x[0] = halfStageW - imgFigureW;
    this.Constant.vPosRange.x[1] = halfStageW + imgFigureW;
    this.Constant.vPosRange.topY[0] = -imgFigureH;
    this.Constant.vPosRange.topY[1] = halfStageH - 3*halfImgFigureH;

    this.arrangeData(0);

  },

  render: function() {
    var controllerUnits = [],
        imgFigureArr = [];

    imageData.forEach(function(value, index) {
      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left:0,
            top:0
          },
          isInverse: false,
          rotate: 0
        };
      }
      imgFigureArr.push(<ImgFigure key={index} data={value} ref={"imgFigure"+index} 
        arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);
    }.bind(this));

    return (
      <div className="stage" ref="stage">
        <div className="img-sec">{imgFigureArr}</div>
        <div className="controller-nav"></div>
      </div>
    );
  }
});

ReactDOM.render(<GalleryByReactApp />, document.getElementById("content"));