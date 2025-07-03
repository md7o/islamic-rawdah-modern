export function FullLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-6 border-accent border-t-transparent mx-auto mb-4"></div>
        <div className="text-2xl font-medium">جاري التحميل...</div>
        <div className="text-md text-light-span mt-2">يرجى الانتظار قليلاً</div>
      </div>
    </div>
  );
}

export function ContainerLoadingSpinner() {
  return (
    <div className="flex items-center justify-center ">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-6 border-accent border-t-transparent mx-auto mb-4"></div>
        <div className="text-2xl font-medium">جاري التحميل...</div>
        <div className="text-md text-light-span mt-2">يرجى الانتظار قليلاً</div>
      </div>
    </div>
  );
}
