/**
 * state-mobile-logic.js
 * Handles mobile-specific UI interactions, live time, weather, and charts.
 * Fully autonomous for the Mobile version.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Map Expand Interaction (Mobile Specific)
    const mapImg = document.querySelector('.map-box img');
    if (mapImg) {
        let isExpanded = false;
        mapImg.addEventListener('click', () => {
            if (!isExpanded) {
                const rect = mapImg.getBoundingClientRect();
                if (window.gsap) {
                    gsap.to(mapImg, { width: window.innerWidth, x: -rect.left, duration: 0.6, ease: "power3.inOut", onStart: () => mapImg.classList.add('expanded') });
                } else {
                    mapImg.classList.add('expanded');
                }
            } else {
                if (window.gsap) {
                    gsap.to(mapImg, { width: '100%', x: 0, duration: 0.6, ease: "power3.inOut", onComplete: () => mapImg.classList.remove('expanded') });
                } else {
                    mapImg.classList.remove('expanded');
                }
            }
            isExpanded = !isExpanded;
        });
    }

    // 2. Scroll Animations for sections
    if (window.gsap) {
        gsap.from(".section-card", { duration: 0.6, y: 30, opacity: 0, stagger: 0.1, ease: "power2.out" });
        gsap.from(".reveal-text", { duration: 1.2, y: 40, opacity: 0, stagger: 0.15, ease: "power3.out" });
    }

    // Check config
    if (!window.stateConfig) {
        console.error('stateConfig is missing. Please define it in the HTML file.');
        return;
    }
    const { timezone, weatherQuery, charts } = window.stateConfig;

    // 3. Live Time
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay && timezone) {
        const updateTime = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString("en-US", { timeZone: timezone, hour: '2-digit', minute: '2-digit' });
            timeDisplay.textContent = timeStr;
        };
        setInterval(updateTime, 1000);
        updateTime();
    }

    // 4. Weather (Autonomous Mobile version)
    const weatherDisplay = document.getElementById('weather-display');
    if (weatherDisplay && weatherQuery) {
        const fetchWeather = async () => {
            try {
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${weatherQuery}&appid=254ae4d7c6554c83c77aef623440e825&units=imperial`);
                const data = await res.json();
                if (data.weather && data.weather.length > 0) {
                    const icon = data.weather[0].icon;
                    weatherDisplay.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png" style="width:30px; vertical-align:middle; margin-right:5px;" alt="Weather icon"> ${Math.round(data.main.temp)}°F`;
                } else {
                    weatherDisplay.textContent = "Unavailable";
                }
            } catch (e) {
                weatherDisplay.textContent = "Unavailable";
            }
        };
        fetchWeather();
    }

    // 5. Scroll-Triggered Charts (Chart.js)
    if (window.Chart && charts) {
        let createdCharts = {};

        const createChart = (id) => {
            if (createdCharts[id] || !charts[id]) return;
            const canvasEl = document.getElementById(id);
            if (!canvasEl) return;
            const ctx = canvasEl.getContext('2d');
            const config = charts[id];
            new Chart(ctx, config);
            createdCharts[id] = true;
        };

        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    const canvas = entry.target.querySelector('canvas');
                    if (canvas && canvas.id) {
                        createChart(canvas.id);
                        obs.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    }
});
