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
    this.value = '';
    this.title = '';
    this.loading = false;
    this.items = [];
    this.jsonURL = "https://haxtheweb.org/site.json"
    this.link = '';
  }

  static get properties() {
    return {
      title: { type: String },
      loading: { type: Boolean, reflect: true },
      items: { type: Array },
      value: { type: String },
      jsonURL: { type: String, attribute: 'json-url' },
      link: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: var(--ddd-font-primary)
      }
      :host([loading]) .results {
        opacity: 0.1;
        visibility: hidden;
        height: 1px;
      }

      .search {
        display: flex;
        justify-content: center;
        height: 60px;
      }

      .results {
        visibility: visible;
        height: 600px;
        opacity: 1;
        transition-delay: .5s;
        transition: .5s all ease-in-out;
      }

      input {
        font-size: 20px;
        line-height: var(--ddd-spacing-10);
        width: 700px;
      }

      a {
        text-decoration: none;
        color: var(--ddd-theme-default-link);
      }
      a:visited {
        text-decoration: none;
        color: var(--ddd-theme-default-link);
      }

      button {
        margin: 0px 0px 0px 8px;
      }
    `;
  }

  analyze(e) {
    this.jsonURL = this.shadowRoot.querySelector('#input').value;
    this.validateInput(this.jsonURL);
  }

  updated(changedProperties) {
    if (changedProperties.has('jsonURL')) {
      this.updateResults(this.jsonURL);
    }
    else if (changedProperties.has('jsonURL') && !this.jsonURL) {
      this.items = [];
    }

    if (changedProperties.has('items') && this.items.length > 0) {
      console.log(this.items);
    }
  }

  validateInput(jsonURL) {
    if (!jsonURL.endsWith('.json')) {
        jsonURL += '.json';
    }
    else if (!jsonURL.startsWith('https://')) {
        jsonURL = `https:// + ${jsonURL}`;
    }
    return jsonURL;
  }

  noJsonEnding(url) {
    return url.replace(/\/?[^\/]*\/json$/, '');
  }

  updateResults(jsonURL) {
    this.loading = true;
    this.baseURL = this.noJsonEnding(this.jsonURL);
    fetch(`${jsonURL}`).then(d => d.ok ? d.json(): {}).then(data => {
      if (data.collection) {
        this.items = [];
        this.items = data.items;
        this.loading = false;
      }  
    })
  }

  render() {
    return html`
      <h2>${this.title}</h2>
      <div class="search">
        <input id="input" placeholder="Search HAX sites">
        <button @click="${this.analyze}">Analyze</button>
      </div>
      <div class="results">
        ${this.items.map((item) => {
          const img = item.metadata && item.metdata.files && item.metadata.files[0] ? item.metadata.files[0].url : '';
          
          return html`
            <hax-card
              title="${item.title}"
              desc="${item.description}"
              logo="${img}"
              slug="${item.slug}"
              link="${this.link}"
            ></hax-card>
          `;
        })}
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