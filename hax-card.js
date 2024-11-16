import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class HaxCard extends DDDSuper(I18NMixin(LitElement)) {
  
  constructor() {
    super();
    this.title = '';
    this.description = '';
    this.slug = '';
    this.baseUrl = '';
    this.metadata = null;
  }

  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      slug: { type: String },
      baseUrl: { type: String },
      metadata: { type: Object }
    };
  }

  static get styles() {
    return [super.styles,css`
      :host {
        display: block;
      }

      .card {
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        overflow: hidden;
        transition: transform 0.2s;
        border: black;
      }

      .card:hover {
        transform: translateY(-2px);
      }

      .content {
        padding: 1.5rem;
      }

      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
      }

      .description {
        color: var(--ddd-theme-default-potential70);
        margin-bottom: 1rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .metadata {
        font-size: 0.875rem;
        color: var(--ddd-theme-default-potential50);
        margin-bottom: 1rem;
      }

      .actions {
        display: flex;
        gap: 0.5rem;
      }

      .button {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        text-decoration: none;
        font-weight: 500;
        font-size: 0.875rem;
      }

      .primary {
        background: #2563eb;
        color: white;
      }

      .secondary {
        background: #f3f4f6;
        color: #1f2937;
      }
    `];
  }

  dateToString(timestamp){
    const date = new Date(timestamp * 1000);
    return date.toUTCString();
  }

  render() {
    const contentUrl = `${this.baseUrl}${this.slug}`;
    const sourceUrl = `${this.baseUrl}${this.slug}/index.html`;

    return html`
      <div class="card">
        ${this.metadata?.image ? html`
          <img src="${this.metadata.image}" alt="${this.title}" style="width: 100%; height: 200px; object-fit: cover;">
        ` : ''}
        <div class="content">
          <h3>${this.title}</h3>
          <div class="description">${this.description}</div>
          <div class="metadata">
            <div>Updated: ${this.dateToString(this.metadata?.updated)}</div>
          </div>
          <div class="actions">
            <a href="${contentUrl}" target="_blank" class="button primary">View Content</a>
            <a href="${sourceUrl}" target="_blank" class="button secondary">View Source</a>
          </div>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "hax-card";
  }
}

customElements.define(HaxCard.tag, HaxCard);