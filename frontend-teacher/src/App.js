import React from 'react';
import logo from './logo.svg';
import './App.css';
import Pic from './a.png'
import * as firebase from "firebase/app";
import { Input, Button, Popup } from 'semantic-ui-react'
require("firebase/firestore");
const image2base64 = require('image-to-base64');
const axios = require('axios')

let db

class App extends React.Component {
	constructor(props) {
		super(props)

		// Your web app's Firebase configuration
		var firebaseConfig = {
			apiKey: "AIzaSyDJl8MFb9uF-JWeWdSTvrGNRFH-VTInxnI",
			authDomain: "hackathon-west-bank.firebaseapp.com",
			databaseURL: "https://hackathon-west-bank.firebaseio.com",
			projectId: "hackathon-west-bank",
			storageBucket: "hackathon-west-bank.appspot.com",
			messagingSenderId: "347552077341",
			appId: "1:347552077341:web:d22fdc97264355e3"
		};
		// Initialize Firebase
		firebase.initializeApp(firebaseConfig);
		db = firebase.firestore()

		let pythonData = {}

		db.collection(`1`).onSnapshot(snapshot => {
			let rectArray = []

			snapshot.forEach((rect) => {
				rectArray.push(rect.data())
			})
			this.process(rectArray)
			// pythonData.rectArray = rectArray
			// pythonData.image = 'https://firebasestorage.googleapis.com/v0/b/hackathon-west-bank.appspot.com/o/slide.png?alt=media'
			// axios.post('http://134.209.118.156:8080/highlight', JSON.stringify(pythonData), ).then((res) => {
			// 	console.log(res.data)
			// 	let a = res.data
			// 	let clusters = [
				
			// 	]
				
			// 	Object.keys(a).map(key => {
			// 		let b = key.replace('[', "").replace(']', "").split(",")
			// 		let textRect = b.map(element => {
			// 			return parseFloat(element)
			// 		})
			// 		console.log(textRect)
		
			// 		let value = a[key]
		
			// 		clusters.push({
			// 				...a[key][0],
			// 				x: textRect[0] * 100,
			// 				y: textRect[1] * 100,
			// 				w: textRect[2] * 100,
			// 				h: textRect[3] * 100
			// 			}
			// 		)
			// 	})
		
			// 	console.log(clusters)

			// 	this.setState({clusters})
			// })
			// console.log("Sen request")
		})

		// image2base64('./a.png').then(data => {
		// 	pythonData.image = data
		// })

		

		this.state = {
			x: 0,
			y: 0,
			dimensions: {

			},
			mouseDown: false,
			selected: [

			],
			tempRect: null,
		}
		// setTimeout(() => {
		// 	console.log(JSON.stringify(pythonData))
		// }, 3000)
	}

