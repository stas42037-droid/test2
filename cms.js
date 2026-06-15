async function fetchGlobalData() {
    try {
        let response = await fetch('api.php?action=get');
        return await response.json();
    } catch (e) {
        console.error("Помилка бази даних сайту", e);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    const siteData = await fetchGlobalData();
    if (!siteData) return;

    if (siteData.news && siteData.news.length > 0) {
        siteData.news.sort((a, b) => b.id - a.id);
    }

    let currentPath = window.location.pathname.split("/").pop() || "index.html";
    const urlParams = new URLSearchParams(window.location.search);
    const pageId = urlParams.get('id');
    const newsId = urlParams.get('newsId');

    // 1. Оновлення навігаційних меню на всьому закладі
    const navContainer = document.getElementById('navContainer');
    if (navContainer) {
        navContainer.innerHTML = siteData.pages.map(p => `<li><a href="${p.url}">${p.title}</a></li>`).join('');
    }
    const leftMenu = document.getElementById('leftMenu');
    if (leftMenu) {
        leftMenu.innerHTML = siteData.pages.map(p => `<li><a href="${p.url}">${p.title}</a></li>`).join('');
    }
    const sidebarMenu = document.querySelector('.left-sidebar .school-left-menu, aside.sidebar .school-left-menu');
    if (sidebarMenu) {
        sidebarMenu.innerHTML = siteData.pages.map(p => `<li><a href="${p.url}">${p.title}</a></li>`).join('');
    }

    // 2. ЗАЛІЗОБЕТОННЕ ВИВЕДЕННЯ НОВИН ПО ID КОНТЕЙНЕРА
    const newsContainer = document.getElementById('sidebarNewsContainer');
    if (newsContainer) {
        let shortNewsList = siteData.news.slice(0, 3);
        if (shortNewsList.length === 0) {
            newsContainer.innerHTML = '<p style="font-style:italic; color:#64748b; font-size:13px; padding:10px 0;">Новин поки немає.</p>';
        } else {
            let dynamicNewsHtml = shortNewsList.map(n => `
                <div class="news-item" style="display:flex; align-items:flex-start; margin-bottom:12px; gap:10px; padding:5px 0;">
                    <div class="news-img" style="background-image: url('${n.imgUrl || 'foto/news2.jpg'}'); background-size: cover; background-position: center; width:70px; height:55px; border-radius:3px; flex-shrink:0; margin:0;"></div>
                    <div>
                        <a href="news.html?newsId=${n.id}" style="display:block; font-size:13px; font-weight:bold; text-decoration:none; color:#224263; line-height:1.3;">${n.title}</a>
                        <small style="color: #64748b; font-size: 11px; display: block; margin-top:3px;">⏱️ ${n.date || ''}</small>
                    </div>
                </div>
            `).join('');
            
            dynamicNewsHtml += `<p style="text-align: right; font-size: 12px; margin-top:5px;"><a href="news.html" style="color: #cf2e2e; font-weight: bold; text-decoration: none;">Усі Новини →</a></p>`;
            newsContainer.innerHTML = dynamicNewsHtml;
        }
    }

    // 3. БЕЗПОМИЛКОВИЙ АВТОНОМНИЙ РОУТИНГ КОНТЕНТУ
    let activeId = pageId ? pageId : currentPath;
    if (activeId === "" || activeId === "/") activeId = "index.html";

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        // Сторінка новин (news.html)
        if (currentPath.includes('news.html')) {
            if (newsId) {
                const article = siteData.news.find(n => n.id == newsId);
                if (article) {
                    mainContent.innerHTML = `
                        <h1 style="color: #224263; font-size:26px; margin-bottom:5px;">${article.title}</h1>
                        <div style="font-size: 12px; color: #64748b; margin-bottom:20px;">📅 Дата публікації: ${article.date || ''}</div>
                        <div style="max-width:100%; margin-bottom:20px; border-radius:6px; overflow:hidden;">
                            <img src="${article.imgUrl || 'foto/news2.jpg'}" style="width:100%; max-height:380px; object-fit:cover; display:block;">
                        </div>
                        <div style="font-size:16px; line-height:1.8; color:#273043; white-space: pre-line;">${article.text || ''}</div>
                        <p style="margin-top:30px;"><a href="news.html" style="color:#cf2e2e; font-weight:bold; text-decoration:none;">← До списку всіх новин</a></p>
                    `;
                }
            } else {
                mainContent.innerHTML = `
                    <h1>Новини ліцею</h1>
                    <p style="color: #64748b; margin-bottom: 25px; font-size: 15px;">Актуальні події, оголошення та досягнення нашого закладу.</p>
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        ${siteData.news.length === 0 ? '<p style="font-style:italic; color:#64748b;">Новин поки немає.</p>' : siteData.news.map(n => `
                            <div style="display: flex; gap: 20px; background: #ffffff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); align-items: center; flex-wrap: wrap;">
                                <div class="news-img" style="width: 130px; height: 95px; border-radius: 4px; margin: 0; background-image: url('${n.imgUrl || 'foto/news2.jpg'}'); background-size: cover; background-position: center; flex-shrink: 0;"></div>
                                <div style="flex: 1; min-width: 250px;">
                                    <h3 style="margin: 0 0 8px 0; color: #224263; font-size: 18px;"><a href="news.html?newsId=${n.id}" style="color:#224263; text-decoration:none;">${n.title}</a></h3>
                                    <p style="margin:0 0 12px 0; color:#475569; font-size:14px; line-height:1.5;">${n.text ? n.text.substring(0, 150) + '...' : ''}</p>
                                    <div style="display: flex; gap: 10px; align-items: center;">
                                        <a href="news.html?newsId=${n.id}" style="font-size:12px; color:#cf2e2e; font-weight:bold; text-decoration:none; background:#fff5f5; padding:3px 8px; border-radius:3px;">Читати повністю →</a>
                                        <span style="font-size: 12px; color: #475569; background: #f1f5f9; padding: 3px 8px; border-radius: 3px;">📅 ${n.date || ''}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        } 
        // Кастомна сторінка конструктора Wix (наприклад, Чистота) — ВІДКРИВАЄТЬСЯ МИТТЄВО
        else if (pageId) {
            const pageObj = siteData.pages.find(p => p.id === activeId);
            let pageTitle = pageObj ? pageObj.title : 'Сторінка';
            let contentText = siteData.contents[activeId] || `<p style="font-style:italic; color:#64748b;">Тут поки немає вмісту. Наповніть сторінку елементами зліва в кабінеті адміністратора.</p>`;
            
            mainContent.innerHTML = `
                <h1 style="color: #224263; border-bottom: 3px solid #224263; padding-bottom: 10px; margin-bottom: 20px;">${pageTitle}</h1>
                <div class="wix-content">${contentText}</div>
            `;
        } 
        // Стандартна сторінка (наприклад info.html чи parents.html)
        else if (siteData.contents[activeId] && siteData.contents[activeId].trim() !== "") {
            // Завантажуємо версію директора тільки якщо вона ДІЙСНО там щось зберегла й поле не порожнє!
            mainContent.innerHTML = siteData.contents[activeId];
        }
        // ЯКЩО ДИРЕКТОРКА НІЧОГО НЕ МІНЯЛА — СКРИПТ ВЗАГАЛІ НЕ ЧІПАЕ МАКЕТ, І ЗАВАНТАЖУЄТЬСЯ ТВІЙ ОРИГІНАЛЬНИЙ HTML З ТАБЛИЦЯМИ!
    }
});
