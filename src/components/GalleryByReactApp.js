"use strict";

import React from "react";
import ReactDOM from "react-dom";

require("../style/main.scss");

//获取图片相关数据
var imageDatas = require("../data/imageDatas.json");



imageDatas = (function(imageDatasArr) {
  for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImageData = imageDatasArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDatasArr[i] = singleImageData;
    }

    return imageDatasArr;
})(imageDatas);


var GalleryByReactApp = React.createClass({
  render: function() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
});

ReactDOM.render(<GalleryByReactApp />, document.getElementById('content'));