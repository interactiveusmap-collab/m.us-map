/**
 * state_logic.js
 * Shared logic for all US state pages.
 * Handles animations, live time, weather, and charts.
 */

document.addEventListener('DOMContentLoaded', () => {
    if (!window.stateConfig) {
        console.error('stateConfig is missing. Please define it in the HTML file.');
        return;
    }

    const { timezone, weatherQuery, charts } = window.stateConfig;

    // --- 1. Entry Animations (GSAP) ---
    if (window.gsap) {
        gsap.from(".reveal-text", {
            duration: 1.2,
            y: 40,
            opacity: 0,
            stagger: 0.15,
            ease: "power3.out"
        });

        gsap.from(".bento-card:not(.animate-on-scroll)", {
            duration: 0.8,
            y: 50,
            opacity: 0,
            stagger: 0.1,
            delay: 0.3,
            ease: "power2.out",
            clearProps: "all"
        });
    }

    // --- 2. Live Time ---
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay && timezone) {
        const updateTime = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString("en-US", {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit'
            });
            timeDisplay.textContent = timeStr;
        };
        setInterval(updateTime, 1000);
        updateTime();
    }

    // --- 3. Weather ---
    const weatherDisplay = document.getElementById('weather-display');
    if (weatherDisplay && weatherQuery) {
        const fetchWeather = async () => {
            try {
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${weatherQuery}&appid=254ae4d7c6554c83c77aef623440e825&units=imperial`);
                const data = await res.json();
                const icon = data.weather[0].icon;
                weatherDisplay.innerHTML = `
                    <img src="https://openweathermap.org/img/wn/${icon}.png" style="width:30px; vertical-align:middle; margin-right:5px;" alt="Weather icon"> 
                    ${Math.round(data.main.temp)}°F
                `;
            } catch (e) {
                weatherDisplay.textContent = "Unavailable";
            }
        };
        fetchWeather();
    }

    // --- 4. Scroll-Triggered Charts (Chart.js) ---
    if (window.Chart && charts) {
        let createdCharts = {};

        const createChart = (id) => {
            if (createdCharts[id] || !charts[id]) return;
            const ctx = document.getElementById(id).getContext('2d');
            const config = charts[id];

            new Chart(ctx, config);
            createdCharts[id] = true;
        };

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

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

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
});
