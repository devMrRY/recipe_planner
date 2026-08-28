import {
  Component,
  Prop,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
} from "@stencil/core";

@Component({
  tag: "app-modal",
  styleUrl: "modal.css",
  shadow: true,
})
export class AppModal {
  /**
   * Controls whether the modal is visible.
   */
  @Prop({ mutable: true })
  open = false;

  /**
   * Modal title.
   */
  @Prop({ reflect: true })
  modalTitle = "";

  /**
   * Close when clicking the backdrop.
   */
  @Prop()
  closeOnBackdrop = true;

  /**
   * Close when pressing Escape.
   */
  @Prop()
  closeOnEscape = true;

  @Event()
  modalClose!: EventEmitter<void>;

  @Listen("keydown", { target: "window" })
  handleKeyDown(event: KeyboardEvent) {
    if (this.open && this.closeOnEscape && event.key === "Escape") {
      this.close();
    }
  }

  private close() {
    this.open = false;
    this.modalClose.emit();
  }

  private handleBackdropClick(event: MouseEvent) {
    if (!this.closeOnBackdrop) {
      return;
    }

    // Only close when the backdrop itself
    // was clicked, not its children.
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  private handleCloseClick() {
    this.close();
  }

  render() {
    if (!this.open) {
      return null;
    }

    return (
      <Host>
        <div
          class="backdrop"
          onClick={(event) => this.handleBackdropClick(event)}
        >
          <div
            class="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}

            <header class="modal-header">
              <div class="title-container">
                <h2 id="modal-title">{this.modalTitle}</h2>
              </div>

              <button
                type="button"
                class="close-button"
                aria-label="Close modal"
                onClick={() => this.handleCloseClick()}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </header>

            {/* Body */}

            <div class="modal-body">
              <slot />
            </div>

            {/* Footer */}

            <footer class="modal-footer">
              <slot name="footer" />
            </footer>
          </div>
        </div>
      </Host>
    );
  }
}
