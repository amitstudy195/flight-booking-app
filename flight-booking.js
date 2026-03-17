// ========== FLIGHT DATA ==========
const flightData = [
    { airline: 'Air India', flight: 'AI-101', from: 'DEL', to: 'GOA', time: '08:00 - 10:30', duration: '2h 30m', stops: 0, price: 4500 },
    { airline: 'IndiGo', flight: '6E-102', from: 'DEL', to: 'GOA', time: '10:30 - 13:00', duration: '2h 30m', stops: 0, price: 3800 },
    { airline: 'Spice Jet', flight: 'SG-103', from: 'DEL', to: 'GOA', time: '14:00 - 16:30', duration: '2h 30m', stops: 0, price: 3500 },
    { airline: 'Vistara', flight: 'UK-104', from: 'DEL', to: 'GOA', time: '16:00 - 18:30', duration: '2h 30m', stops: 0, price: 5000 },
    { airline: 'Air India', flight: 'AI-201', from: 'DEL', to: 'MUM', time: '07:00 - 09:00', duration: '2h', stops: 0, price: 3800 },
    { airline: 'IndiGo', flight: '6E-205', from: 'DEL', to: 'MUM', time: '09:30 - 11:30', duration: '2h', stops: 0, price: 3200 },
    { airline: 'IndiGo', flight: '6E-202', from: 'DEL', to: 'BLR', time: '09:00 - 11:15', duration: '2h 15m', stops: 0, price: 4200 },
    { airline: 'Air India', flight: 'AI-206', from: 'DEL', to: 'BLR', time: '11:00 - 13:15', duration: '2h 15m', stops: 0, price: 4500 },
    { airline: 'Spice Jet', flight: 'SG-203', from: 'MUM', to: 'BLR', time: '12:00 - 13:45', duration: '1h 45m', stops: 0, price: 3000 },
    { airline: 'Vistara', flight: 'UK-210', from: 'MUM', to: 'BLR', time: '14:00 - 15:45', duration: '1h 45m', stops: 0, price: 3500 },
    { airline: 'Air India', flight: 'AI-301', from: 'MUM', to: 'GOA', time: '11:00 - 12:30', duration: '1h 30m', stops: 0, price: 2500 },
    { airline: 'IndiGo', flight: '6E-304', from: 'MUM', to: 'GOA', time: '13:00 - 14:30', duration: '1h 30m', stops: 0, price: 2800 },
    { airline: 'Air India', flight: 'AI-401', from: 'DEL', to: 'JLR', time: '06:00 - 07:15', duration: '1h 15m', stops: 0, price: 2200 },
    { airline: 'IndiGo', flight: '6E-402', from: 'DEL', to: 'JLR', time: '08:30 - 09:45', duration: '1h 15m', stops: 0, price: 1999 },
];

// ========== USERS DATA (Mock Storage) ==========
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// Store last search results + search options to support filtering after search
let lastSearchData = null;

// ========== LOCALSTORAGE HELPER FUNCTIONS ==========
function saveUsersToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(users));
    console.log('✅ Users saved to localStorage:', users);
}

function saveCurrentUserToLocalStorage() {
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('✅ Current user saved to localStorage:', currentUser);
    } else {
        localStorage.removeItem('currentUser');
        console.log('✅ Current user cleared from localStorage');
    }
}

function saveBookingsToLocalStorage() {
    localStorage.setItem('bookings', JSON.stringify(bookings));
    console.log('✅ Bookings saved to localStorage:', bookings);
}

function viewLocalStorageData() {
    console.log('========== 📦 LOCALSTORAGE DATA ==========');
    console.log('Users:', JSON.parse(localStorage.getItem('users') || '[]'));
    console.log('Current User:', JSON.parse(localStorage.getItem('currentUser') || 'null'));
    console.log('Bookings:', JSON.parse(localStorage.getItem('bookings') || '[]'));
    console.log('==========================================');
}

