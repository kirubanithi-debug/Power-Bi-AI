"use strict";

import powerbi from "powerbi-visuals-api";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

export class Visual implements IVisual {
    private target: HTMLElement;
    private iframe: HTMLIFrameElement;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.target.style.overflow = "hidden";
        this.target.style.width = "100%";
        this.target.style.height = "100%";

        // Create embedded iframe pointing to AI Assistant
        this.iframe = document.createElement("iframe");
        this.iframe.style.width = "100%";
        this.iframe.style.height = "100%";
        this.iframe.style.border = "none";
        
        // Point iframe to running AI Assistant app
        this.iframe.src = "http://localhost:5173/ai-assistant";

        this.target.appendChild(this.iframe);
    }

    public update(options: VisualUpdateOptions) {
        // Adjust container dimensions on Power BI report resize
        if (this.target && options) {
            this.target.style.width = `${options.viewport.width}px`;
            this.target.style.height = `${options.viewport.height}px`;
        }
    }
}