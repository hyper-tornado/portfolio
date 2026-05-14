// 1. ローディング解除
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1200);
});

// 2. ハンバーガーメニュー開閉
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('menu-close');
const menu = document.getElementById('compact-menu');

if(menuBtn) {
    menuBtn.onclick = (e) => {
        e.stopPropagation();
        menu.classList.toggle('open');
    };
}
window.onclick = () => menu.classList.remove('open');

// 3. フィルタリング機能
function filterWork(category) {
    const cards = document.querySelectorAll('.work-card');
    const btns = document.querySelectorAll('.tab-btn');
    const moreBtnContainer = document.getElementById('more-btn-container');
    btns.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');

    cards.forEach(card => {
        card.classList.remove('shown');
        if (category === 'all') {
            if (!card.classList.contains('is-more')) card.classList.add('shown');
            if (moreBtnContainer) moreBtnContainer.style.display = 'flex';
        } else {
            if (card.classList.contains(category)) card.classList.add('shown');
            if (moreBtnContainer) moreBtnContainer.style.display = 'none';
        }
    });
}

// 4. MOREボタン
function showMoreWorks() {
    const moreCards = document.querySelectorAll('.work-card.more-item');
    const btn = document.getElementById('load-more');
    const isClosing = btn.innerText === '-CLOSE';
    if (isClosing) {
        moreCards.forEach(card => card.classList.remove('shown'));
        btn.innerText = '＋MORE';
    } else {
        moreCards.forEach(card => {
            card.classList.remove('is-more');
            card.classList.add('shown');
        });
        btn.innerText = '-CLOSE';
    }
}

// 5. 詳細ページの開閉（画像表示の修正版）
function openDetail(title, link, desc, tools = "---", time = "---", target = "---", scene = "---") {
    const detailBody = document.getElementById('detail-body');
    const detailTitle = document.getElementById('detail-title');
    detailTitle.innerText = title;

    const isImageUrl = link.match(/\.(jpg|jpeg|png|gif|PNG)$/i);
    let previewHtml = "";

    if (isImageUrl) {
        previewHtml = `
            <div id="detail-img-container">
                <div class="iframe-wrapper img-mode">
                    <img src="${link}" style="width:100%; height:auto; display:block;">
                </div>
                <div class="button-area">
                    <a href="${link}" target="_blank" class="visit-link">全画面で開く ↗</a>
                </div>
            </div>`;
    } else {
        previewHtml = `
            <div id="detail-img-container">
                <div class="iframe-wrapper">
                    <iframe src="${link}"></iframe>
                </div>
                <div class="button-area">
                    <a href="${link}" target="_blank" class="visit-link">全画面で開く ↗</a>
                </div>
            </div>`;
    }

    // ★ 説明文とリスト形式の詳細情報
    const infoHtml = `
        <div id="detail-desc-container">
            <div class="about-section">
                <p class="desc-text">${desc}</p>
            </div>
            <ul class="detail-info-list">
                <li><span class="label">🎨 使用ツール</span><span class="value">${tools}</span></li>
                <li><span class="label">⏰ 制作時間</span><span class="value">${time}</span></li>
                <li><span class="label">👥 ターゲット</span><span class="value">${target}</span></li>
                <li><span class="label">📺 使用シーン</span><span class="value">${scene}</span></li>
            </ul>
        </div>
    `;

    detailBody.innerHTML = previewHtml + infoHtml;
    document.getElementById('detail-page').classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 
}

function closeDetail() {
    document.getElementById('detail-page').classList.add('hidden');
    document.body.style.overflow = 'auto'; 
}