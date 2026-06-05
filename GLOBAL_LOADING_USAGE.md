# Global Loading Implementation

## Usage in Any Component

Import the `useLoading` s hook in any component to trigger the global loading state:

```tsx
"use client";
import { useLoading } from "@/contexts/LoadingContext";

export default function YourComponent() {
  const { showLoading, hideLoading } = useLoading();

  const handleAction = async () => {
    // Show loading
    showLoading();
    
    try {
      // Your async operation
      await fetch('/api/your-endpoint');
    } catch (error) {
      console.error(error);
    } finally {
      // Hide loading
      hideLoading();
    }
  };

  return (
    <button onClick={handleAction}>
      Click Me
    </button>
  );
}
```

## Example: Update PointCreate.tsx

Replace the local loading state with global loading:

```tsx
"use client";
import { useLoading } from "@/contexts/LoadingContext";

export default function PointCreate() {
  const { showLoading, hideLoading } = useLoading();
  
  const handleSubmit = async () => {
    showLoading();
    try {
      // Your API call
      await createPoint(data);
    } finally {
      hideLoading();
    }
  };

  // Remove local isLoading state and ClipLoader
  // Global loader will handle it automatically
}
```

## Features

- **Centralized**: Single loading state for entire app
- **Automatic**: Shows/hides BeatLoader overlay automatically
- **Reusable**: Call from any component using the hook
- **Styled**: Orange (#FF8901) BeatLoader on semi-transparent overlay
- **High z-index**: Always displays on top (z-9999)
