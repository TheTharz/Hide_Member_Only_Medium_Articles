function hideMemberOnlyPostsByStarIcon() {
  console.log('[Medium Cleaner] Running hideMemberOnlyPostsByStarIcon()');

  const starSvgs = document.querySelectorAll('svg');
  let removedCount = 0;

  starSvgs.forEach((svg) => {
    const path = svg.querySelector('path');
    if (path && path.getAttribute('fill') === '#FFC017') {
      let parent = svg;
      // Traverse up until we find the nearest article
      while (parent && parent.tagName !== 'ARTICLE') {
        parent = parent.parentElement;
      }
      if (parent) {
        parent.remove();
        removedCount++;
      }
    }
  });

  console.log(`[Medium Cleaner] Removed ${removedCount} member-only post(s)`);
}

function observeFeedChanges() {
  const feedContainer = document.querySelector(
    'div[role="feed"], section, main'
  );
  if (!feedContainer) {
    console.log('[Medium Cleaner] Feed container not found');
    return;
  }

  console.log('[Medium Cleaner] Setting up feed MutationObserver');

  const observer = new MutationObserver(() => {
    console.log('[Medium Cleaner] Feed content changed - reapplying filter');
    hideMemberOnlyPostsByStarIcon();
  });

  observer.observe(feedContainer, { childList: true, subtree: true });
}

function handleRouteChanges() {
  let lastUrl = location.href;
  console.log('[Medium Cleaner] Watching for route changes');

  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      console.log(`[Medium Cleaner] Route changed: ${lastUrl} → ${currentUrl}`);
      lastUrl = currentUrl;

      // Wait briefly for the new content to load
      setTimeout(() => {
        console.log(
          '[Medium Cleaner] Route change detected - filtering new page'
        );
        hideMemberOnlyPostsByStarIcon();
        observeFeedChanges();
      }, 1000);
    }
  }).observe(document.body, { childList: true, subtree: true });
}

// Initial setup
window.addEventListener('load', () => {
  console.log('[Medium Cleaner] Page loaded - initializing');
  hideMemberOnlyPostsByStarIcon();
  observeFeedChanges();
  handleRouteChanges();
});