// ========== DOM ELEMENTS ==========
const searchForm = document.getElementById('searchForm');
const tripTypeInputs = document.querySelectorAll('input[name="tripType"]');
const returnDateGroup = document.getElementById('returnDateGroup');
const resultsSection = document.getElementById('resultsSection');
const resultsFilters = document.getElementById('resultsFilters');
const flightsList = document.getElementById('flightsList');
const bookingsSection = document.getElementById('bookingsSection');
const bookingsList = document.getElementById('bookingsList');
const faqItems = document.querySelectorAll('.faq-item');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const authButtons = document.getElementById('authButtons');
const userProfile = document.getElementById('userProfile');

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Page loaded - initializing Flight Booking App...');
    initializeDatePicker();
    setupEventListeners();
    updateAuthUI();
    initFlightFilters();
    console.log('📦 Loaded from localStorage:');
    console.log('  • Users registered:', users.length);
    console.log('  • Current logged-in user:', currentUser?.name || 'None');
    console.log('  • Total bookings:', bookings.length);
    console.log('💡 Tip: Type viewLocalStorageData() in console to see all stored data');
});

// ========== DATE PICKER SETUP ==========
function initializeDatePicker() {
    const today = new Date().toISOString().split('T')[0];

    // Flight date pickers
    const departDate = document.getElementById('departDate');
    const returnDate = document.getElementById('returnDate');

    if (departDate) departDate.setAttribute('min', today);
    if (returnDate) returnDate.setAttribute('min', today);

    // Hotel date pickers (if they exist)
    const checkInDate = document.getElementById('checkInDate');
    const checkOutDate = document.getElementById('checkOutDate');

    if (checkInDate) checkInDate.setAttribute('min', today);
    if (checkOutDate) checkOutDate.setAttribute('min', today);
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    console.log('Setting up event listeners...');

    // Trip Type Change
    tripTypeInputs.forEach(input => {
        input.addEventListener('change', handleTripTypeChange);
    });

    // FAQ Toggle
    faqItems.forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', function() {
            item.classList.toggle('active');
        });
    });

    // Form Submit
    searchForm.addEventListener('submit', handleSearchSubmit);
    console.log('Search form listener attached');

    // Login Form Submit
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form listener attached');
    } else {
        console.error('❌ Login form not found!');
    }

    // Signup Form Submit
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
        console.log('Signup form listener attached');
    } else {
        console.error('❌ Signup form not found!');
    }
}

// ========== MODAL FUNCTIONS ==========
function openLoginModal() {
    console.log('Opening login modal');
    if (!currentUser) {
        document.getElementById('loginModal').classList.add('active');
        console.log('Login modal class added');
    }
}

function closeLoginModal() {
    console.log('Closing login modal');
    document.getElementById('loginModal').classList.remove('active');
}

function openSignupModal() {
    console.log('Opening signup modal');
    if (!currentUser) {
        document.getElementById('signupModal').classList.add('active');
        console.log('Signup modal class added');
    }
}

function closeSignupModal() {
    console.log('Closing signup modal');
    document.getElementById('signupModal').classList.remove('active');
}

function switchToLogin() {
    closeSignupModal();
    openLoginModal();
}

function switchToSignup() {
    closeLoginModal();
    openSignupModal();
}

// Close modals when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');

    if (event.target === loginModal) {
        loginModal.classList.remove('active');
    }
    if (event.target === signupModal) {
        signupModal.classList.remove('active');
    }
}

// ========== LOGIN HANDLER ==========
function handleLogin(e) {
    e.preventDefault();
    console.log('Login handler called');

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    console.log('Login attempt - Email:', email);
    console.log('Available users:', users);

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        console.log('Login successful for user:', user.name);
        currentUser = { name: user.name, email: user.email };
        saveCurrentUserToLocalStorage();
        alert('✅ Login Successful! Welcome ' + user.name);
        closeLoginModal();
        updateAuthUI();
        loginForm.reset();
    } else {
        console.log('Login failed - invalid credentials');
        alert('❌ Invalid email or password');
    }
}

// ========== SIGNUP HANDLER ==========
function handleSignup(e) {
    e.preventDefault();
    console.log('Signup handler called');

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    console.log('Signup attempt - Name:', name, 'Email:', email);

    if (password !== confirmPassword) {
        alert('❌ Passwords do not match!');
        return;
    }

    if (users.find(u => u.email === email)) {
        alert('❌ Email already registered!');
        return;
    }

    users.push({ name, email, phone, password });
    saveUsersToLocalStorage();
    console.log('User registered successfully:',  { name, email, phone });

    alert('✅ Account created successfully! Please login.');
    closeSignupModal();
    signupForm.reset();
    openLoginModal();
}

// ========== LOGOUT HANDLER ==========
function logout() {
    currentUser = null;
    saveCurrentUserToLocalStorage();
    resultsSection.style.display = 'none';
    bookingsSection.style.display = 'none';
    updateAuthUI();
    alert('✅ Logged out successfully!');
}

