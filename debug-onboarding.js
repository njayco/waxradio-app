// Debug script for onboarding
// Run this in browser console to debug onboarding state

console.log('🔍 Onboarding Debug Info:');
console.log('localStorage key:', 'waxradio-onboarding-completed');
console.log('localStorage value:', localStorage.getItem('waxradio-onboarding-completed'));
console.log('Has completed onboarding:', !!localStorage.getItem('waxradio-onboarding-completed'));

// Functions to manipulate onboarding state
window.debugOnboarding = {
  reset: function() {
    localStorage.removeItem('waxradio-onboarding-completed');
    console.log('✅ Onboarding reset - refresh page to see tutorial');
    window.location.reload();
  },
  complete: function() {
    localStorage.setItem('waxradio-onboarding-completed', 'true');
    console.log('✅ Onboarding marked as complete - refresh page');
    window.location.reload();
  },
  status: function() {
    const completed = !!localStorage.getItem('waxradio-onboarding-completed');
    console.log('🎓 Onboarding completed:', completed);
    return completed;
  }
};

console.log('🛠️ Available functions:');
console.log('- debugOnboarding.reset() - Reset onboarding to show tutorial');
console.log('- debugOnboarding.complete() - Mark onboarding as complete');
console.log('- debugOnboarding.status() - Check current status'); 