	render() {
		let { x0, x1, y0, y1 } = this.state
		return (
			<div className="App" style={{
				width: '100vw',
				height: '100vh',
				backgroundColor: '#545B6A',
				display: 'flex',
				flexDirection: 'row',
				overflow: 'hidden',
			}}>
				<div style={{
					width: '80vw',
					height: '100wh',
					position: 'relative',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center'
				}}>
					<h2 style={{ color: 'white', textSize: 16 }}>Slide 1 of 1</h2>
					<div style={{
						width: this.state.dimensions.width,
						height: this.state.dimensions.height,
						position: 'relative'
					}}>
						<img
							src={Pic}
							onDragStart={(e) => e.preventDefault()}
							onMouseMove={this._onMouseMove}
							onMouseDown={this._onMouseDown}
							onMouseUp={this._onMouseUp}
							onLoad={this.onImgLoad}
						></img>
						<Rector offsetY={this.state.dimensions.height} height={this.state.dimensions.height} width={this.state.dimensions.width}
							onSelected={this.onSelected}
						></Rector>
						{
							this.state.clusters &&
							this.state.clusters.map((cluster) => {
								if (this.state.showsHighlight) {
									return (
										<>
											<Popup
												content={
													<div>
														<b>{cluster.count["Define"] + " requests for definition"}</b>
														<br/>
														<b>{cluster.count["Elaboration"] + " requests for elaboration"}</b>
														<br/>
														<b>{cluster.count["Examples"] + " requests for examples"}</b>
													</div>
												}
												position='top center'
												open
												trigger={
													<div
														style={{
															left: cluster.x / 100 * this.state.dimensions.width,
															top: cluster.y / 100 * this.state.dimensions.height,
															width: cluster.w / 100 * this.state.dimensions.width,
															height: cluster.h / 100 * this.state.dimensions.height,
															borderStyle: 'dotted',
															borderWidth: '2px',
															borderColor: 'red',
															position: 'absolute'
														}}
													>
													</div>
												}
											/>
										</>
									)
								} else {
									return (
										<div
											style={{
												left: cluster.x / 100 * this.state.dimensions.width,
												top: cluster.y / 100 * this.state.dimensions.height,
												width: cluster.w / 100 * this.state.dimensions.width,
												height: cluster.h / 100 * this.state.dimensions.height,
												borderStyle: 'dotted',
												borderWidth: '2px',
												borderColor: 'red',
												position: 'absolute'
											}}
										>
										</div>
									)
								}
							})
						}
					</div>
				</div>

				<div style={{
					width: '20vw',
					height: '100wh',
					backgroundColor: '#464D5B',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center'
				}}>
					{/* <Input placeholder="Student name" onChange={(e) => { this.setState({ studentName: e.target.value }) }}/>
					<Button onClick={() => this.sendHighlight("Topic1")}>Topic1</Button>
					<Button onClick={() => this.sendHighlight("Topic2")}>Topic2</Button>
					<Button onClick={() => this.sendHighlight("Topic3")}>Topic3</Button> */}
					<h3 style={{ color: 'white' }}>{this.state.clusters && (this.state.clusters.length + " highlights for further elaboration")}</h3>
					<h3 style={{ color: 'white' }}>{this.state.totalCount && (this.state.totalCount["Define"] + " students ask for definition")}</h3>
					<h3 style={{ color: 'white' }}>{this.state.totalCount && (this.state.totalCount["Elaboration"] + " students ask for elaboration")}</h3>
					<h3 style={{ color: 'white' }}>{this.state.totalCount && (this.state.totalCount["Examples"] + " students ask for further examples")}</h3>
					<br />
					<Button color='teal' onClick={() => this.setState({ showsHighlight: !this.state.showsHighlight })}>Show highlights</Button>
				</div>
			</div>
		);
	}

	mapRects = (rectArray) => {
		return rectArray.map(rect => {
			let { x, y, w, h } = rect
			return {
				top: y, left: x, right: x + w, bottom: y + h, ...rect
			}
		})
	}

	overlapArea = (rect1, rect2) => {
		let x_overlap = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
		let y_overlap = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
		return x_overlap * y_overlap;
	}

	areaRect = (rect) => {
		return rect.w * rect.h;
	}

	process = (rectArray) => {
		console.log('process function')
		console.log(rectArray)
		let mappedRectArray = this.mapRects(rectArray)

		let clusters = []

		for (let i = 0; i < mappedRectArray.length; i++) {
			let continueFlag = false;

			for (let j = 0; j < clusters.length; j++) {
				for (let k = 0; k < clusters[j].length; k++) {
					let overlapArea = this.overlapArea(mappedRectArray[i], clusters[j][k])
					if ((overlapArea / this.areaRect(mappedRectArray[i])) > 0.7 || (overlapArea / this.areaRect(clusters[j][k])) > 0.7) {
						console.log("70%")
						clusters[j].push(mappedRectArray[i])
						continueFlag = true
						break
					}
				}
				if (continueFlag) break;
			}

			if (continueFlag) continue
			clusters.push([mappedRectArray[i]])
		}

		console.log(clusters)

		let totalCount = {
			"Define": 0,
			"Elaboration": 0,
			"Examples": 0
		}

		for (let i = 0; i < clusters.length; i++) {
			let maxArea = 0
			let maxAreaRect;
			let count = {
				"Define": 0,
				"Elaboration": 0,
				"Examples": 0
			}

			clusters[i].map(rect => {
				if (rect.w * rect.h > maxArea) {
					maxArea = rect.w * rect.h
					maxAreaRect = rect
				}
				count[rect.type]++
				totalCount[rect.type]++
			})

			maxAreaRect.count = count
			clusters[i] = maxAreaRect
		}

		console.log(clusters)
		this.setState({ clusters: clusters, totalCount: totalCount })
	}

