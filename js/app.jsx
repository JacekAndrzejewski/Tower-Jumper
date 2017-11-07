/*jshint ignore:start*/
import React from 'react';
import ReactDOM from 'react-dom';
import {
	Router,
	Route,
	Link,
	IndexLink,
	IndexRoute,
	hashHistory
}	from 'react-router';

let maxFPS=40;
let g=2;
let textMode=true;
let startText="Uruchom w trybie tekstowym";
let el;
let screenW=1280;
let minW=30;

let tower=`
_________ _______           _______  _______
\\__   __/(  ___  )|\\     /|(  ____ \\(  ____ )
   ) (   | (   ) || )   ( || (    \\/| (    )|
   | |   | |   | || | _ | || (__    | (____)|
   | |   | |   | || |( )| ||  __)   |     __)
   | |   | |   | || || || || (      | (\\ (
   | |   | (___) || () () || (____/\\| ) \\ \\__
   )_(   (_______)(_______)(_______/|/   \\__/

`;
let jumper=`
_________          _______  _______  _______  _______
\\__    _/|\\     /|(       )(  ____ )(  ____ \\(  ____ )
   )  (  | )   ( || () () || (    )|| (    \\/| (    )|
   |  |  | |   | || || || || (____)|| (__    | (____)|
   |  |  | |   | || |(_)| ||  _____)|  __)   |     __)
   |  |  | |   | || |   | || (      | (      | (\\ (
|\\_)  )  | (___) || )   ( || )      | (____/\\| ) \\ \\__
(____/   (_______)|/     \\||/       (_______/|/   \\__/

`;

let animation=[
`


___________ 
 o
-0-
/_\\________ 
`,
`


_o_________ 
-0-
/ \\
___________ 
`,
`

 o
-0-________ 
/ \\

___________ 
`,
`
 o
-0-
/_\\________ 


___________ 
`,
`

 o
-0-________ 
/ \\

___________ 
`,
`


_o_________ 
-0-
/ \\
___________ 
`]

function generateText()
{
	let background1="_____";
	let background2="|    ";
	let backgroundFin="";
	for(let i=0;i<80;i++)
	{
		for(let j=0;j<80;j++)
			if(i%2===0)
				backgroundFin+=background1;
			else
				backgroundFin+=background2;
		backgroundFin+="\n"
	}
	data.text.background=backgroundFin;

	let wall="|=|\n";
	for(let i=0;i<6;i++)
		wall=wall+wall;
	data.text.wLeft=data.text.wRight=wall;
}

let data={
	text:{
		character: ` o\n/0\\\n/ \\`,
		background: `========================================\n`,
		wLeft: `|=|`,
		wRight: `|=|`,
		platform: `TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT`,
	},
	graphic:{
		character: "./img/character.png",
		background: "./img/background.jpg",
		wLeft: "./img/wall.jpg",
		wRight: "./img/wall.jpg",
		platform: "./img/wall.jpg",
	},
};
if(textMode===true)
	generateText();

function element(name)
{
	this.render=(style)=>
	{
		if(textMode===true)
			return <pre className={name} style={{...style}}>{data.text[name]}</pre>;
		else
			return <div className={name} style={{backgroundImage:"url("+data.graphic[name]+")",...style}}/>;
	}
}

