import {
  Injectable,
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  Inject,
  ComponentRef,
  Type,
  TemplateRef,
  EmbeddedViewRef,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { TextComponent } from "./text/text.component";
import { and } from "ng-packagr/lib/graph/select";

export interface ToasterConfig {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  slideInFrom?: "top" | "right" | "bottom" | "left";
  timeout?: number | null;
  showCloseButton?: boolean;
}

export interface ToastComponent extends Object {}

export interface TextToasterComponent extends ToastComponent {
  text: string;
}

export interface ToastRef {
  containerElement: HTMLElement;
  contentContainerElement: HTMLElement;
  componentRef: ComponentRef<any>;
  timeout?: any;
  instance: any;
}

@Injectable({
  providedIn: "root",
})
export class ToasterService {
  private toasterHost!: HTMLDivElement;
  public toasts: ToastComponent[] = [];
  private toastMap = new Map<ToastComponent, ToastRef>();
  private contentContainerMap = new Map<HTMLElement, ToastRef>();
  private defaultConfig: ToasterConfig = {
    position: "bottom-right",
    slideInFrom: "bottom",
    timeout: 3000,
    showCloseButton: true,
  };
  private offset = 10; // Offset between stacked notifications

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.toasterHost = this.document.createElement("div");
    this.toasterHost.classList.add("toaster-host");
    this.document.body.appendChild(this.toasterHost);
  }

  public toast<C extends ToastComponent>(
    bread: Type<C> | string,
    bindingsOrConfig?: Partial<C> | ToasterConfig,
    config?: ToasterConfig,
  ): C | TextComponent {
    const bindings: any =
      typeof bread === "string" ? { text: bread } : bindingsOrConfig;
    config = {
      ...this.defaultConfig,
      ...(config ? config : bindingsOrConfig || {}),
    };
    const [containerElement, contentContainerElement] =
      this.createNotificationElement(config);
    const componentRef = createComponent(TextComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: contentContainerElement,
    });

    for (const [property, value] of Object.entries(bindings)) {
      componentRef.setInput(property, value);
    }

    this.appRef.attachView(componentRef.hostView);

    const toastRef: ToastRef = {
      containerElement,
      contentContainerElement,
      componentRef,
      instance: componentRef.instance,
    };
    this.toasts.push(componentRef.instance);
    this.toastMap.set(componentRef.instance, toastRef);
    this.contentContainerMap.set(contentContainerElement, toastRef);

    if (config.timeout && config.timeout > 0) {
      setTimeout(() => {
        this.close(componentRef.instance);
      }, config.timeout);
    }

    this.positionNotifications();

    return componentRef.instance;
  }

  /**
   * Close a notification by component instance
   * @param toast The component instance
   */
  public close(toast: any): void {
    const toastRef = this.toastMap.get(toast);
    if (toastRef) {
      // Clear timeout if exists
      if (toastRef.timeout) {
        clearTimeout(toastRef.timeout);
      }

      // Add closing animation
      toastRef.containerElement.classList.add("toaster-closing");

      // Remove after animation completes
      setTimeout(() => {
        if (toastRef.componentRef) {
          this.appRef.detachView(toastRef.componentRef.hostView);
          toastRef.componentRef.hostView.destroy();
        }
        toastRef.containerElement.remove();
        this.toastMap.delete(toast);
        this.contentContainerMap.delete(toastRef.contentContainerElement);
        this.toasts.splice(this.toasts.indexOf(toast), 1);

        this.positionNotifications();
      }, 300); // Match animation duration
    }
  }

  /**
   * Close all notifications
   */
  public closeAll(): void {
    this.toasts.forEach((toast) => this.close(toast));
  }

  /**
   * Create a notification element with the given configuration
   * @param config The notification configuration
   * @returns The notification element
   */
  private createNotificationElement(
    config: ToasterConfig,
  ): [HTMLElement, HTMLElement] {
    const containerElement = this.document.createElement("div");
    containerElement.classList.add("toaster-notification");
    containerElement.classList.add(`toaster-${config.position}`);

    if (config.slideInFrom) {
      containerElement.classList.add(
        `toaster-slide-from-${config.slideInFrom}`,
      );
    }

    if (config.showCloseButton) {
      const closeButton = this.document.createElement("button");
      closeButton.classList.add("toaster-close");
      closeButton.innerHTML = "&times;";

      closeButton.addEventListener("click", () => {
        this.close(
          this.contentContainerMap.get(contentContainerElement)?.instance,
        );
      });
      containerElement.appendChild(closeButton);
    }

    const contentContainerElement = this.document.createElement("div");
    contentContainerElement.classList.add("toaster-content");
    containerElement.appendChild(contentContainerElement);

    this.toasterHost.appendChild(containerElement);

    return [containerElement, contentContainerElement];
  }

  /**
   * Position all notifications with proper stacking
   */
  private positionNotifications(): void {
    const notifications = Array.from(this.toastMap.values());
    notifications.forEach((notification, index) => {
      const element = notification.contentContainerElement
        .parentElement as HTMLElement;
      if (element) {
        // Calculate position based on index
        const translateY = index * (element.offsetHeight + this.offset);
        element.style.transform = `translateY(-${translateY}px)`;
      }
    });
  }
}
