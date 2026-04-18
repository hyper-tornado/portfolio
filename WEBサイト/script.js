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
function openDetail(title, link, desc) {
    const detailBody = document.getElementById('detail-body');
    const detailTitle = document.getElementById('detail-title');
    detailTitle.innerText = title;

    // ★ 判定条件の改善：拡張子が画像(PNG等)なら最優先でimgタグを使う
    const isImageUrl = link.match(/\.(jpg|jpeg|png|gif|PNG)$/i);
    let previewHtml = "";

    if (isImageUrl) {
        // 画像の場合
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
        // Webサイト(http)の場合
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

    detailBody.innerHTML = `${previewHtml}<div id="detail-desc-container"><p id="detail-desc">${desc}</p></div>`;
    document.getElementById('detail-page').classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 
}

function closeDetail() {
    document.getElementById('detail-page').classList.add('hidden');
    document.body.style.overflow = 'auto'; 
}