class Character extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state={
			x:0,
			y:128,
			h:80,
			w:50,
			speedX:0,
			speedY:0,
			slowRateX:1,
			slowRateY:g,
			speedUpRateX:2,
			speedUpRateY:30,
			maxSpeedX:20,
			maxSpeedY:40,
			onGround: true,
			minX:0,
			maxX:2000,
			plat:0,
			started: false,
			keys: {w:false, a:false, s:false, d:false},
		};
	}
	get newX()
	{
		return this.state.x+this.state.speedX;
	};
	get newY()
	{
		return this.state.y+this.state.speedY;
	};
	moveRight=()=>
	{
		let newX=this.state.x;
		let newSpeedX=this.state.speedX;
		let maxSpeedX=this.state.maxSpeedX;

		newX+=newSpeedX;
		newSpeedX+=this.state.speedUpRateX;

		if(newSpeedX>maxSpeedX)
			newSpeedX=maxSpeedX;
		if(newSpeedX<-maxSpeedX)
			newSpeedX=-maxSpeedX;

		this.setState({
			x:newX,
			speedX:newSpeedX,
		});
	};
	moveLeft=()=>
	{
		let newX=this.state.x;
		let newSpeedX=this.state.speedX;
		let maxSpeedX=this.state.maxSpeedX;

		newX+=newSpeedX;
		newSpeedX-=this.state.speedUpRateX;

		if(newSpeedX>maxSpeedX)
			newSpeedX=maxSpeedX;
		if(newSpeedX<-maxSpeedX)
			newSpeedX=-maxSpeedX;

		this.setState({
			x:newX,
			speedX:newSpeedX,
		});
	};
	slowX=()=>
	{
		let newX=this.state.x;
		let newSpeedX=this.state.speedX;
		let maxSpeedX=this.state.maxSpeedX;

		newX+=newSpeedX;
		if(newSpeedX>0)
			newSpeedX-=this.state.slowRateX;
		else if(newSpeedX<0)
			newSpeedX+=this.state.slowRateX;

		if(Math.abs(newSpeedX)<this.state.slowRateX)
			newSpeedX=0;
		else
		{
			if(newSpeedX>maxSpeedX)
				newSpeedX=maxSpeedX;
			if(newSpeedX<-maxSpeedX)
				newSpeedX=-maxSpeedX;
		}

		this.setState({
			x:newX,
			speedX:newSpeedX,
		});
	};
	moveUp=()=>
	{
		if(this.state.onGround!==true)
			return;

		let newY=this.state.y;
		let newSpeedY=this.state.speedY;
		let maxSpeedY=this.state.maxSpeedY;
		let newOnGround=this.state.onGround;
		let newStarted=this.state.started;

		newSpeedY+=this.state.speedUpRateY;
		newY+=newSpeedY;
		newOnGround=false;
		if(newStarted===false)
		{
			newStarted=true;
			this.props.start();
		}


		if(newSpeedY>maxSpeedY)
			newSpeedY=maxSpeedY;
		if(newSpeedY<-maxSpeedY)
			newSpeedY=-maxSpeedY;

		this.setState({
			y:newY,
			speedY:newSpeedY,
			onGround:newOnGround,
			started: newStarted,
		});
	};
	moveDown=()=>
	{
		let newY=this.state.y;
		let newSpeedY=this.state.speedY;
		let maxSpeedY=this.state.maxSpeedY;
		let newOnGround=this.state.onGround;

		if(newOnGround===true)
			newOnGround=false;
		else
			return;

		newSpeedY-=this.state.slowRateY;

		newY+=newSpeedY;

		if(newSpeedY>maxSpeedY)
			newSpeedY=maxSpeedY;
		if(newSpeedY<-maxSpeedY)
			newSpeedY=-maxSpeedY;

		this.setState({
			y:newY,
			speedY:newSpeedY,
			onGround:newOnGround,
		});
	};
	slowY=()=>
	{
		let newY=this.state.y;
		let newSpeedY=this.state.speedY;
		let maxSpeedY=this.state.maxSpeedY;

		newY+=newSpeedY;
		if(this.state.onGround!==true)
			newSpeedY-=this.state.slowRateY;

		if(newSpeedY>maxSpeedY)
			newSpeedY=maxSpeedY;
		if(newSpeedY<-maxSpeedY)
			newSpeedY=-maxSpeedY;

		this.setState({
			y:newY,
			speedY:newSpeedY,
		});
	};
	stopY=(y)=>
	{
		this.setState({
			speedY:0,
			y:y,
			onGround:true,
		});
	};
	stopX=(x)=>
	{
		this.setState({
			x:x,
			speedX:0,
		});
	};
	handleKeyDown = (event) =>
	{
		let keys=this.state.keys;
		keys[event.key]=true;
			this.setState({
				keys:keys,
			});
	};
	handleKeyUp = (event) =>
	{
		let keys=this.state.keys;
		keys[event.key]=false;
			this.setState({
				keys:keys,
			});
	};
	calcPhysics =() =>
	{
		let keys=this.state.keys;
		this.props.collisions(this);

		if(this.state.y<-50)
		{
			this.props.over();
			clearInterval(this.state.intervalId);
		}

		if(keys.w===true)
			this.moveUp();
		else if(keys.s===true)
			this.moveDown();

		if(keys.a===true)
			this.moveLeft();
		else if(keys.d===true)
			this.moveRight();
		else if(keys.a!==true && keys.d!==true)
			this.slowX();

		this.slowY();

		if(this.state.x<minW)
			this.setState({x:minW,speedX:0});
		if(this.state.x>screenW)
			this.setState({x:screenW,speedX:0});
	};
	componentDidMount()
	{
		document.addEventListener('keyup', this.handleKeyUp, false);
		document.addEventListener('keydown', this.handleKeyDown, false);
		let intervalId=setInterval(this.calcPhysics,1000/maxFPS);
		this.setState({
			intervalId:intervalId,
		});
	}
	componentWillUnmount()
	{
		document.removeEventListener("keyup", this.handleKeyUp, false);
		document.removeEventListener("keydown", this.handleKeyDown, false);
	}
	render()
	{
		if(this.el===undefined)
		{
			let renderEl=new element("character");
			this.el=renderEl;
		}
		let style={
			bottom:this.state.y,
			left:this.state.x,
		};
		return this.el.render(style);
	}
}

