var toggleButton = document.getElementById('toggle_btn');
var hideTitle = document.getElementById('hide-title');

// Function to hide the title on mobile devices
function hideTitleOnMobile() {
    if (window.innerWidth <= 768) {
        hideTitle.style.setProperty('display', 'none', 'important'); // Hide on mobile
    } else {
        hideTitle.style.removeProperty('display'); // Remove inline styles for larger screens
    }
}

// Call this function initially to set the state correctly
hideTitleOnMobile();

// Add event listener to the toggle button for larger screens
toggleButton.addEventListener('click', function () {
    if (window.innerWidth > 768) {  // Only toggle on larger screens
        if (hideTitle.style.display === 'none') {
            // Show the element
            hideTitle.style.setProperty('display', 'flex', 'important');
        } else {
            // Hide the element
            hideTitle.style.setProperty('display', 'none', 'important');
        }
    }
});

// Recheck on window resize to adjust behavior dynamically
window.addEventListener('resize', function () {
    hideTitleOnMobile();  // Adjust the title visibility based on screen size
});