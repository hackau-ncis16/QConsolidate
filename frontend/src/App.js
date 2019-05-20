import React from 'react';
import logo from './logo.svg';
import './App.css';
import Pic from './a.png'
import { Input } from 'semantic-ui-react';
import { Button, Modal, Form } from 'semantic-ui-react';
import * as firebase from "firebase/app";
require("firebase/firestore");
const axios = require('axios')

let db

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			x: 0,
			y: 0,
			dimensions: {

			},
			mouseDown: false,
			selected: [

			],
			tempRect: null
		}

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
	}

	render() {
		let { x0, x1, y0, y1 } = this.state
		return (
			<div className="App" style={{
				width: '100vw',
				height: '100vh',
				backgroundColor: 'grey',
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
					<h2 style={{color: 'white', textSize: 16}}>Slide 1 of 1</h2>
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
							onSelected={this.onSelected} removeTempRect={() => { this.setState({ tempRect: null }) }}
						></Rector>
						{
							this.state.tempRect &&
							<div
								style={{
									left: this.state.tempRect.x,
									top: this.state.tempRect.y,
									width: this.state.tempRect.w,
									height: this.state.tempRect.h,
									borderStyle: 'dotted',
									borderWidth: '2px',
									borderColor: 'red',
									position: 'absolute'
								}}
							/>
						}
						{
							this.state.selected.map(rect =>
								<div
									style={{
										left: rect.x,
										top: rect.y,
										width: rect.w,
										height: rect.h,
										borderStyle: 'solid',
										borderWidth: '2px',
										borderColor: this.topicToColor(rect.topic),
										position: 'absolute',
									}}
								/>
							)
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
					justifyContent: 'center',
					position: 'relative'
				}}>
					<Input placeholder="Student name" onChange={(e) => { this.setState({ studentName: e.target.value }) }} />
					<br/>
					<Button color='green' onClick={() => this.sendHighlight("Define")}>Define</Button>
					<br/>
					<Button color='blue' onClick={() => this.sendHighlight("Elaboration")}>Elaboration</Button>
					<br/>
					<Button color='purple' onClick={() => this.sendHighlight("Examples")}>Examples</Button>
					<Button color='teal' style={{ position: 'absolute', top: 10, right: 10}} onClick={() => this.setState({askModal: true})}>?</Button>
				</div>

				<Modal size='mini' open={this.state.askModal}>
					<Modal.Header style={{ backgroundColor: '#464D5B', textAlign: 'center' }}><b style={{ color: '#B2B4B9' }}>Ask a question</b></Modal.Header>
					<Modal.Content style={{ backgroundColor: '#545B6A', textAlign: 'center' }}>
						<Form>
							<Form.TextArea value={this.state.question} onChange={(e, d) => this.setState({question: d.value})}></Form.TextArea>
						</Form>
						
						<Button color='teal' style={{ marginRight: 20, marginTop: 10 }} onClick={this.sendQuestion	} size='tiny'>
							<b style={{ fontSize: 14 }}>Submit</b>
						</Button>

						<Button color='google plus' onClick={() => this.setState({askModal: false})} style={{ marginTop: 10 }} size='tiny'>
							<b style={{ fontSize: 14 }}>Close</b>
						</Button>
					</Modal.Content>
				</Modal>
			</div>
		);
	}

	onSelected = (rect) => {
		console.log(rect)
		this.setState({ tempRect: rect })
	}

	topicToColor = (topic) => {
		if (topic === "Define") return "green"
		if (topic === "Elaboration") return "blue"
		if (topic === "Examples") return "purple"
	}

	sendHighlight = (topic) => {
		let { x, y, w, h } = this.state.tempRect
		console.log(this.state.tempRect)
		console.log(this.state.dimensions)
		this.sendHighlightFirestore(this.state.studentName, x / this.state.dimensions.width * 100, y / this.state.dimensions.height * 100, w / this.state.dimensions.width * 100, h / this.state.dimensions.height * 100, 1, topic)
		this.onConfirmSend(topic)
	}

	sendQuestion = () => {
		axios.post('http://134.209.118.156:8080/ask_question', {data: this.state.question}).then(res => {
			this.setState({question: res.data})
		})
	}

	onConfirmSend = (topic) => {
		this.setState({ selected: [...this.state.selected, { ...this.state.tempRect, topic }], tempRect: null })
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
		db.collection("1").add({
			sender, x, y, w, h, type
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
		strokeStyle: '#FF0000',
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
		this.ctx.setLineDash([5, 3]);
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
			this.ctx.setLineDash([5, 3]);
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
		this.props.removeTempRect()
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
