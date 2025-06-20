// === i18n Setup ===
i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
        fallbackLng: 'en',
        debug: true,
        backend: {
            loadPath: './locales/{{lng}}.json'
        }
    }, () => {
        updateContent();
    });

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerHTML = i18next.t(key);
    });
}

i18next.on('languageChanged', updateContent);

// === DOMContentLoaded Logic ===
document.addEventListener("DOMContentLoaded", () => {
    // === Language Switcher ===
    const activeLangBtn = document.getElementById("activeLang");
    const langOptions = document.getElementById("langOptions");

    if (activeLangBtn && langOptions) {
        activeLangBtn.addEventListener("click", () => {
            langOptions.classList.toggle("hidden");
        });

        document.querySelectorAll(".lang-options .lang-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const lang = btn.getAttribute("data-lang");
                i18next.changeLanguage(lang);

                const flagImg = btn.querySelector("img").cloneNode(true);
                activeLangBtn.innerHTML = "";
                activeLangBtn.appendChild(flagImg);

                // Hide selected from dropdown
                document.querySelectorAll(".lang-options .lang-btn").forEach(opt => {
                    if (opt.getAttribute("data-lang") === lang) {
                        opt.style.display = "none";
                    } else {
                        opt.style.display = "block";
                    }
                });

                langOptions.classList.add("hidden");
            });
        });

        const currentLang = i18next.language || 'en';
        const currentFlag = document.querySelector(`.lang-btn[data-lang='${currentLang}'] img`);
        if (currentFlag) {
            activeLangBtn.innerHTML = "";
            activeLangBtn.appendChild(currentFlag.cloneNode(true));

            // Hide current from dropdown initially
            document.querySelectorAll(".lang-options .lang-btn").forEach(opt => {
                if (opt.getAttribute("data-lang") === currentLang) {
                    opt.style.display = "none";
                }
            });
        }
    }

    // === vCard Action Buttons ===
    const topActions = document.getElementById("topActions");
    const shareBtn = document.getElementById("share");
    const showQRBtn = document.getElementById("showQR");
    const modal = document.getElementById("modal");
    const copyView = document.getElementById("copyView");
    const qrView = document.getElementById("qrView");
    const closeModal = document.getElementById("close");
    const copyURL = document.getElementById("copyURL");
    const qrContainer = document.getElementById("qr");

    if (topActions) topActions.style.display = "flex";

    function showModal(showQR = false) {
        modal.style.visibility = "visible";
        modal.style.opacity = "1";
        modal.style.top = "0px";
        qrView.style.display = showQR ? "block" : "none";
        copyView.style.display = showQR ? "none" : "flex";
    }

    function hideModal() {
        modal.style.top = "2rem";
        modal.style.opacity = "0";
        setTimeout(() => {
            modal.style.visibility = "hidden";
        }, 200);
    }

    if (shareBtn) {
        shareBtn.addEventListener("click", () => {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    text: "Check out this business card",
                    url: window.location.href
                });
            } else {
                showModal(false);
            }
        });
    }

    if (showQRBtn) {
        showQRBtn.addEventListener("click", () => {
            showModal(true);
            qrContainer.innerHTML = "";
            new QRCode(qrContainer, {
                text: window.location.href,
                width: 128,
                height: 128
            });
        });
    }

    if (copyURL) {
        copyURL.addEventListener("click", async () => {
            await navigator.clipboard.writeText(window.location.href);
            copyURL.innerText = "Copied!";
            setTimeout(() => {
                copyURL.innerText = "Copy URL";
            }, 1500);
        });
    }

    if (closeModal) {
        closeModal.addEventListener("click", hideModal);
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                hideModal();
            }
        });
    }

    // === Accordion Interaction ===
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
        });
    });

    // === Optional Trailing Slash Redirect ===
    const url = window.location.href;
    if (url.startsWith("http") && !url.endsWith("/")) {
        window.location.replace(url + "/");
    }
});