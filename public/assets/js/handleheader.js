/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-undef
const socket = io(); // Connect to the Socket.IO server

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

// After Logout Below Code will prevent user from accessing Admin Seeker Owner page
if (!document.cookie.includes('email')) {
    window.location.replace('/');
}



// Function to update the status when checkbox changes
function updateStatus(propertyId, isChecked) {
    const status = isChecked ? "Available" : "Unavailable";
    socket.emit('updateStatus', { propertyId, status });  // Emit the status change to server
}

// Listen for real-time updates from the server and update the UI
socket.on('statusUpdated', (data) => {
    const statusText = document.getElementById(`statusText${data.propertyId}`);
    const statusToggle = document.getElementById(`statusToggle${data.propertyId}`);

    if (statusText && statusToggle) {
        statusText.innerText = data.status; // Update the text showing the status
        statusToggle.checked = data.status === "Available"; // Update checkbox based on status
    }
});