	onSelected = (rect) => {
		console.log(rect)
		this.setState({ tempRect: rect })
	}

	sendHighlight = (topic) => {
		let { x, y, w, h } = this.state.tempRect
		console.log(this.state.tempRect)
		console.log(this.state.dimensions)
		this.sendHighlightFirestore(this.state.studentName, x / this.state.dimensions.width * 100, y / this.state.dimensions.height * 100, w / this.state.dimensions.width * 100, h / this.state.dimensions.height * 100, 1, topic)
	}

	onConfirmSend = () => {
		this.setState({ selected: [...this.state.selected, this.state.tempRect], tempRect: null })
	}

	_onMouseMove = (e) => {
		this.setState({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
		if (this.state.mouseDown) this.setState({ x1: e.nativeEvent.offsetX, y1: e.nativeEvent.offsetY })
	}

	_onMouseUp = () => {
		this.setState({ x1: this.state.x, y1: this.state.y, mouseDown: false });
	}

	_onMouseDown = () => {
		this.setState({ x0: this.state.x, y0: this.state.y, x1: this.state.x, y1: this.state.y, mouseDown: true });
	}

	onImgLoad = ({ target: img }) => {
		this.setState({ dimensions: { height: img.offsetHeight, width: img.offsetWidth } });
	}

	sendHighlightFirestore = (sender, x, y, w, h, slide, type) => {
		// Add a new document in collection "questions"
		db.collection("questions").add({
			sender, x, y, w, h, slide, type
		})
			.then(function () {
				console.log("Document successfully written!");
			})
			.catch(function (error) {
				console.error("Error writing document: ", error);
			});
	}
}

class Rector extends React.Component {
	static defaultProps = {
		strokeStyle: '#F00',
		lineWidth: 1,
		onSelected: () => { },
	};

	canvas = null;
	ctx = null;
	isDirty = false;
	isDrag = false;
	startX = -1;
	startY = -1;
	curX = -1;
	curY = -1;

	constructor(props) {
		super(props);
	}

	componentDidMount(props) {
		this.ctx = this.canvas.getContext('2d')
		this.ctx.strokeStyle = this.props.strokeStyle
		this.ctx.lineWidth = this.props.lineWidth
		this.addMouseEvents()
	}

	updateCanvas = () => {
		if (this.isDrag) {
			requestAnimationFrame(this.updateCanvas)
		}
		if (!this.isDirty) {
			return
		}

		this.ctx.clearRect(0, 0, this.props.width, this.props.height)
		if (this.isDrag) {
			const rect = {
				x: this.startX,
				y: this.startY,
				w: this.curX - this.startX,
				h: this.curY - this.startY,
			}
			this.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)
		}
		this.isDirty = false
	};

	componentWillUnmount() {
		this.removeMouseEvents()
	}

	addMouseEvents() {
		this.canvas.addEventListener('mousedown', this.onMouseDown, false);
		this.canvas.addEventListener('mousemove', this.onMouseMove, false);
		this.canvas.addEventListener('mouseup', this.onMouseUp, false);
	}
	removeMouseEvents() {
		this.canvas.removeEventListener('mousedown', this.onMouseDown, false);
		this.canvas.removeEventListener('mousemove', this.onMouseMove, false);
		this.canvas.removeEventListener('mouseup', this.onMouseUp, false);
	}

	onMouseDown = (e) => {
		this.isDrag = true
		this.curX = this.startX = e.offsetX
		this.curY = this.startY = e.offsetY
		requestAnimationFrame(this.updateCanvas)
	};

	onMouseMove = (e) => {
		if (!this.isDrag) return
		this.curX = e.offsetX
		this.curY = e.offsetY
		this.isDirty = true
	};

	onMouseUp = (e) => {
		this.isDrag = false
		this.isDirty = true

		const rect = {
			x: Math.min(this.startX, this.curX),
			y: Math.min(this.startY, this.curY),
			w: Math.abs(e.offsetX - this.startX),
			h: Math.abs(e.offsetY - this.startY),
		}

		this.props.onSelected(rect)
	};

	render() {
		return <canvas style={{ transform: `translateY(-${this.props.offsetY}px` }} width={this.props.width} height={this.props.height} ref={(c) => { this.canvas = c }} />
	}
}

export default App;
