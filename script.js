document.addEventListener('DOMContentLoaded', function () {
    // Get the button elements
    const getIPButton = document.getElementById('getIPButton');
    const getInfoButton = document.getElementById('getInfoButton');

    // Attach click event listener to the "Get IP Address" button
    getIPButton.addEventListener('click', function () {
        // Make an AJAX request to retrieve the public IP address
        const ipAPI = 'https://api.ipify.org/?format=json';

        const xhrIP = new XMLHttpRequest();
        xhrIP.open('GET', ipAPI, true);
        xhrIP.onreadystatechange = function () {
            if (xhrIP.readyState === 4 && xhrIP.status === 200) {
                // Parse the response and extract the public IP address
                const responseIP = JSON.parse(xhrIP.responseText);
                const publicIP = responseIP.ip;

                // Display the public IP address on the page
                const ipAddressElement = document.getElementById('ipAddress');
                ipAddressElement.textContent = 'Public IP Address: ' + publicIP;
            }
        };
        xhrIP.send();
    });

    // Attach click event listener to the "Get Information" button
    getInfoButton.addEventListener('click', function () {
        // Get the public IP address
        const ipAddressElement = document.getElementById('ipAddress');
        const publicIP = ipAddressElement.textContent.replace('Public IP Address: ', '');

        // Make an AJAX request to the IP geolocation API
        const geoAPI = `https://ipinfo.io/${publicIP}/geo`;

        const xhrGeo = new XMLHttpRequest();
        xhrGeo.open('GET', geoAPI, true);
        xhrGeo.onreadystatechange = function () {
            if (xhrGeo.readyState === 4 && xhrGeo.status === 200) {
                // Parse the response
                const responseGeo = JSON.parse(xhrGeo.responseText);

                // Extract latitude and longitude values
                const { lat, lng } = responseGeo.loc.split(',');

                // Show user's location on Google Maps
                const mapElement = document.getElementById('map');
                const mapsURL = `https://maps.google.com/maps?q=35.856737, 10.606619&z=15&output=embed`;
                const iframe = document.createElement('iframe');
                iframe.src = mapsURL;
                iframe.width = '600';
                iframe.height = '450';
                iframe.frameborder = '0';
                iframe.style.border = '0';
                mapElement.appendChild(iframe);

                // Get the user's time based on the timezone
                const timezone = responseGeo.timezone;
                const timeAPI = `https://api.ipgeolocation.io/timezone?`;

                const xhrTime = new XMLHttpRequest();
                xhrTime.open('GET', timeAPI, true);
                xhrTime.onreadystatechange = function () {
                    if (xhrTime.readyState === 4 && xhrTime.status === 200) {
                        // Parse the response and extract the time
                        const responseTime = JSON.parse(xhrTime.responseText);
                        const currentTime = responseTime.time;

                        // Display the calculated time on the page
                        const timeElement = document.getElementById('time');
                        timeElement.textContent = 'Current Time: ' + currentTime;
                    }
                };
                xhrTime.send();

                // Get the pincode
                const pincode = responseGeo.postal;

                // Make an AJAX request to the postalpincode API
                const pincodeAPI = `https://api.postalpincode.in/pincode/${pincode}`;

                const xhrPincode = new XMLHttpRequest();
                xhrPincode.open('GET', pincodeAPI, true);
                xhrPincode.onreadystatechange = function () {
                    if (xhrPincode.readyState === 4 && xhrPincode.status === 200) {
                        // Parse the response
                        const responsePincode = JSON.parse(xhrPincode.responseText);
                        const postOffices = responsePincode[0].PostOffice;

                        // Display the list of post offices on the page
                        const postOfficesList = document.getElementById('postOfficesList');
                        postOfficesList.innerHTML = '';

                        postOffices.forEach(function (office) {
                            const listItem = document.createElement('li');
                            listItem.textContent = `${office.Name} (${office.BranchType})`;
                            postOfficesList.appendChild(listItem);
                        });
                    }
                };
                xhrPincode.send();
            }
        };
        xhrGeo.send();
    });

    // Attach input event listener to the search box
    const searchBox = document.getElementById('searchBox');
    searchBox.addEventListener('input', function () {
        // Get the search query
        const query = searchBox.value.toLowerCase();

        // Filter the list of post offices based on the search query
        const postOfficesList = document.getElementById('postOfficesList');
        const listItems = postOfficesList.getElementsByTagName('li');

        Array.from(listItems).forEach(function (listItem) {
            const text = listItem.textContent.toLowerCase();
            if (text.includes(query)) {
                listItem.style.display = 'block';
            } else {
                listItem.style.display = 'none';
            }
        });
    });
});
