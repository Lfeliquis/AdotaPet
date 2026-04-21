export function PetGridSkeleton({ count = 6 }) {
  return (
    <div className="pet-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton skeleton-image"></div>

          <div className="skeleton skeleton-line title"></div>
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line short"></div>

          <div
            className="skeleton"
            style={{ height: "52px", borderRadius: "16px", marginTop: "12px" }}
          ></div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 3 }) {
  return (
    <div className="list-page">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-list-row" key={index}>
          <div className="skeleton-list-left">
            <div className="skeleton skeleton-list-thumb"></div>

            <div className="skeleton-list-content">
              <div className="skeleton skeleton-line title"></div>
              <div className="skeleton skeleton-line"></div>
              <div className="skeleton skeleton-line short"></div>
            </div>
          </div>

          <div className="skeleton-list-right">
            <div className="skeleton skeleton-badge"></div>

            <div className="skeleton-button-row">
              <div className="skeleton skeleton-button"></div>
              <div className="skeleton skeleton-button"></div>
              <div className="skeleton skeleton-button"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <>
      <div className="dashboard-stats">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="skeleton-stat-card" key={index}>
            <div className="skeleton skeleton-stat-label"></div>
            <div className="skeleton skeleton-stat-number"></div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="dashboard-box" key={index}>
            <div className="skeleton skeleton-line title"></div>
            <div className="skeleton skeleton-line"></div>
            <div className="skeleton skeleton-line short"></div>
            <div
              className="skeleton"
              style={{ height: "52px", borderRadius: "16px", marginTop: "12px" }}
            ></div>
          </div>
        ))}
      </div>
    </>
  );
}

export function PetDetailsSkeleton() {
  return (
    <div className="pet-details-page">
      <div className="pet-details-container">
        <div className="skeleton-details-card">
          <div className="skeleton skeleton-details-image"></div>

          <div className="skeleton-details-content">
            <div className="skeleton skeleton-details-title"></div>
            <div className="skeleton skeleton-details-meta"></div>
            <div className="skeleton skeleton-details-meta"></div>
            <div className="skeleton skeleton-details-meta"></div>
            <div className="skeleton skeleton-details-meta"></div>

            <div className="skeleton skeleton-details-paragraph"></div>
            <div className="skeleton skeleton-details-paragraph"></div>
            <div className="skeleton skeleton-details-paragraph"></div>

            <div className="skeleton skeleton-details-button"></div>
          </div>
        </div>
      </div>
    </div>
  );
}