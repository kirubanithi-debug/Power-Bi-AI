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
        this.target.innerHTML = "";
        this.target.style.overflow = "hidden";
        this.target.style.width = "100%";
        this.target.style.height = "100%";
        this.target.style.display = "flex";
        this.target.style.flexDirection = "column";

        // Create embedded iframe pointing to AI Assistant
        this.iframe = document.createElement("iframe");
        this.iframe.style.width = "100%";
        this.iframe.style.height = "100%";
        this.iframe.style.border = "none";
        this.iframe.setAttribute("src", "http://localhost:5173/ai-assistant");
        this.iframe.setAttribute("allow", "cross-origin-isolated");

        this.target.appendChild(this.iframe);
    }

    public update(options: VisualUpdateOptions) {
        if (this.target && options && options.viewport) {
            this.target.style.width = `${options.viewport.width}px`;
            this.target.style.height = `${options.viewport.height}px`;
        }
    }
}