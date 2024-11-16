import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./hax-card.js";

export class HaxSearch extends DDDSuper(I18NMixin(LitElement)) {
  
  constructor() {
    super();
    this.loading = false;
    this.items = [];
    this.value = '';
    this.baseUrl = '';
    this.siteData = null;
    this.date = '';
    this.error = '';
  }
  
  static get properties() {
    return {
      loading: { type: Boolean, reflect: true },
      items: { type: Array },
      value: { type: String },
      baseUrl: { type: String },
      siteData: { type: Object },
      date: { type: String },
      error: { type: String },
    };
  }

  static get styles() {
    return [super.styles,css`
      :host {
        font-family: var(--ddd-font-primary);
        display: block;
        padding: 2rem;
      }

      .header {
        text-align: center;
        margin-bottom: var(--ddd-spacing-5);
        font-weight: var(--ddd-font-weight-bold);
        font-size: 40px;
      }


      .container{
        display: flex;
        flex-direction: column;
        gap: var(--ddd-spacing-5, 20px);
        max-width: 1500px;
        align-items: center;
        margin: auto;
      }

      .search {
        display: flex;
        width: 700px;
        justify-content: center;
        gap: var(--ddd-spacing-3);
        margin-bottom: 2rem;
      }

      input {
        width: 500px;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
      }

      button {
        padding: 0.75rem 1.5rem;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 500;
      }

      button:hover {
        background: #1d4ed8;
      }

      button:disabled {
        opacity: 0.5;
      }

      .error {
        color: #dc2626;
        text-align: center;
        margin-bottom: 1rem;
      }

      .results {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        padding: 1rem;
      }

      .site-overview {
        background: var(--ddd-theme-default-accent);
        width: 500px;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        margin-bottom: 2rem;
        text-align: center;
      }

      .site-info {
        display: grid;
        gap: 1rem;
        margin-top: 1rem;
      }

      .site-title {
        font-weight: var(--ddd-font-weight-bold);
        font-size: 30px;
      }
    `];
  }

  validateAndFormatUrl(url) {
    try {
      let finalUrl = url.trim();
      if (!finalUrl.startsWith('http')) {
        finalUrl = 'https://' + finalUrl;
      }
      const urlObj = new URL(finalUrl);
      if (!urlObj.pathname.endsWith('site.json')) {
        urlObj.pathname = urlObj.pathname.replace(/\/?$/, '/site.json');
      }
      return urlObj.toString();
    } catch (e) {
      return null;
    }
  }

  async analyze(e) {
    e.preventDefault();
    const input = this.shadowRoot.querySelector('input');
    const url = this.validateAndFormatUrl(input.value);
    
    if (!url) {
      this.error = 'Please enter a valid URL';
      return;
    }

    this.loading = true;
    this.error = '';
    this.siteData = null;
    this.items = [];

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch site data');
      
      const data = await response.json();
      this.siteData = data;
      this.items = data.items;
      this.baseUrl = url.replace('site.json', '');
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }

  dateToString(timestamp){
    const date = new Date(timestamp * 1000);
    return date.toUTCString();
  }

  render() {
    return html`
      <div class="container">
        <div class="header">HAX Analyzer</div>

        <form class="search" @submit=${this.analyze}>
          <input 
            type="text" 
            placeholder="Enter site URL (e.g., haxtheweb.org)"
            ?disabled=${this.loading}
          >
          <button type="submit" ?disabled=${this.loading}>
            ${this.loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        ${this.error ? html`<div class="error">${this.error}</div>` : ''}

        ${this.siteData ? html`
          <div class="site-overview">
            <div class="site-title">${this.siteData.metadata.site.name}</div>
            <p>${this.siteData.metadata.site.description}</p>
            <div class="site-info">
              <div>
                <strong>Theme:</strong> ${this.siteData.metadata.theme.element}
              </div>
              <div>
                <strong>Created:</strong> ${this.dateToString(this.siteData.metadata.site.created)}
              </div>
              <div>
                <strong>Updated:</strong> ${this.dateToString(this.siteData.metadata.site.created)}
              </div>
            </div>
          </div>
        ` : ''}

        <div class="results">
          ${this.items.map(item => html`
            <hax-card
              .title=${item.title}
              .description=${item.description}
              .slug=${item.slug}
              .baseUrl=${this.baseUrl}
              .metadata=${item.metadata}
            ></hax-card>
          `)}
        </div>
      </div>
    `;
  }

  static get tag() {
    return "hax-search";
  }
}

globalThis.customElements.define(HaxSearch.tag, HaxSearch);