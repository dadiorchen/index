import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


function polar2cartesian(radius,angle){
	return {
		x : radius * Math.cos(angle * Math.PI / 180),
		y : radius * Math.sin(angle * Math.PI / 180),
	}
}



class App extends Component {
	constructor(props){
		super(props);
		let solar = {
				x : 0,
				y : 0,
				r : 20,
				planets : [
					{
						r : 100,
						planetRadio : 5,
						duration : Math.random() * (50 - 15) + 15,
						repeatCount : 'indefinite',
						begin : 0,
					},
					{
						r : 200,
						planetRadio : 5,
						duration : Math.random() * (50 - 15) + 15,
						repeatCount : 'indefinite',
						begin : 0,
					},
					{
						r : 300,
						planetRadio : 5,
						duration : Math.random() * (50 - 15) + 15,
						repeatCount : 'indefinite',
						begin : 0,
					},
					{
						r : 400,
						planetRadio : 5,
						duration : Math.random() * (50 - 15) + 15,
						repeatCount : 'indefinite',
						begin : 0,
					},
					{
						r : 500,
						planetRadio : 5,
						duration : Math.random() * (50 - 15) + 15,
						repeatCount : 'indefinite',
						begin : 0,
					},
					{
						r : 600,
						planetRadio : 5,
						duration : Math.random() * (50 - 15) + 15,
						repeatCount : 'indefinite',
						begin : 0,
					},
					{
						r : 700,
						ratio : 0.1,
						rotate : 17,
						planetRadio : 5,
						duration : Math.random() * (50 - 15) + 15,
						repeatCount : 'indefinite',
						begin : 0,
					},
				],
				ellipseRatio : 0.3,
				getC : function(a,b){
					return Math.sqrt(a*a - b*b);
				},
			}
		//black point
		solar.blackPoints = [];
		for(let i = 0 ; i < 400 ; i++){
			const angle = Math.random()*(360);
			const r = Math.random()*(solar.r);
			const pointR = Math.random()*(solar.r/100);
			const xy = polar2cartesian(r,angle);
			solar.blackPoints.push({
				x:xy.x,
				y:xy.y,
				r:pointR,
			});
		}

		this.state = {
			big : false,
			logo : {
				x : 50,
				y : 17,
				shaking : false,
			},
			title : {
				x : 100,
				y : 43,
			},
			coordinationConvert:{
				x : 1350,
				y : 600,
				rotate : 7,
			},
			solar,
		}

	}

	toggleTransform = ()=> {
		let {big,logo,title,solar,coordinationConvert} = this.state;
		big = !big;
		if(big){
			logo.x = 1440/2;
			logo.shaking = true;
			title.x = 50;
			//calculate the solar radio
			const solarShowPartHeight = 150;
			const solarShowPartWidth = 600;
			const r = (solarShowPartHeight*solarShowPartHeight + solarShowPartWidth*solarShowPartWidth) / (2*solarShowPartHeight);
			coordinationConvert.x = 1440/2;
			coordinationConvert.y = r - solarShowPartHeight + 720;
			coordinationConvert.rotate = 0;
			solar.scale = r/solar.r;
			//calculate the ellipse orbit
			
			solar.ellipseRatio = solar.ellipseRatio*2;
			let i = 0;
			const h = 655 -  solarShowPartHeight 
			const radios = [h/2,h/2+h/4,h/2+h/4+h/8,h/2+h/4+h/8+h/16,h/2+h/4/+h/8+h/16,h/2+h/4+h/8+h/16+h/32,h/2+h/4+h/8+h/16+h/32+h/64];
			const planetRadios = [100,50,25,13,6,3,2];
			solar.planets.map(p => {
				let b = r + radios[i];
				p.planetRadio = planetRadios[i];
				i++;
				let a = b / solar.ellipseRatio;
				p.r = a;
				p.duration = Math.random() * (10-5) + 5;
				p.repeatCount = 'indefinite';
				//p.begin = 0;
			});
			solar.getC = function(a,b){
				return 0;
			}
		}else{
			logo.x = 50;
			logo.shaking = false;
			title.x = 100;
			coordinationConvert = {
				x : 1350,
				y : 600,
				rotate : 7,
			}
			solar.scale = 0;
			//calculate the ellipse orbit
			
			solar.ellipseRatio = solar.ellipseRatio/2;
			let i = 0;
			const radios = [100,200,300,400,500,600,700];
			solar.planets.map(p => {
				p.planetRadio = 5;
				i++;
				p.r = radios[i];
				p.duration = Math.random() * (50 - 15) + 15;
				p.repeatCount = 'indefinite';
				//p.begin = 0;
				if(i == 6){
					p.ratio = 0.1;
					p.rotate = 17;
				}
			});
			solar.getC = function(a,b){
					return Math.sqrt(a*a - b*b);
			}
		}
		this.setState({logo,title,big,solar,coordinationConvert});
	}

