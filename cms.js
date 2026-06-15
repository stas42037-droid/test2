async function fetchGlobalData() {
    try {
        let response = await fetch('api.php?action=get');
        return await response.json();
    } catch (e) {
        console.error("Помилка синхронізації з базою даних", e);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    const siteData = await fetchGlobalData();
    if (!siteData) return;

    // СУВОРЕ СОРТУВАННЯ: Найновіші новини за ID завжди перші у списку
    if (siteData.news && siteData.news.length > 0) {
        siteData.news.sort((a, b) => b.id - a.id);
    }

    let currentPath = window.location.pathname.split("/").pop() || "index.html";
    const urlParams = new URLSearchParams(window.location.search);
    const pageId = urlParams.get('id');

    // 1. Навігація ПК
    const navContainer = document.getElementById('navContainer');
    if (navContainer) {
        navContainer.innerHTML = siteData.pages.map(p => `<li><a href="${p.url}">${p.title}</a></li>`).join('');
    }

    // 2. Мобільне меню
    const leftMenu = document.getElementById('leftMenu');
    if (leftMenu) {
        leftMenu.innerHTML = siteData.pages.map(p => `<li><a href="${p.url}">${p.title}</a></li>`).join('');
    }

    // 3. Бічна навігація
    const sidebarMenu = document.querySelector('.sidebar .school-left-menu, .left-sidebar .school-left-menu');
    if (sidebarMenu) {
        sidebarMenu.innerHTML = siteData.pages.map(p => `<li><a href="${p.url}">${p.title}</a></li>`).join('');
    }

    // 4. Блок "Останні новини" у сайдбарі праворуч (Показує 3 найсвіжіші з часом створення)
    const newsWidget = document.querySelector('.sidebar');
    if (newsWidget) {
        const items = newsWidget.querySelectorAll('.news-item');
        items.forEach(el => el.remove());
        const titleEl = newsWidget.querySelector('.widget-title:nth-of-type(2)') || newsWidget.querySelector('.widget-title');
        
        let shortNewsList = siteData.news.slice(0, 3);
        
        let newsHtml = shortNewsList.map(n => `
            <div class="news-item" style="align-items: flex-start; margin-bottom: 12px;">
                <div class="news-img" style="background-image: url('${n.imgUrl || 'foto/news2.jpg'}'); background-size: cover; background-position: center;"></div>
                <div>
                    <a href="news.html" style="display:block; margin-bottom:2px;">${n.title}</a>
                    <small style="color: #64748b; font-size: 11px; display: block;">⏱️ ${n.date || 'Раніше'}</small>
                </div>
            </div>
        `).join('');
        
        if (titleEl) titleEl.insertAdjacentHTML('afterend', newsHtml);
    }

    // 5. Оновлення сторінки новин (Повний список, відсортований, з великими плашками дат)
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        if (currentPath === 'page.html' && pageId && siteData.contents[pageId]) {
            mainContent.innerHTML = siteData.contents[pageId];
        } 
        else if (currentPath === 'news.html') {
            let fullNewsFeed = `
                <h1>Новини ліцею</h1>
                <p style="color: #64748b; margin-bottom: 25px; font-size: 15px;">Актуальні події, оголошення та досягнення нашого закладу.</p>
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    ${siteData.news.map(n => `
                        <div style="display: flex; gap: 20px; background: #ffffff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); align-items: center; flex-wrap: wrap;">
                            <div class="news-img" style="width: 130px; height: 95px; border-radius: 4px; margin: 0; background-image: url('${n.imgUrl || 'foto/news2.jpg'}'); background-size: cover; background-position: center; flex-shrink: 0;"></div>
                            <div style="flex: 1; min-width: 250px;">
                                <h3 style="margin: 0 0 8px 0; color: #224263; font-size: 18px; line-height: 1.4;">${n.title}</h3>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <span style="font-size: 12px; color: #cf2e2e; font-weight: bold; background: #fff5f5; padding: 3px 8px; border-radius: 3px;">📢 Новина ліцею</span>
                                    <span style="font-size: 12px; color: #475569; background: #f1f5f9; padding: 3px 8px; border-radius: 3px; font-weight: 500;">📅 Опубліковано: ${n.date || 'Вказано раніше'}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            mainContent.innerHTML = fullNewsFeed;
        } 
        else if (siteData.contents[currentPath]) {
            mainContent.innerHTML = siteData.contents[currentPath];
        }
    }
});
