/*
* @Author: huangteng
* @Date:   2018-02-28 21:37:29
* @Last Modified by:   huangteng
* @Last Modified time: 2018-03-06 21:30:20
* @Description: 本地图片选择器
*/

import React from 'react';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import html2canvas from 'html2canvas';

const ImgBox = styled.div`
	width: 75%;
	height: 75%;
	border-radius: 2px;
	outline: #eee dashed medium;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	cursor: pointer;
`;

const Img = styled.img`
	position: absolute;
	max-width: 100%;
	max-height: 100%;
	filter: blur(${props=>props.blur}px) 
	        brightness(${props=>props.brightness}%) 
	        contrast(${props=>props.contrast}%)
	        grayscale(${props=>props.grayscale}%)
	        hue-rotate(${props=>props.hue}deg)
	        invert(${props=>props.invert}%)
	        opacity(${props=>props.opacity}%)
	        saturate(${props=>props.saturate}%)
	        sepia(${props=>props.sepia}%);
`;

const Text = styled.p`
	font-size: 20px;
	color: #b5b5b5;
	text-align: center;
	top: 50%;
	position: relative;
	transform: translateY(-50%);
`;

const ExportImgButton = styled.a`
	position: absolute;
	bottom: 10px;
	left: 50%;
	transform: translateX(-50%);
	display: block;
	padding: 6px 30px;
	border-radius: 25px;
	background-color: #87B0E2;
	color: white;
	font-size: 16px;
	cursor: pointer;
	text-decoration: none;
`;

const CLOUDINARY_UPLOAD_PRESET = 'your_preset';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/your_name/image/upload';

export default class ImgUploader extends React.Component {
	state = {
		uploadImgUrl: '', // 保存cloudinary返回的图片路径
		uploadFile: null, // 上传的文件,
		Msg: 'drop image here'
	}
	// image drop cb
	onImageDrop = (files) => {
		this.setState({
			uploadFile: files[0],
			Msg: 'upload start...'
		})

		this.handleUploadFile(files[0]);
	}
	// upload file
	handleUploadFile = (file) => {
		let uploader = null;
		try{
			uploader = request.post(CLOUDINARY_UPLOAD_URL)
 						          .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                        	      .field('file', file);
		}catch(e){
			this.setState({
				Msg: `err: unkown error!`
			})
		}
		
		uploader && uploader.end((err, res) => {
			if(err){
				this.setState({
					Msg: `err: ${err.message}!`
				})
			}

			if(res.body.secure_url !== ''){
				this.setState({
					uploadImgUrl : res.body.secure_url,
					Msg: 'upload success! loading img...'
				})
			}
		})
	}

	// 获取像素比
	getDPR =() =>{
		if(window.devicePixelRatio && window.devicePixelRatio > 1){
			return window.devicePixelRatio;
		}
		return 1;
	}

	// 加载图像
	loadImage = (url) => {
		return new Promise((resolve, reject) => {
			var image = new Image();
			image.crossOrigin = 'Anonymous';
			image.onload = () => {
				image.onload = null;
				resolve(image);
			}
			image.onerror = (err) => {
				reject(err);
			}
			image.src = url; // PS:这个必须放在设置crossOrigin后边。
		})
	}

	// 自定义截图保存，因为html2canvas不支持filter属性
	savePngByCanvas = (type='png') => {
		let currNode = this.imgNode.previousSibling.firstChild.firstChild;
		if(currNode.tagName!=='IMG' || !currNode){
			this.setState({
				Msg: 'error!'
			})
			return;
		}
		this.loadImage(currNode.src)
		.then(img => {
			let _canvas = document.createElement('canvas'),
				w = img.width,
				h = img.height,
				dpr = this.getDPR();
				
			// 解决清晰度问题
			_canvas.width = w * dpr;
			_canvas.height = h * dpr;
			_canvas.style.width = `${w}px`;
			_canvas.style.height = `${h}px`;
			// draw image
			const context = _canvas.getContext('2d');
			context.scale(dpr, dpr);
			context.filter = window.getComputedStyle(currNode).filter;
			context.drawImage(img, 0, 0, _canvas.width, _canvas.height);
			this.saveImage(_canvas.toDataURL(`image/${type}`));
		})
		.catch(err=>{
			console.error('here is wrong', err);
		})
	}

	// html2canvas截图
	async html2Cavans(){
		let currNode = this.imgNode.previousSibling.firstChild.firstChild,
		    dpr = this.getDPR(),
		    _canvas = document.createElement('canvas'),
		    w = parseInt(currNode.offsetWidth, 10),
		    h = parseInt(currNode.offsetHeight, 10);

		if(currNode.tagName !== 'IMG'){
			return null;
		}
		// 跨域
		currNode.crossOrigin = 'Anonymous';
		// 解决清晰度问题
		_canvas.width = w * dpr;
		_canvas.height = h * dpr;
		_canvas.style.width = `${w}px`;
		_canvas.style.height = `${h}px`;
		const context = _canvas.getContext('2d');
		context.scale(dpr, dpr);
		// html2canvas
		return await html2canvas(currNode, {
			canvas: _canvas, 
			useCORS: true
		});
	}
	// 下载html2canvas截图
	saveImgByHtml2Canvas = (type='png') =>{
		this.html2Cavans()
		.then( canvas => {
			// 关闭锯齿
			/*
            let context = canvas.getContext('2d');
			context.mozImageSmoothingEnabled = false;
        	context.webkitImageSmoothingEnabled = false;
        	context.msImageSmoothingEnabled = false;
        	context.imageSmoothingEnabled = false;
        	*/
			let strData = canvas.toDataURL(`image/${type}`);
			if(strData !== "data:,"){
				this.saveImage(strData);
			}
		})
		.catch(err =>{
			this.setState({
				Msg: 'something wrong!'
			})
		})
	}

	// 下载图片
	saveImage = (strData) => {
		let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
		save_link.href = strData;
		save_link.download =  'download.png';
		let event = new MouseEvent('click')
		save_link.dispatchEvent(event);
	}

	// 点击下载 
	handleExportImg = () => {
		//this.saveImgByHtml2Canvas();
		this.savePngByCanvas();
	}

	render(){
		let {uploadImgUrl, Msg} = this.state;
		let {data} = this.props;
		
		const styles={
			'position': 'absolute',
			'top': '0',
			'left': '0',
			'bottom':'0',
			'right': '0',
		}

		return(
			<div>
				<ImgBox>
					{
						<Dropzone 
							multiple={false}
							accept={'image/*'}
							onDrop={this.onImageDrop}
							style={styles}
						>
							{
								!uploadImgUrl ? <Text>{Msg}</Text> : <Img src={uploadImgUrl} {...data}/>
							}
						</Dropzone> 
					}
				</ImgBox>
				<ExportImgButton 
					innerRef={img=>this.imgNode=img} 
					onClick={this.handleExportImg}
				>
					Downloads
				</ExportImgButton>
			</div>
		)
	}
}