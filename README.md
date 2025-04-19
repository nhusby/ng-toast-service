# ng-toaster

A simple, customizable notification service for Angular applications. This service shows notifications that slide onto the screen with configurable behavior.

## Features

- Show notifications that slide onto the screen
- Configurable position, slide-in direction, and timeout
- Stack multiple notifications with offset
- Close button for each notification
- Support for text, component, and template-based notifications

## Installation

```bash
npm install ng-toaster
```

## Usage

### Import the service

```typescript
import { ToasterService } from 'ng-toaster';

@Component({
  // ...
})
export class YourComponent {
  constructor(private toasterService: ToasterService) {}
}
```

### Show a simple text notification

```typescript
this.toasterService.toast('This is a notification message');
```

### Show a notification with a component

```typescript
import { YourNotificationComponent } from './your-notification.component';

// In your component
const notification = this.toasterService.toast(YourNotificationComponent, {
  // Optional bindings for your component
  message: 'Hello World',
  type: 'success'
});

// You can now use the returned component instance
console.log(notification.message); // Outputs: "Hello World"
```

### Show a notification with a template

```typescript
// In your component
@ViewChild('notificationTemplate') notificationTemplate!: TemplateRef<any>;

// Later in your code
const context = {
  message: 'Hello World',
  type: 'success'
};
const templateContext = this.toasterService.showTemplate(this.notificationTemplate, context);

// You can now use the returned template context
console.log(templateContext.message); // Outputs: "Hello World"
```

### Customize notification behavior

```typescript
this.toasterService.toast('This is a notification message', {
  position: 'top-right',       // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  slideInFrom: 'top',          // 'top', 'right', 'bottom', 'left'
  timeout: 5000,               // Time in milliseconds before auto-close (0 to disable)
  showCloseButton: true        // Whether to show a close button
});
```

### Close notifications

```typescript
// Close a specific notification
const notification = this.toasterService.toast('This will be closed');
this.toasterService.close(notification);

// Close all notifications
this.toasterService.closeAll();
```

## Configuration

The default configuration is:

```typescript
{
  position: 'bottom-right',
  slideInFrom: 'bottom',
  timeout: 3000,
  showCloseButton: true
}
```

## Styling

The package includes default styling in `toaster.service.css`, but you can override it by targeting the following CSS classes:

- `.toaster-host`: The container for all notifications
- `.toaster-notification`: The notification element
- `.toaster-content`: The content container
- `.toaster-text`: Text content
- `.toaster-close`: Close button

## Building

To build the library, run:

```bash
ng build ng-toaster
```

## License

MIT
