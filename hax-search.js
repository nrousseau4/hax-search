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
    this.value = null;
    this.loading = false;
    this.metadata = [];
  }

  static get properties() {
    return {
      loading: { type: Boolean, reflect: true },
      metadata: { type: Array, },
      value: { type: String },
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
      this.metadata = [];
    }
    // @debugging purposes only
    if (changedProperties.has('metadata') && this.meatadata.length > 0) {
      console.log(this.metadata);
    }
  }

  ensureJsonExtension(value) {
    if (!value.endsWith('.json')) {
        value += '.json';
    }
    return value;
}

  updateResults(value) {
    this.ensureJsonExtension(value);
    this.loading = true;
      fetch(`${value}`).then(d => d.ok ? d.json(): {}).then(data => {
        if (data.metadata) {
          this.metadata = [];
          this.metadata = data.metadata.site;
          this.loading = false;
        }
    });
  }

  render() {
    return html`
      <div class="search">
        <form>
          <input type="text" placeholder="Search HAX sites" @input="${this.inputChanged}"/>
          <button>Analyze</button>
        </form>
      </div>
      <div class="results">
        ${this.metadata.map((data, index) => html`
          <a href="${data.site[0].logo}" target="_blank">
            <hax-card
              source="${data.site[0].logo}"
              alt="${data.data[0].description}"
              title="${data.data[0].title}"
              desc="By: ${data.data[0].secondary_creator}"
            ></hax-card>
          </a>
        `)}
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