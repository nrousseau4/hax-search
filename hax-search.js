import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./hax-card.js";

export class haxSearch extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "hax-search";
  }

  constructor() {
    super();
    this.title = '';
    this.value = '';
    this.loading = false;
    this.items = [];
    this.jsonURL = '';
  }

  static get properties() {
    return {
      title: { type: String },
      loading: { type: Boolean, reflect: true },
      items: { type: Array },
      value: { type: String },
      jsonURL: { type: String, attribute: 'json-url' },
    };
  }

  static get styles() {
    return css`

      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-primary);
      }

      .wrapper {
        display: flex;
        justify-content: center; /* Centers horizontally */
        height: 100%;
      }

      input {
        font-size: 20px;
        line-height: var(--ddd-spacing-10);
        width: 50%;
        padding: 10px;
      }
    `;
  }

  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value;
  }
  // life cycle will run when anything defined in `properties` is modified
  updated(changedProperties) {
    // see if value changes from user input and is not empty
    if (changedProperties.has('value') && this.value) {
      this.updateResults(this.value);
    }
    else if (changedProperties.has('value') && !this.value) {
      this.items = [];
    }
    // @debugging purposes only
    if (changedProperties.has('items') && this.items.length > 0) {
      console.log(this.items);
    }
  }

  ensureJsonExtension(value) {
    if (!value.endsWith('.json')) {
        value += '.json';
    }
    return value;
}

  updateResults(value) {
    ensureJsonExtension(value);
    this.loading = true;
      fetch(`${this.jsonURL}`).then(d => d.ok ? d.json(): {}).then(data => {
        if (data.collection) {
          this.items = [];
          this.items = data.collection.items;
          this.loading = false;
        }
    });
  }

  render() {
    return html`
      <div class="wrapper">
        <button>Analyze</button>
        <input placeholder="Search HAX sites" @input="${this.inputChanged}"/>
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  static get tag() {
    return "hax-search";
  }
}

globalThis.customElements.define(haxSearch.tag, haxSearch);