// Enhanced cookie clearing function
const clearAllCookies = () => {
  // Get all cookies and clear them with multiple path/domain combinations
  const cookies = document.cookie.split(";");
  
  cookies.forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    
    if (name) {
      // Clear with various path and domain combinations
      const pathsAndDomains = [
        { path: '/', domain: '' },
        { path: '/', domain: window.location.hostname },
        { path: '/', domain: '.' + window.location.hostname },
        { path: window.location.pathname, domain: '' },
        { path: window.location.pathname, domain: window.location.hostname },
        { path: window.location.pathname, domain: '.' + window.location.hostname },
      ];
      
      pathsAndDomains.forEach(({ path, domain }) => {
        const domainPart = domain ? `;domain=${domain}` : '';
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}${domainPart}`;
      });
    }
  });
};

// Utility function for logging out - can be used globally
export const performLogout = async () => {
  try {
    // Clear all cookies with comprehensive approach
    clearAllCookies();
    
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Small delay to ensure clearing operations complete
    // This prevents race condition when dev tools aren't open
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Redirect to login page at the same domain as the app
    window.location.href = window.location.origin + '/login.html';
  } catch (error) {
    console.error('Error during logout:', error);
    // Force redirect even if there's an error
    window.location.href = window.location.origin + '/login.html';
  }
};

// Hook-based logout
export const useLogout = () => {
  
  return async () => {
    try {      
      // perform standard logout
      await performLogout();
    } catch (error) {
      console.error('Error during logout with password gates:', error);
      // Fallback to direct logout
      await performLogout();
    }
  };
};
