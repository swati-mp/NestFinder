const fetchlocation = document.getElementById("fetchlocation");
const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");

fetchlocation.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                latitude.value = position.coords.latitude;
                longitude.value = position.coords.longitude;
            },
            (error) => {
                console.error("Error fetching location:", error.message);
                alert("Error fetching location. Please allow location access.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});
