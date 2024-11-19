import {ElementRef, Injectable, Renderer2} from "@angular/core";
import {Application} from 'pixi.js';
import { Text, Container, Assets, Sprite, AlphaFilter, BlurFilter } from "pixi.js"
import * as PIXI from 'pixi.js';
import randomColor from "./randomColor";
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";
import {randomIntFromRange} from "./randomInt";

@Injectable({
  providedIn: "root"
})
export class Loading {

  loadingApp: Application;

  loadingContainer: Container = new Container({});

  private loadingGraphics: PIXI.Graphics = new PIXI.Graphics();
  private loadingText: Text = new Text({
    text: "Loading",
    style: {
      fontSize: 30,
      fill: 16777215,
    },
  });

  private minLoadingPercent: number = 0;
  private maxLoadingPercent: number = 100;

  private loadingGraphics_x: number;
  private loadingGraphics_y: number;

  private loadingGraphics_height: number = 5;
  private loadingGraphicsPercent_width: number = 0;
  private maxLoadingGraphicsPercent_width: number = 500;

  private loadingText_x: number;
  private loadingText_y: number;

  private htmlContainer: ElementRef;

  constructor(
    private htmlElement: ElementRef,
    private renderer: Renderer2
  ) {
    this.htmlContainer = htmlElement
  }

  public async initLoading () {

    this.loadingApp = await new Application()

    await this.loadingApp.init({
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: 1,
      autoDensity: true,
      antialias: true,
      resizeTo: window
    })

    this.loadingApp.stage.addChild(this.loadingContainer);

    await this.drawBackground()

    this.htmlContainer.nativeElement.appendChild(this.loadingApp.canvas)

    this.loadingGraphics_x = this.loadingApp.canvas.width / 2 - 250;
    this.loadingGraphics_y = this.loadingApp.canvas.height / 2;

    this.loadingText_x = this.loadingApp.canvas.width / 2 - 100;
    this.loadingText_y = this.loadingApp.canvas.height - 200;
  }

  private async drawBackground () {
    let texture = await Assets.load("assets/golden-goblet.jpg");

    const bg = new Sprite({ texture });
    bg.position.x = 0;
    bg.position.y = 0;
    bg.width = this.loadingApp.screen.width
    bg.height = this.loadingApp.screen.height

    this.loadingContainer.addChild(bg)
  }

  public updateItemsStatus() {

    if (this.loadingGraphicsPercent_width < this.maxLoadingGraphicsPercent_width) {
      this.loadingGraphicsPercent_width += 5;
    } else {
      this.loadingGraphicsPercent_width = this.maxLoadingGraphicsPercent_width;
    }

    if (this.minLoadingPercent < this.maxLoadingPercent) {
      this.minLoadingPercent = Math.floor(this.loadingGraphicsPercent_width / 5);
      this.loadingText.resolution = window.devicePixelRatio
      this.loadingText.text = `Loading ${this.minLoadingPercent} %`;
    }

    this.drawHeaderLoadingAndText();
  }

  private alphaFilter: number = 1;
  protected drawHeaderLoadingAndText () {

    let colors: string[] = ["#e1f738", "#f7f038", "#9ef738", "#41f738", "#41f738", "#38eef7", ]

    this.loadingGraphics.fill({ color: randomColor(colors),  alpha: 0.25 });
    this.loadingGraphics.roundRect(this.loadingGraphics_x, this.loadingGraphics_y, this.loadingGraphicsPercent_width, this.loadingGraphics_height, 10);
    this.loadingGraphics.fill();

    // Types error
    this.loadingGraphics.eventMode = 'dynamic';
    this.loadingText.x = this.loadingText_x;
    this.loadingText.y = this.loadingText_y;

    this.loadingText.eventMode = 'dynamic';

    this.loadingText.filters = new AlphaFilter({ alpha: this.alphaFilter });

    this.loadingContainer.addChild(this.loadingText);
    //this.loadingContainer.addChild(this.loadingGraphics);
  }

  public deleteLoadingView () {
    Array.from(this.htmlContainer.nativeElement.children).forEach(child => {
      this.renderer.removeChild(this.htmlContainer.nativeElement, child);
    });
  }

  public async appDestroy () {
    await Assets.unload("assets/golden-goblet.jpg")
    this.loadingApp.destroy(true, true)
  }
}