// ========== UPDATE AUTH UI ==========
function updateAuthUI() {
    if (currentUser) {
        authButtons.style.display = 'none';
        userProfile.style.display = 'flex';
        document.getElementById('userName').textContent = '👤 ' + currentUser.name;
    } else {
        authButtons.style.display = 'flex';
        userProfile.style.display = 'none';
    }
}

// ========== SHOW MY BOOKINGS ==========
function goToMyBookings() {
    resultsSection.style.display = 'none';
    bookingsSection.style.display = 'block';
    displayMyBookings();

    setTimeout(() => {
        bookingsSection.scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

function showMyBookings(e) {
    e.preventDefault();

    if (!currentUser) {
        alert('⚠️ Please login first to view your bookings!');
        openLoginModal();
        return;
    }

    goToMyBookings();
}

// ========== DISPLAY MY BOOKINGS ==========
function displayMyBookings() {
    const userBookings = bookings.filter(b => b.email === currentUser.email);
    let bookingsHtml = '';

    if (userBookings.length > 0) {
        bookingsHtml = userBookings.map((booking, index) => `
            <div class="flight-card" style="animation: slideUp 0.3s ease ${index * 0.1}s; background: #f0f8ff; border-left: 4px solid #4CAF50;">
                <div class="flight-info">
                    <div class="flight-detail">
                        <h3>✈️ ${booking.flightNumber}</h3>
                        <p style="color: #4CAF50; font-weight: bold;">✓ ${booking.status}</p>
                    </div>
                    <div class="flight-detail">
                        <h3>📅 Booking Date</h3>
                        <p>${booking.bookingDate} at ${booking.bookingTime}</p>
                    </div>
                    <div class="flight-detail">
                        <h3>💳 Booking Reference</h3>
                        <p style="font-family: monospace; font-weight: bold;">${booking.id}</p>
                    </div>
                    <div class="flight-detail">
                        <h3>💰 Total Paid</h3>
                        <p>₹${booking.price.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        bookingsHtml = `
            <div style="padding: 40px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
                <p style="font-size: 18px; color: #666;">📭 No bookings found. Start booking flights now!</p>
            </div>
        `;
    }

    bookingsList.innerHTML = bookingsHtml;
}

// ========== BACK TO SEARCH ==========
function backToSearch() {
    bookingsSection.style.display = 'none';
    resultsSection.style.display = 'none';
}

// ========== TAB SWITCHING ==========
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    if (tabName === 'flight') {
        document.getElementById('searchForm').classList.add('active');
    } else if (tabName === 'hotel') {
        document.getElementById('hotelForm').classList.add('active');
    } else if (tabName === 'package') {
        document.getElementById('packageForm').classList.add('active');
    }

    // Add active class to clicked button
    event.target.classList.add('active');
}

// ========== TRIP TYPE HANDLER ==========
function handleTripTypeChange(event) {
    const tripType = event.target.value;
    const returnDateGroup = document.getElementById('returnDateGroup');
    const returnDate = document.getElementById('returnDate');

    if (tripType === 'oneway') {
        returnDateGroup.style.display = 'none';
        returnDate.required = false;
    } else {
        returnDateGroup.style.display = 'block';
        returnDate.required = true;
    }
}

// ========== SEARCH HANDLER ==========
function handleSearchSubmit(e) {
    e.preventDefault();

    try {
        const from = document.getElementById('fromCity').value;
        const to = document.getElementById('toCity').value;
        const departDate = document.getElementById('departDate').value;
        const passengers = parseInt(document.getElementById('passengers').value);
        const cabinClass = document.getElementById('cabinClass').value;
        const fareType = document.querySelector('input[name="fareType"]:checked').value;
        const tripType = document.querySelector('input[name="tripType"]:checked').value;

        if (!from || !to || !departDate) {
            alert('❌ Please fill in all required fields!');
            return;
        }

        if (from === to) {
            alert('⚠️ Departure and arrival cannot be the same. Please choose different cities.');
            return;
        }

        if (tripType !== 'oneway' && !document.getElementById('returnDate').value) {
            alert('❌ Please select a return date!');
            return;
        }

        // Calculate services cost
        let servicesCost = 0;
        document.querySelectorAll('#searchForm input[type="checkbox"]:checked').forEach(checkbox => {
            if (checkbox.value === 'insurance') servicesCost += 99;
            if (checkbox.value === 'seat') servicesCost += 299;
            if (checkbox.value === 'meal') servicesCost += 199;
            if (checkbox.value === 'baggage') servicesCost += 599;
        });

        // Filter flights
        const results = flightData.filter(flight => flight.from === from && flight.to === to);

        // Display Results
        displayFlightResults(results, passengers, cabinClass, fareType, from, to, departDate, servicesCost);

        // Scroll to results
        setTimeout(() => {
            document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    } catch (error) {
        console.error('Search handler error:', error);
        alert('❌ Something went wrong while searching. Please check the console and try again.');
    }
}

// ========== DISPLAY FLIGHT RESULTS ==========
function displayFlightResults(results, passengers, cabinClass, fareType, from, to, departDate, servicesCost) {
    resultsSection.classList.add('active');
    resultsFilters.style.display = 'flex';

    // Save last search state for filtering
    lastSearchData = {
        results,
        passengers,
        cabinClass,
        fareType,
        from,
        to,
        departDate,
        servicesCost
    };

    // Build dynamic airline filter options
    const airlines = Array.from(new Set(results.map(f => f.airline))).sort();
    buildAirlineFilters(airlines);

    renderFilteredResults();
}

function renderFilteredResults() {
    if (!lastSearchData) return;

    const {
        results,
        passengers,
        cabinClass,
        fareType,
        from,
        to,
        departDate,
        servicesCost
    } = lastSearchData;

    const filtered = applyFilters(results);

    if (!filtered || filtered.length === 0) {
        resultsFilters.style.display = 'none';
        flightsList.innerHTML = `
            <div style="padding: 40px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
                <p style="font-size: 18px; color: #666;">❌ No flights match your filters.</p>
                <p style="font-size: 14px; color: #555; margin-top: 10px;">Try clearing filters or adjusting your search.</p>
            </div>
        `;
        return;
    }

    resultsFilters.style.display = 'flex';

    const departDateObj = new Date(departDate);
    const formattedDate = departDateObj.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const resultsInfoEl = document.getElementById('resultsInfo');
    if (resultsInfoEl) {
        resultsInfoEl.innerHTML = `
            <strong>✈️ ${passengers} Passenger${passengers > 1 ? 's' : ''} | ${getAirportName(from)} → ${getAirportName(to)}</strong>
            <p style="margin-top: 8px; font-size: 13px;">📅 ${formattedDate} | 💺 ${cabinClass.toUpperCase()} | 💳 ${getFareTypeName(fareType)}</p>
        `;
    }

    const flightsHtml = filtered.map((flight, index) => {
        const finalPrice = calculateFare(flight.price, fareType);
        const totalPrice = finalPrice * passengers;
        const grandTotal = totalPrice + servicesCost;
        const discount = (flight.price - finalPrice) * passengers;

        return `
            <div class="flight-card" style="animation: slideUp 0.3s ease ${index * 0.1}s;">
                <div class="flight-info">
                    <div class="flight-detail">
                        <h3>✈️ ${flight.airline}</h3>
                        <p>${flight.flight}</p>
                    </div>
                    <div class="flight-detail">
                        <h3>🕐 ${flight.time}</h3>
                        <p>${flight.from} → ${flight.to}</p>
                    </div>
                    <div class="flight-detail">
                        <h3>⏱️ ${flight.duration}</h3>
                        <p>${flight.stops === 0 ? '✅ Non-stop' : '🔄 ' + flight.stops + ' Stop(s)'}</p>
                    </div>
                    <div class="flight-detail">
                        <h3>₹${finalPrice.toLocaleString()}</h3>
                        <p>${fareType !== 'regular' ? `💰 Save ₹${Math.round(discount / passengers).toLocaleString()}` : 'Standard'}</p>
                    </div>
                    <div class="flight-detail">
                        <h3 style="color: #4CAF50;">₹${grandTotal.toLocaleString()}</h3>
                        <p>${passengers} × ₹${finalPrice}${servicesCost > 0 ? ` + ₹${servicesCost}` : ''}</p>
                    </div>
                </div>
                <button onclick="bookFlight('${flight.flight}', ${grandTotal})" style="width: 100%; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 10px;">
                    ✅ Book Flight - ₹${grandTotal.toLocaleString()}
                </button>
            </div>
        `;
    }).join('');

    flightsList.innerHTML = flightsHtml;
}

function applyFilters(results) {
    const sortBy = document.getElementById('sortBy')?.value || 'none';
    const nonStopOnly = document.getElementById('filterNonStop')?.checked;

    // Airline filters
    const airlineCheckboxes = Array.from(document.querySelectorAll('#airlineFilters input[type="checkbox"]'));
    const selectedAirlines = airlineCheckboxes.filter(cb => cb.checked).map(cb => cb.value);

    let filtered = [...results];

    if (nonStopOnly) {
        filtered = filtered.filter(f => f.stops === 0);
    }

    if (airlineCheckboxes.length > 0) {
        if (selectedAirlines.length === 0) {
            // If the user clears all airline choices, show no results
            return [];
        }
        if (selectedAirlines.length !== airlineCheckboxes.length) {
            filtered = filtered.filter(f => selectedAirlines.includes(f.airline));
        }
    }

    const compareDuration = (a, b) => {
        const toMinutes = str => {
            const match = str.match(/(\d+)h\s*(\d+)?m?/);
            if (!match) return 0;
            const hours = parseInt(match[1], 10);
            const mins = match[2] ? parseInt(match[2], 10) : 0;
            return hours * 60 + mins;
        };
        return toMinutes(a.duration) - toMinutes(b.duration);
    };

    const baseFare = (flight) => calculateFare(flight.price, lastSearchData.fareType) * lastSearchData.passengers;

    if (sortBy === 'priceAsc') {
        filtered.sort((a, b) => baseFare(a) - baseFare(b));
    } else if (sortBy === 'priceDesc') {
        filtered.sort((a, b) => baseFare(b) - baseFare(a));
    } else if (sortBy === 'durationAsc') {
        filtered.sort(compareDuration);
    } else if (sortBy === 'stopsAsc') {
        filtered.sort((a, b) => a.stops - b.stops);
    }

    return filtered;
}

function buildAirlineFilters(airlines) {
    const container = document.getElementById('airlineFilters');
    if (!container) return;

    container.innerHTML = airlines.map(airline => {
        const cleanId = airline.replace(/\s+/g, '-').toLowerCase();
        return `
            <label for="airline-${cleanId}">
                <input type="checkbox" id="airline-${cleanId}" value="${airline}" checked>
                ${airline}
            </label>
        `;
    }).join('');

    // Attach change listeners to newly created checkboxes
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
            applyFiltersAndRender();
        });
    });
}

function applyFiltersAndRender() {
    renderFilteredResults();
}

function initFlightFilters() {
    const sortBy = document.getElementById('sortBy');
    const nonStop = document.getElementById('filterNonStop');
    const clearBtn = document.getElementById('clearFiltersBtn');

    if (sortBy) sortBy.addEventListener('change', applyFiltersAndRender);
    if (nonStop) nonStop.addEventListener('change', applyFiltersAndRender);

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (sortBy) sortBy.value = 'none';
            if (nonStop) nonStop.checked = false;
            document.querySelectorAll('#airlineFilters input[type="checkbox"]').forEach(cb => cb.checked = true);
            applyFiltersAndRender();
        });
    }
}

// ========== CALCULATE FARE ==========
function calculateFare(basePrice, fareType) {
    const discounts = {
        regular: 0,
        student: 0.25,
        armed: 0.15,
        senior: 0.10
    };
    return Math.round(basePrice * (1 - discounts[fareType]));
}

// ========== BOOK FLIGHT ==========
function bookFlight(flightNumber, price) {
    if (!currentUser) {
        alert('ℹ️ Please login to book this flight');
        openLoginModal();
        return;
    }

    const bookingRef = 'FL' + Date.now().toString().slice(-8);
    const booking = {
        id: bookingRef,
        flightNumber: flightNumber,
        price: price,
        email: currentUser.email,
        bookingDate: new Date().toLocaleDateString('en-IN'),
        bookingTime: new Date().toLocaleTimeString('en-IN'),
        status: 'Confirmed'
    };

    bookings.push(booking);
    saveBookingsToLocalStorage();

    alert(`
✅ BOOKING CONFIRMED!

Flight: ${flightNumber}
Total Price: ₹${price.toLocaleString()}

Booking Reference: ${bookingRef}

✉️ Confirmation sent to ${currentUser.email}
    `);

    // Automatically show the user's booking after confirmation
    goToMyBookings();
}

// ========== SWAP CITIES ==========
function swapCities() {
    const from = document.getElementById('fromCity').value;
    const to = document.getElementById('toCity').value;
    document.getElementById('fromCity').value = to;
    document.getElementById('toCity').value = from;
}

// ========== SELECT DESTINATION ==========
function selectDestination(destination) {
    if (!currentUser) {
        openLoginModal();
        return;
    }
    const toSelectMap = {
        'Goa': 'GOA',
        'Mumbai': 'MUM',
        'Bangalore': 'BLR',
        'Jaipur': 'JLR',
        'Chennai': 'CHE',
        'Hyderabad': 'HYD',
        'Kolkata': 'KOL',
        'Delhi': 'DEL'
    };
    document.getElementById('toCity').value = toSelectMap[destination];
    document.querySelector('.search-tabs .tab-btn.active').click();
    document.querySelector('.search-tabs .tab-btn:nth-child(1)').click();
    document.querySelector('.search-section').scrollIntoView({ behavior: 'smooth' });
}

// ========== QUICK SEARCH ==========
function quickSearch(from, to) {
    if (!currentUser) {
        openLoginModal();
        return;
    }
    document.getElementById('fromCity').value = from;
    document.getElementById('toCity').value = to;
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departDate').value = today;
    document.querySelector('.search-section').scrollIntoView({ behavior: 'smooth' });
}

// ========== BOOK PACKAGE ==========
function bookPackage(packageName, price) {
    if (!currentUser) {
        openLoginModal();
        return;
    }
    alert(`
🎉 PACKAGE BOOKED!

Package: ${packageName}
Price: ₹${price.toLocaleString()}

✅ Confirmation Email Sent!
📱 Check for booking details
    `);
}

// ========== MODIFY SEARCH ==========
function modifySearch() {
    document.querySelector('.search-section').scrollIntoView({ behavior: 'smooth' });
}

// ========== CAROUSEL SCROLL ==========
function scrollCarousel(direction, carouselId = 'destinationCarousel') {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const scrollAmount = 300;
    if (direction === 1) {
        carousel.scrollLeft += scrollAmount;
    } else {
        carousel.scrollLeft -= scrollAmount;
    }
}

// ========== GET AIRPORT NAME ==========
function getAirportName(code) {
    const airports = {
        'DEL': 'Delhi',
        'MUM': 'Mumbai',
        'BLR': 'Bangalore',
        'GOA': 'Goa',
        'CHE': 'Chennai',
        'HYD': 'Hyderabad',
        'JLR': 'Jaipur',
        'KOL': 'Kolkata'
    };
    return airports[code] || code;
}

// ========== GET FARE TYPE NAME ==========
function getFareTypeName(fareType) {
    const names = {
        'regular': 'Regular',
        'student': 'Student (25% OFF)',
        'armed': 'Armed Forces (15% OFF)',
        'senior': 'Senior Citizen (10% OFF)'
    };
    return names[fareType] || fareType;
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== DEBUG FUNCTIONS ==========
function showDebugSection() {
    const debugSection = document.getElementById('debugSection');
    debugSection.style.display = 'block';
    updateDebugData();
    console.log('Debug panel opened');
}

function closeDebugSection() {
    document.getElementById('debugSection').style.display = 'none';
    console.log('Debug panel closed');
}

function updateDebugData() {
    // Display Users
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    const debugUsers = document.getElementById('debugUsers');
    if (usersData.length > 0) {
        debugUsers.textContent = JSON.stringify(usersData, null, 2);
    } else {
        debugUsers.textContent = 'No users registered yet';
    }

    // Display Current User
    const currentUserData = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const debugCurrentUser = document.getElementById('debugCurrentUser');
    if (currentUserData) {
        debugCurrentUser.textContent = JSON.stringify(currentUserData, null, 2);
    } else {
        debugCurrentUser.textContent = 'No user logged in';
    }

    // Display Bookings
    const bookingsData = JSON.parse(localStorage.getItem('bookings') || '[]');
    const debugBookings = document.getElementById('debugBookings');
    if (bookingsData.length > 0) {
        debugBookings.textContent = JSON.stringify(bookingsData, null, 2);
    } else {
        debugBookings.textContent = 'No bookings yet';
    }
}

function clearAllLocalStorage() {
    if (confirm('⚠️ Are you sure you want to clear ALL data from localStorage?\n\nThis will delete:\n• All registered users\n• Your login session\n• All bookings\n\nThis action cannot be undone!')) {
        localStorage.clear();
        users = [];
        currentUser = null;
        bookings = [];
        updateAuthUI();
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('bookingsSection').style.display = 'none';
        alert('✅ All localStorage data cleared!');
        updateDebugData();
        console.log('All localStorage data cleared');
        location.reload();
    }
}
