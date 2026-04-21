export default function FormSkeleton({ title = true }) {
  return (
    <div className="form-shell">
      <div className="skeleton-form-card">
        {title && <div className="skeleton skeleton-form-title"></div>}

        <div className="skeleton skeleton-input"></div>
        <div className="skeleton skeleton-input"></div>
        <div className="skeleton skeleton-input"></div>
        <div className="skeleton skeleton-input"></div>

        <div className="skeleton skeleton-textarea"></div>

        <div className="skeleton skeleton-image-preview"></div>

        <div className="skeleton skeleton-submit-button"></div>
      </div>
    </div>
  );
}