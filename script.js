function initializePortfolio() {
    // --- Lógica para el cambio de tema ---
    try {
        const themeToggle = document.getElementById('theme-toggle');
        const lightIcon = document.getElementById('theme-icon-light');
        const darkIcon = document.getElementById('theme-icon-dark');
        const userTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const applyTheme = (isDark) => {
            document.body.classList.toggle('dark', isDark);
            if (lightIcon) lightIcon.classList.toggle('hidden', isDark);
            if (darkIcon) darkIcon.classList.toggle('hidden', !isDark);

            if (typeof particlesJS !== 'undefined') {
                initParticlesJS();
            }
        };

        const toggleTheme = (isDark) => {
            applyTheme(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        };

        if (userTheme === 'dark' || (!userTheme && systemTheme)) {
            applyTheme(true);
        } else {
            applyTheme(false);
        }

        themeToggle.addEventListener('click', () => {
            const isDarkMode = document.body.classList.contains('dark');
            toggleTheme(!isDarkMode);
        });
    } catch (error) {
        console.error("Error en el sistema de temas:", error);
    }

    // --- Lógica para el cambio de idioma ---
    try {
        const langToggle = document.getElementById('lang-toggle');
        const langIconEs = document.getElementById('lang-icon-es');
        const langIconEn = document.getElementById('lang-icon-en');
        const skillsContainer = document.getElementById('skills-container');
        const experienceContainer = document.getElementById('experience-container');
        const projectsContainer = document.getElementById('projects-container');
        const cvDownloadBtn = document.getElementById('cv-download-btn');

        const loadTranslations = async (lang) => {
            const response = await fetch(`./${lang}.json`);
            if (!response.ok) {
                throw new Error(`Error de red: ${response.status}. No se pudo encontrar el archivo ${lang}.json`);
            }
            return await response.json();
        };

        const setLanguage = async (lang) => {
            const translations = await loadTranslations(lang);
            if (!translations) return;

            document.documentElement.lang = lang;
            document.querySelectorAll('[data-key]').forEach(element => {
                const key = element.getAttribute('data-key');
                if (key !== 'hero_subtitle' && translations.main[key]) {
                    element.innerText = translations.main[key];
                }
            });

            document.title = translations.main.page_title;

            langIconEs.classList.toggle('hidden', lang !== 'es');
            langIconEn.classList.toggle('hidden', lang === 'es');

            if(cvDownloadBtn) {
                cvDownloadBtn.href = lang === 'es' ? './assets/docs/E.Pérez CV.pdf' : './assets/docs/Eduardo_Perez_CV_EN.pdf';
            }

            skillsContainer.innerHTML = '';
            translations.skills.forEach(skill => {
                const skillTag = document.createElement('span');
                skillTag.className = 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300 text-sm font-medium px-3 py-1.5 rounded-full';
                skillTag.innerText = skill;
                skillsContainer.appendChild(skillTag);
            });

            experienceContainer.innerHTML = '';
            translations.experience.forEach(job => {
                const descriptionPoints = job.description.map(point => `<li>${point}</li>`).join('');
                const highlight = job.highlight ? `<p class="mt-4 font-semibold accent-text">${translations.main.highlight_prefix}: <span class="font-normal text-slate-800 dark:text-slate-400">${job.highlight}</span></p>` : '';
                
                const experienceEntry = `
                    <div class="timeline-item">
                        <div class="card rounded-xl overflow-hidden shadow-lg p-6">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="text-xl font-bold">${job.title}</h3>
                                <span class="text-sm font-medium text-slate-500 dark:text-slate-400 text-right">${job.date}</span>
                            </div>
                            <h4 class="text-lg font-semibold text-slate-800 dark:text-slate-300 mb-4">${job.company}</h4>
                            <ul class="experience-card-description text-slate-800 dark:text-slate-400">
                                ${descriptionPoints}
                            </ul>
                            ${highlight}
                        </div>
                    </div>
                `;
                experienceContainer.innerHTML += experienceEntry;
            });

            projectsContainer.innerHTML = '';
            translations.projects.forEach(project => {
                projectsContainer.innerHTML += `<div class="card rounded-xl overflow-hidden shadow-lg"><img src="${project.image}" alt="${project.title}" class="w-full h-56 object-cover"><div class="p-6"><h3 class="text-xl font-bold mb-2">${project.title}</h3><p class="text-slate-800 dark:text-slate-400 mb-4">${project.description}</p><div class="flex space-x-4"><a href="${project.code_url}" target="_blank" class="font-medium accent-text hover:underline">${translations.main.view_code_btn} &rarr;</a></div></div></div>`;
            });

            localStorage.setItem('language', lang);
            initializeAnimations(translations.main.hero_subtitle);
        };

        langToggle.addEventListener('click', () => {
            const currentLang = localStorage.getItem('language') || 'es';
            const newLang = currentLang === 'es' ? 'en' : 'es';
            setLanguage(newLang);
        });

        const savedLang = localStorage.getItem('language') || 'es';
        setLanguage(savedLang);

    } catch (error) {
        console.error("Error en el sistema de idiomas:", error);
    }
}

function initializeAnimations(typewriterText) {
    try {
        const subtitleElement = document.querySelector('[data-key="hero_subtitle"]');
        if (subtitleElement && typewriterText) {
            let i = 0;
            subtitleElement.innerHTML = '';
            const typing = () => {
                if (i < typewriterText.length) {
                    subtitleElement.innerHTML = typewriterText.substring(0, i + 1) + '<span class="caret"></span>';
                    i++;
                    setTimeout(typing, 100);
                } else {
                    subtitleElement.innerHTML = typewriterText + '<span class="caret"></span>';
                }
            };
            typing();
        }

        const sections = document.querySelectorAll('.fade-in-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        sections.forEach(section => observer.observe(section));

        const progressBar = document.getElementById('scroll-progress-bar');
        if (progressBar) {
            window.addEventListener('scroll', () => {
                const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                progressBar.style.width = `${scrollProgress}%`;
            });
        }

        if (typeof particlesJS !== 'undefined') {
            initParticlesJS();
        }
    } catch (error) {
        console.error("Error al inicializar las animaciones:", error);
    }
}

function initParticlesJS() {
    const isDark = document.body.classList.contains('dark');
    const particleColor = isDark ? getComputedStyle(document.documentElement).getPropertyValue('--particles-color-dark').trim() : getComputedStyle(document.documentElement).getPropertyValue('--particles-color-light').trim();
    const linkColor = isDark ? getComputedStyle(document.documentElement).getPropertyValue('--particles-color-dark').trim() : getComputedStyle(document.documentElement).getPropertyValue('--particles-color-light').trim();

    particlesJS('particles-js', { "particles": { "number": { "value": 80, "density": { "enable": true, "value_area": 800 } }, "color": { "value": particleColor }, "shape": { "type": "circle", }, "opacity": { "value": 0.5, "random": false, }, "size": { "value": 3, "random": true, }, "line_linked": { "enable": true, "distance": 150, "color": linkColor, "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "push": { "particles_nb": 4 }, } }, "retina_detect": true });
}

document.addEventListener('DOMContentLoaded', initializePortfolio);
