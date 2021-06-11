import { Component, OnInit,  HostListener } from '@angular/core';
import { FirbaseAuthService } from "../../services/firebase/firbase-auth.service";
import { FirestoreService } from '../../services/firebase/firestore.service';
import $ from 'jquery';
import { fabric } from "fabric";
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashbordComponent implements OnInit {
  user:any;
  canvasData:any;
  canvasLoaded: boolean = false;
  shareWithEmail: string;
  modalRef:any;
  sharedCanvases:any=[];
  viewingSharedCanvasId:string;
  canvasWrapper:any;

  constructor(public authService: FirbaseAuthService, private modalService: NgbModal, public firestoreService: FirestoreService) { }

  async ngOnInit() {
    this.user = JSON.parse(await localStorage.getItem('user'));
	this.firestoreService.getSharedCanvas(this.user.email).subscribe((res)=>{
		if(res && res.length)
			this.sharedCanvases = res;
	});
  	this.getCanvas(this.user.uid)
  }

  getCanvas(userId) {
  	this.firestoreService.getCanvas(userId).subscribe((data) => {
		this.canvasData = data;
		if(this.canvasLoaded) return;
		if(data && data.canvas){
			const canvas = JSON.stringify(JSON.parse(data.canvas));
			this.loadCanvas(canvas)
		}else{
			this.loadCanvas()
		}
		this.canvasLoaded = true;
  	})
  }

  onResize(event) {
	this.resizeCanvas()
	    // const outerCanvasContainer = $('.fabric-canvas-wrapper')[0];
	    // const ratio = this.canvasWrapper.getWidth() / this.canvasWrapper.getHeight();
	    // const containerWidth   = outerCanvasContainer.clientWidth;
	    // const containerHeight  = outerCanvasContainer.clientHeight;
	    // console.log(containerWidth)
	    // console.log(containerHeight)
	    // this.canvasWrapper.getWidth({width: containerWidth, height: containerWidth / ratio});

	// $(window).resize(resizeCanvas);
  }
 
  public loadCanvas(_canvas?:any){
	this.canvasWrapper = new fabric.Canvas('fabric-canvas');
		this.canvasWrapper.setHeight(700);
		this.canvasWrapper.setWidth(1400);
	var drawingColorEl = document.getElementById('drawing-color'),
	      drawingLineWidthEl = document.getElementById('drawing-line-width'),
	      drawingShadowWidth = document.getElementById('drawing-shadow-width');
	      this.canvasWrapper.isDrawingMode = true;


	  

	setTimeout(()=>{
		this.canvasWrapper.isDrawingMode = true;
		this.canvasWrapper.freeDrawingBrush.color = '#000000';
		this.canvasWrapper.freeDrawingBrush.shadowBlur = 0;
		if(_canvas)
		this.canvasWrapper.loadFromJSON(_canvas, this.canvasWrapper.renderAll.bind(this.canvasWrapper), (o, object) => {
				fabric.log(o, object);
			})

		this.canvasWrapper.on('object:added', () => {
			this.firestoreService.storeCanvas(this.user.uid, (JSON.stringify(this.canvasWrapper)), this.user.email);
		});
		
	})

	if (fabric.PatternBrush) {
	    var vLinePatternBrush = new fabric.PatternBrush(this.canvasWrapper);

	    vLinePatternBrush.getPatternSrc = function() {
	      var patternCanvas = fabric.document.createElement('canvas');
	      patternCanvas.width = patternCanvas.height = 10;
	      var ctx = patternCanvas.getContext('2d');
	      ctx.strokeStyle = this.color;
	      ctx.lineWidth = 5;
	      ctx.beginPath();
	      ctx.moveTo(0, 5);
	      ctx.lineTo(10, 5);
	      ctx.closePath();
	      ctx.stroke();
	      return patternCanvas;
	    };

	    var hLinePatternBrush = new fabric.PatternBrush(this.canvasWrapper);
	    hLinePatternBrush.getPatternSrc = function() {
	      var patternCanvas = fabric.document.createElement('canvas');
	      patternCanvas.width = patternCanvas.height = 10;
	      var ctx = patternCanvas.getContext('2d');
	      ctx.strokeStyle = this.color;
	      ctx.lineWidth = 5;
	      ctx.beginPath();
	      ctx.moveTo(5, 0);
	      ctx.lineTo(5, 10);
	      ctx.closePath();
	      ctx.stroke();

	      return patternCanvas;
	    };

	    var squarePatternBrush = new fabric.PatternBrush(this.canvasWrapper);
	    squarePatternBrush.getPatternSrc = function() {
	      var squareWidth = 10, squareDistance = 2;
	      var patternCanvas = fabric.document.createElement('canvas');
	      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
	      var ctx = patternCanvas.getContext('2d');
	      ctx.fillStyle = this.color;
	      ctx.fillRect(0, 0, squareWidth, squareWidth);
	      return patternCanvas;
	    };

	    var diamondPatternBrush = new fabric.PatternBrush(this.canvasWrapper);
	    diamondPatternBrush.getPatternSrc = function() {
	      var squareWidth = 10, squareDistance = 5;
	      var patternCanvas = fabric.document.createElement('canvas');
	      var rect = new fabric.Rect({
	        width: squareWidth,
	        height: squareWidth,
	        angle: 45,
	        fill: this.color
	      });
	      var canvasWidth = rect.getBoundingRectWidth();
	      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
	      rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });
	      var ctx = patternCanvas.getContext('2d');
	      rect.render(ctx);
	      return patternCanvas;
	    };
	}

	/* Custom Image Upload In Canvas */	
	document.getElementById('imgLoader').onchange = (event) => {
			const target= event.target as HTMLInputElement;
			const file: File = (target.files as FileList)[0];
		
			var reader = new FileReader();
			reader.onload = (event) => { 				    
				var img = new Image();
				img.src  =  event.target.result.toString();

				img.onload = () =>{
					var image = new fabric.Image(img);
					image.set({
						left: 0,
						top: 0,
						angle: 0,
						padding: 0,
						cornersize: 10,
						centeredRotation: true,
                        centeredScaling: true,                        
                        scaleToWidth:100,
                        scaleX : 1,
                        scaleY : 1
					});
					this.canvasWrapper.add(image);
					this.canvasWrapper.isDrawingMode = false;
				}
			}
			reader.readAsDataURL(file);
	}

	var img = new Image();
	var texturePatternBrush = new fabric.PatternBrush(this.canvasWrapper);
	texturePatternBrush.source = img;
	/* Select Drawing Option */
	document.getElementById('drawing-mode-selector').addEventListener('change', () => {
		var selectedCountry = $(this).children("option:selected").val();

		if (selectedCountry === 'hline') {
			this.canvasWrapper.freeDrawingBrush = vLinePatternBrush;
		}
		else if (selectedCountry === 'vline') {
			this.canvasWrapper.freeDrawingBrush = hLinePatternBrush;
		}
		else if (selectedCountry === 'square') {
			this.canvasWrapper.freeDrawingBrush = squarePatternBrush;
		}
		else if (selectedCountry === 'diamond') {
			this.canvasWrapper.freeDrawingBrush = diamondPatternBrush;
		}
		else if (selectedCountry === 'texture') {
			this.canvasWrapper.freeDrawingBrush = texturePatternBrush;
		}
		else {
			this.canvasWrapper.freeDrawingBrush = new fabric[selectedCountry + 'Brush'](this.canvasWrapper);
		}

		if (this.canvasWrapper.freeDrawingBrush) {
			this.canvasWrapper.freeDrawingBrush.color = (<HTMLInputElement>document.getElementById('drawing-color')).value;;
			this.canvasWrapper.freeDrawingBrush.width = parseInt( (<HTMLInputElement>document.getElementById('drawing-line-width')).value, 10) || 1;
			this.canvasWrapper.freeDrawingBrush.shadowBlur = parseInt((<HTMLInputElement>document.getElementById('drawing-shadow-width')).value, 10) || 0;
		}
	});


	drawingColorEl.onchange = () => {
		this.canvasWrapper.freeDrawingBrush.color = (<HTMLInputElement>document.getElementById('drawing-color')).value;
	};

	drawingLineWidthEl.onchange = () => {
		this.canvasWrapper.freeDrawingBrush.width = parseInt( (<HTMLInputElement>document.getElementById('drawing-line-width')).value, 10) || 1;
	};

	drawingShadowWidth.onchange = () => {
		this.canvasWrapper.freeDrawingBrush.shadowBlur =  parseInt((<HTMLInputElement>document.getElementById('drawing-shadow-width')).value, 10) || 0;
	};

	if (this.canvasWrapper.freeDrawingBrush) {
		this.canvasWrapper.freeDrawingBrush.color = <HTMLInputElement>document.getElementById('drawing-color')
		this.canvasWrapper.freeDrawingBrush.width = parseInt((<HTMLInputElement>document.getElementById('drawing-line-width')).value, 10) || 1;
		this.canvasWrapper.freeDrawingBrush.shadowBlur = 0;
	}
  }
  
  openShareWithModal(shareModal) {
	this.modalRef = this.modalService.open(shareModal)
  }

  async shareCanvas() {
	try {
		await this.firestoreService.shareCanvas(this.user.uid, this.shareWithEmail)
		this.modalRef.close();
	} catch(err) {
		console.log(err);
	}
  }

  renderSharedCanvas(userId) {
	this.canvasLoaded = false;
	this.canvasWrapper.clear()
	this.viewingSharedCanvasId = userId;
	this.canvasWrapper.isDrawingMode = false;
	this.getCanvas(userId)
  }

  showMyCanvas(){
	this.canvasWrapper.clear()
	this.viewingSharedCanvasId = null;
	this.canvasWrapper.isDrawingMode = true;
	this.canvasLoaded = false;
	this.getCanvas(this.user.uid)
  }

  resizeCanvas() {
	    const outerCanvasContainer = $('.fabric-canvas-wrapper')[0];
	    
	    const ratio = this.canvasWrapper.getWidth() / this.canvasWrapper.getHeight();
	    const containerWidth   = outerCanvasContainer.clientWidth;
	    const containerHeight  = outerCanvasContainer.clientHeight;

	    const scale = containerWidth / this.canvasWrapper.getWidth();
	    const zoom  = this.canvasWrapper.getZoom() * scale;
	    this.canvasWrapper.setDimensions({width: containerWidth, height: containerWidth / ratio});
	    this.canvasWrapper.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
	}

	// $(window).resize(resizeCanvas);
}