	draw = () => {
		const {solar,coordinationConvert} = this.state;
		return (
			<g transform={`translate(${coordinationConvert.x} ${coordinationConvert.y}) rotate(${coordinationConvert.rotate}) `} 
				style={{
					'transition' : 'all 2.5s ease',
				}}
			>
				{/*
				<line stroke='pink' x1={this.x} y1={this.y} x2={this.x + 10000} y2={this.y} />
				<line stroke='pink' x1={this.x} y1={this.y} x2={this.x - 10000} y2={this.y} />
				*/}
				{solar.planets.map(p => {
					let {ratio,rotate,begin,planetRadio,duration,repeatCount} = p;
					let a = p.r;
					if(!ratio){
						ratio = solar.ellipseRatio;
					}
					let b = a * ratio;

					if(rotate){
						return (
							<g transform={(rotate ? `rotate(${rotate})` : '')+ `translate(${solar.getC(a,b) * (-1)} 0 )`   } >
								<ellipse cx={solar.x} cy={solar.y} rx={a} ry={b} fill='transparent' stroke='#283B56' />
							</g>
						)
					}else{
						return (
							<g transform={`translate(${solar.getC(a,b) * (-1)} 0 )`   } >
								<ellipse cx={solar.x} cy={solar.y} rx={a} ry={b} fill='transparent' stroke='#283B56' />
								<path id={`e${a}`} stroke='transparent' fill='transparent' d={`M 0,0 a ${a},${b} 0 1,0 1,0`} />
								{/* the planet */}
								<circle cx={0} cy={b*(-1)} r={planetRadio} fill='#424750'>
									<animateMotion 
										dur={`${duration}s`}
										begin={`${begin}s`}
										repeatCount={repeatCount}
									>
										<mpath xlinkHref={`#e${a}`} />
									</animateMotion>
								</circle>
							</g>
						)
					}
								  })};
					<g
						id='solarGroup'
						ref={r => this.solarRef = r}
						transform={solar.scale? `scale(${solar.scale})`:'' }
						style={{
							'transition' : 'all 2.5s ease ',
						}}
					>
						<circle  
							cx={solar.x} 
							cy={solar.y } 
							r={solar.r} 
							fill='#96454E' 
							style={{
								'transition' : 'all 2.5s ease ',
							}}
							onMouseEnter={this.toggleTransform}
						>
						</circle>
						<g>
						{solar.blackPoints && solar.blackPoints.map(p => 
						<circle cx={p.x} cy={p.y } r={p.r} fill='#550902'
							style={{
								'transition' : 'all 2.5s ease ',
							}}
						/>
													)}
						
							<animateTransform
								attributeName="transform"
								begin="2s"
								dur="20s"
								type="rotate"
								from="360"
								to="0"
								repeatCount="indefinite" 
								/>
						</g>
						
					</g>

			</g>
		)
	}
  render() {
	  const {logo,title} = this.state;
    return (
      <div className="App">
	  	<svg width="1440" height="720" viewBox='0,0,1440,720' >
		<rect x='0' y='0' width="100%" height="100%" fill="#01050F" />
		<rect x='0' y='0' width='100%' height='60' fill='#23262B' />
		<rect x='0' y='60' width='100%' height='5' fill='#181A1E' />
			<g transform={`translate (${logo.x} ${logo.y})`}
				style={{
					'transition' : 'all 2.5s ease',
				}}
			>
				<image xlinkHref={require('./logo.svg')} width='35' >
				<animateTransform
					attributeName='transform'
					type='rotate'
					begin='0'
					from='0'
					to='0'
					values='-2;2;-2;2;-2'
					keyTimes='0;0.25;0.50;0.75;1'
					dur={logo.shaking ? '0.5s':'0' }
					fill='freeze'
					repeatCount='indefinite'
				/>
				</image>
			</g>
			<g transform={`translate (${title.x} ${title.y})`}
				style={{
					'transition' : 'all 2.5s ease',
				}}
			>
				<text fontSize='30' 
					fill='#D4EBF9' 
					onClick={this.transform}
				>CAPTAIN LOG</text>
			</g>
			{/* draw solar */}
			{this.draw()}
		</svg>
		<div>
			test
			axe
		</div>
      </div>
    );
  }
}

export default App;
