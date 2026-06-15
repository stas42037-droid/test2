// Автоматичне отримання даних із сервера
async function fetchGlobalData() {
    try {
        let response = await fetch('api.php?action=get');
        return await response.json();
    } catch (e) {
        console.error("Помилка синхронізації з базою даних сайту", e);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    const siteData = await fetchGlobalData();
    if (!siteData) return;

    let currentPath = window.location.pathname.split("/").pop() || "index.html";
    const urlParams = new URLSearchParams(window.location.search);
    const pageId = urlParams.get('id');

    // 1. Оновлення головного меню (ПК)
    const navContainer = document.getElementById('navContainer');
    if (navContainer) {
        navContainer.innerHTML = siteData.pages.map(p => `<li><a href="${p.url}">${p.title}</a></li>`).join('');
    }

    // 2. Оновлення мобільного меню
    const leftMenu = document.getElementById('leftMenu');
    if (leftMenu) {
        leftMenu.innerHTML = siteData.pages.map(p => `<li><a href="${p.url}">${p.title}</a></li>`).join('');
    }

    // 3. Оновлення бічного меню (sidebar)
    const sidebarMenu = document.querySelector('.sidebar .school-left-menu, .left-sidebar .school-left-menu');
    if (sidebarMenu) {
        sidebarMenu.innerHTML = siteData.pages.map(p => `<li><a href="${p.url}">${p.title}</a></li>`).join('');
    }

    // 4. Оновлення віджету новин у сайдбарі
    const newsWidget = document.querySelector('.sidebar');
    if (newsWidget) {
        const items = newsWidget.querySelectorAll('.news-item');
        items.forEach(el => el.remove());
        const titleEl = newsWidget.querySelector('.widget-title:nth-of-type(2)') || newsWidget.querySelector('.widget-title');
        
        let newsHtml = siteData.news.map(n => `
            <div class="news-item">
                <div class="news-img ${n.imgClass}"></div>
                <a href="${n.url}">${n.title}</a>
            </div>
        `).join('');
        
        if (titleEl) titleEl.insertAdjacentHTML('afterend', newsHtml);
    }

    // 5. Оновлення контенту (якщо сторінку було змінено в адмінці)
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        if (currentPath === 'page.html' && pageId && siteData.contents[pageId]) {
            mainContent.innerHTML = siteData.contents[pageId];
        } else if (siteData.contents[currentPath]) {
            mainContent.innerHTML = siteData.contents[currentPath];
        }
    }
});