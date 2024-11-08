import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./json-analyzer.js";

export class haxCard extends DDDSuper(I18NMixin(LitElement)) {
    


    static get tag() {
        return "hax-card";
      }
}