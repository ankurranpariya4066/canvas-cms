import { Component, OnInit } from '@angular/core';
import { FirbaseAuthService } from "../../services/firebase/firbase-auth.service";
import $ from 'jquery';
import { fabric } from "fabric";
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashbordComponent implements OnInit {
  closeResult: string;

  constructor(public authService: FirbaseAuthService, private modalService: NgbModal) { }

  ngOnInit(): void {
  	this.canvasLaod()
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
 

  canvasLaod(){
	var canvas = new fabric.Canvas('c');
	var drawingColorEl = document.getElementById('drawing-color'),
	      drawingLineWidthEl = document.getElementById('drawing-line-width'),
	      drawingShadowWidth = document.getElementById('drawing-shadow-width');
	  canvas.isDrawingMode = true;

	  if (fabric.PatternBrush) {
	    var vLinePatternBrush = new fabric.PatternBrush(canvas);
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

	    var hLinePatternBrush = new fabric.PatternBrush(canvas);
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

	    var squarePatternBrush = new fabric.PatternBrush(canvas);

	    squarePatternBrush.getPatternSrc = function() {

	      var squareWidth = 10, squareDistance = 2;

	      var patternCanvas = fabric.document.createElement('canvas');
	      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
	      var ctx = patternCanvas.getContext('2d');

	      ctx.fillStyle = this.color;
	      ctx.fillRect(0, 0, squareWidth, squareWidth);

	      return patternCanvas;
	    };

	    var diamondPatternBrush = new fabric.PatternBrush(canvas);

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

		document.getElementById('imgLoader').onchange = function(event) {
			 const target= event.target as HTMLInputElement;
  			 const file: File = (target.files as FileList)[0];
			
				var reader = new FileReader();
			    reader.onload = function (event) { 
			    	console.log('fdsf');
					var img = new Image();
					img.src  =  event.target.result.toString();

					img.onload = function(){
						var image = new fabric.Image(img);
						image.set({
			                left: 250,
			                top: 250,
			                angle: 20,
			                padding: 10,
			                cornersize: 10
			            });
			            canvas.add(image);
			            canvas.isDrawingMode = false;
					}
				}
				reader.readAsDataURL(file);
				console.log(JSON.stringify(canvas));
		}  

	    var img = new Image();

	    var texturePatternBrush = new fabric.PatternBrush(canvas);
	    texturePatternBrush.source = img;


	  }

	    document.getElementById('drawing-mode-selector').addEventListener('change', function() {
	    	var selectedCountry = $(this).children("option:selected").val();

		    if (selectedCountry === 'hline') {
		      canvas.freeDrawingBrush = vLinePatternBrush;
		    }
		    else if (selectedCountry === 'vline') {
		      canvas.freeDrawingBrush = hLinePatternBrush;
		    }
		    else if (selectedCountry === 'square') {
		      canvas.freeDrawingBrush = squarePatternBrush;
		    }
		    else if (selectedCountry === 'diamond') {
		      canvas.freeDrawingBrush = diamondPatternBrush;
		    }
		    else if (selectedCountry === 'texture') {
		      canvas.freeDrawingBrush = texturePatternBrush;
		    }
		    else {
		      canvas.freeDrawingBrush = new fabric[selectedCountry + 'Brush'](canvas);
		    }

		    if (canvas.freeDrawingBrush) {
		      canvas.freeDrawingBrush.color = (<HTMLInputElement>document.getElementById('drawing-color')).value;;
		      canvas.freeDrawingBrush.width = parseInt( (<HTMLInputElement>document.getElementById('drawing-line-width')).value, 10) || 1;
		      canvas.freeDrawingBrush.shadowBlur = parseInt((<HTMLInputElement>document.getElementById('drawing-shadow-width')).value, 10) || 0;
		    }
	    });

		drawingColorEl.onchange = function() {
		   canvas.freeDrawingBrush.color = (<HTMLInputElement>document.getElementById('drawing-color')).value;
		   console.log(JSON.stringify(canvas));

		};

		drawingLineWidthEl.onchange = function() {
		   canvas.freeDrawingBrush.width = parseInt( (<HTMLInputElement>document.getElementById('drawing-line-width')).value, 10) || 1;
		   console.log(JSON.stringify(canvas));

		};

		drawingShadowWidth.onchange = function() {
		   canvas.freeDrawingBrush.shadowBlur =  parseInt((<HTMLInputElement>document.getElementById('drawing-shadow-width')).value, 10) || 0;
		   console.log(JSON.stringify(canvas));

		};

		if (canvas.freeDrawingBrush) {
		    canvas.freeDrawingBrush.color = <HTMLInputElement>document.getElementById('drawing-color')
		    canvas.freeDrawingBrush.width = parseInt((<HTMLInputElement>document.getElementById('drawing-line-width')).value, 10) || 1;
		    canvas.freeDrawingBrush.shadowBlur = 0;
		    console.log(JSON.stringify(canvas));

	    }

		var el = document.getElementById('canvas-background-picker');
		if (el) {
			addEventListener('change', function() {
				var selectedBackground = $(this).children("canvas-background-picker").val();
			    canvas.backgroundColor = selectedBackground;
			    canvas.renderAll();
			});			
		}

  }
}
