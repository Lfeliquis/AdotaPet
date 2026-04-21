export default function PageContainer({ title, emoji, action, children }) {
  return (
    <div className="page-shell">
      <div className="page-container">
        {(title || action) && (
          <div className="page-header">
            <div>
              {title && (
                <h1 className="page-title">
                  {title} {emoji && <span>{emoji}</span>}
                </h1>
              )}
            </div>

            {action && <div className="page-header-action">{action}</div>}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
