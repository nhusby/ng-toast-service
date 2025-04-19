# ng-toast-service

A simple, customizable notification service for Angular applications. This service shows notifications that slide onto the screen with configurable behavior.

## Features

- Show notifications that slide onto the screen
- Configurable position and timeout
- Stack multiple notifications with offset
- Close button for each notification
- Support for text notifications

## Installation

```bash
npm install ng-toast-service
```

## Usage

### Import the service

```typescript
import { ToasterService } from 'ng-toast-service';

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

### Customize notification behavior

```typescript
this.toasterService.toast('This is a notification message', {
  position: 'top-right',       // 'top', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'bottom'
  timeout: 5000,               // Time in milliseconds before auto-close (0 to disable)
  showCloseButton: true        // Whether to show a close button
});
```

### Show a notification with a component

```typescript
import { YourNotificationComponent } from './your-notification.component';

// In your component
const notification = this.toasterService.toast(YourNotificationComponent, {
  // Optional bindings for your component
  message: 'Hello World',
  type: 'success'
}, {
  showCloseButton: false
});

// You can now use the returned component instance
console.log(notification.message); // Outputs: "Hello World"
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
const defaultConfig = {
  position: 'bottom-right',
  timeout: 5000,
  showCloseButton: true
};
```

## Styling

The package includes default styling in `toaster.service.css`, but you can override it by targeting the following CSS classes:

- `.toast-host`: The container for all notifications
- `.toast-notification`: The notification element
- `.toast-content`: The content container
- `.toast-text`: Text content
- `.toast-close`: Close button

Position classes:
- `.toast-top-left`
- `.toast-top-right`
- `.toast-bottom-left`
- `.toast-bottom-right`

Animation classes:
- `.toast-slide-from-top`
- `.toast-slide-from-bottom`
- `.toast-closing`

## Building

To build the library, run:

```bash
ng build ng-toast-service
```

## License

MIT