class Background extends React.Component
{
	constructor(props)
	{
		super(props);
	}
	componentDidMount()
	{
		this.el=new element("background");

	}
	render()
	{
		if(this.el===undefined)
		{
			let renderEl=new element("background");
			this.el=renderEl;
		}
		return this.el.render();
	}
}

class World extends React.Component
{
	constructor(props)
	{
		let startPlatform={
			x:0,
			y:0,
			h:128,
			w:screenW+50,
		};
		let platforms=[startPlatform];
		for(let i=0;i<4;i++)
		{
			let x=Math.round(Math.random()*900);
			let y=128*(i+1)+128;
			let h=50;
			let w=Math.round(Math.random()*500)+300;
			let platf={x,y,h,w};
			platforms.push(platf);
		}
		super(props);
		this.state={
			platforms:platforms,
			num:0,
			step:3,
			over: false,
			started: false,
			level:0,
			text: "Uruchom w trybie tekstowym",
			letter:0,
		};
	}
	gameOver=()=>
	{
		clearInterval(this.state.intervalId);
		this.setState({
			over: true,
		});
		console.log(this.state.level);
	};
	start=()=>
	{
		this.setState({
			started:true,
		});
	}
	startGame=()=>
	{
		let intervalId2=setInterval(this.movePlatforms,1000/maxFPS);
		this.setState({
			intervalId:intervalId2,
		});
	};
	genPlatform=()=>
	{
		let x=Math.round(Math.random()*800);
		let y=800;
		let h=50;
		let w=Math.round(Math.random()*300)+300;
		let platf={x,y,h,w};
		return platf;
	};
	recalcPlatforms=()=>
	{
		let level=this.state.level;
		let newPlatf=this.state.platforms.map( el => el.y<0 ? this.genPlatform() : el);
		for(let i=0;i<newPlatf.length;i++)
			if(newPlatf[i].y!==this.state.platforms[i].y)
				level++;
		this.setState({
			platforms:newPlatf,
			level:level,
		});
	};
	movePlatforms=()=>
	{
		let plats=this.state.platforms;
		let newStep=this.state.step;
		let newNum=this.state.num+1;
		let hasRecalc=false;

		for(let i=0;i<plats.length;i++)
		{
			plats[i].y=plats[i].y-newStep;
			if(plats[i].y<0)
				hasRecalc=true;
		}

		if(newNum>200)
		{
			newStep++;
			newStep=newStep>13 ? 13 : newStep;
			newNum=0;
		}

		this.setState({
			platforms:plats,
			num:newNum,
			step:newStep,
		});
		if(hasRecalc===true)
			this.recalcPlatforms();
	};
	changeMode=()=>
	{
		textMode=!textMode;
		if(textMode)
			this.setState({text: "Uruchom w trybie tekstowym"});
		else
			this.setState({text: "Uruchom w trybie graficznym"});
	};
	componentDidMount()
	{
		let interv=setInterval( ()=> this.setState({letter:(this.state.letter+1)%60}),1000);
	}
	checkCollisions=(char)=>
	{
		this.state.platforms.forEach( (el,i) => {
			if(char.state.x>el.x && char.state.x<el.x+el.w)
				if(char.state.y>el.y+el.h && char.newY<=el.y+el.h)
						{
							char.stopY(el.y+el.h);
							char.setState({
								minX:el.x,
								maxX:Math.min(el.x+el.w,screenW),
								plat:i,
							});
						}
		});
		let plat=this.state.platforms[char.state.plat];
		if(char.state.y>=plat.y+plat.h && char.state.onGround===true)
			char.setState({y:plat.y+plat.h});
		else if(char.state.y<plat.y+plat.h)
			char.setState({onGround:false});
		if(char.state.x+char.state.w/2<char.state.minX)
			char.setState({onGround:false});
		if(char.state.x+char.state.w/2>char.state.maxX && char.state.maxX!==screenW)
			char.setState({onGround:false});
	};
	refresh()
	{
		window.location.href="";
	}
	render()
	{
		if(this.wallL===undefined)
		{
			let wallL=new element("wLeft");
			this.wallL=wallL;
		}
		if(this.wallR===undefined)
		{
			let wallR=new element("wRight");
			this.wallR=wallR;
		}
		if(this.state.started===false)
			return 	<div className="title">
								<div className="anim">
									{<pre style={{color:this.state.letter%2===0 ? "red" : "blue", fontSize:"10px"}}>{tower}</pre>}
									{<pre style={{color:this.state.letter%2===1 ? "red" : "blue", fontSize:"10px"}}>{jumper}</pre>}
								</div>
								<p>Celem gry jest wskoczenie jak najwyżej po platformach. Miłej zabawy!</p>
								<div className="controls">
									<h2>Sterowanie:</h2>
									<p>W-skok</p>
									<p>A-ruch w lewo</p>
									<p>S-ruch w dół</p>
									<p>D-ruch w prawo</p>
								</div>
								<input type="button" value="Start!" onClick={this.start}/>
								<input type="button" value={this.state.text} onClick={this.changeMode}/>
								{<pre>{animation[this.state.letter%6]}</pre>}
							</div>
		if(this.state.over===false)
		return  <div>
							<Background/>
							<div>
								{this.state.platforms.map( el => new element("platform")
																	.render({	width:el.w,
																				height:el.h,
																				left:el.x,
																				bottom:el.y,}))}
							</div>
							<div>
								{this.wallL.render()}
								{this.wallR.render()}
							</div>
							<Character 	collisions={this.checkCollisions}
													move={this.movePlatforms}
													start={this.startGame}
													over={this.gameOver}/>
						</div>
		else
			return 	<div className="endScreen">
								<h1>Przegrywasz!</h1>
								<p>Osiągnięty poziom: {this.state.level}</p>
								<input type="button" value="Od nowa!" onClick={this.refresh}/>
							</div>;
	}
}

document.addEventListener('DOMContentLoaded', function() {
	ReactDOM.render(<World/>,document.getElementById('app'));
});
