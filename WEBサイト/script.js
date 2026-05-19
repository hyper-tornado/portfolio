window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 1200);
});

const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('compact-menu');
if(menuBtn) {
    menuBtn.onclick = (e) => {
        e.stopPropagation();
        menu.classList.toggle('open');
    };
}
window.onclick = () => { if(menu) menu.classList.remove('open'); };

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

function showMoreWorks() {
    const moreCards = document.querySelectorAll('.work-card.more-item');
    const btn = document.getElementById('load-more');
    if (btn.innerText === '-CLOSE') {
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

// 作品の形式に合せて、プレビュー枠をぴったりフィットさせる関数
function openDetail(title, link, desc, tool="", time="", target="", scene="") {
    const detailBody = document.getElementById('detail-body');
    const detailTitle = document.getElementById('detail-title');
    detailTitle.innerText = title;

    let previewHtml = "";

    // 拡張子からファイルタイプを細かくチェック
    const isImage = link.match(/\.(jpg|jpeg|png|gif|PNG)$/i);
    const isPdf = link.match(/\.pdf$/i);

    if (isImage) {
        previewHtml = `
            <div id="detail-img-container" class="type-image">
                <div class="iframe-wrapper">
                    <img src="${link}" alt="プレビュー">
                </div>
                <div class="button-area">
                    <a href="${link}" target="_blank" class="visit-link">全画面で開く ↗</a>
                </div>
            </div>`;
    } else if (isPdf) {
        previewHtml = `
            <div id="detail-img-container" class="type-pdf">
                <div class="iframe-wrapper">
                    <iframe src="${link}#toolbar=0&navpanes=0&scrollbar=1&view=FitH"></iframe>
                </div>
                <div class="button-area">
                    <a href="${link}" target="_blank" class="visit-link">全画面で開く ↗</a>
                </div>
            </div>`;
    } else {
        previewHtml = `
            <div id="detail-img-container" class="type-web">
                <div class="iframe-wrapper">
                    <iframe src="${link}"></iframe>
                </div>
                <div class="button-area">
                    <a href="${link}" target="_blank" class="visit-link">全画面で開く ↗</a>
                </div>
            </div>`;
    }

    // 👑 【完全解決】自動での改行分割を完全にやめました。
    // HTMLから送られてきた文字の中に「<div」が入っているかどうかで処理を分けます。
    let balloonsHtml = "";
    
    if (desc.includes('<div')) {
        // 【DIVタグが書いてある場合】
        // あなたがHTMLに書いた複数の <div>...</div> 構造をそのまま画面に反映させます。
        balloonsHtml = desc;
    } else {
        // 【DIVタグがない、普通のテキストの場合】
        // 全体を自動的に1つの吹き出しクラス（balloon-text）で包みます。（<br>での改行もそのまま有効になります）
        balloonsHtml = `<div class="balloon-text">${desc}</div>`;
    }

    // スペックエリアの処理
    let specHtml = "";
    if (tool || time || target || scene) {
        specHtml = `
            <div class="spec-area" style="margin-top: 15px; display: flex; flex-direction: column; gap: 8px;">
                ${tool ? `<div class="spec-item" style="background:#FFF; border-radius:15px; padding:12px; border:2px solid #e2e2f9;"><strong>🎨 使用ツール</strong><br><span style="font-size:0.9rem; color:#888;">${tool}</span></div>` : ''}
                ${time ? `<div class="spec-item" style="background:#FFF; border-radius:15px; padding:12px; border:2px solid #e2e2f9;"><strong>⏰ 制作時間</strong><br><span style="font-size:0.9rem; color:#888;">${time}</span></div>` : ''}
                ${target ? `<div class="spec-item" style="background:#FFF; border-radius:15px; padding:12px; border:2px solid #e2e2f9;"><strong>👥 ターゲット</strong><br><span style="font-size:0.9rem; color:#888;">${target}</span></div>` : ''}
                ${scene ? `<div class="spec-item" style="background:#FFF; border-radius:15px; padding:12px; border:2px solid #e2e2f9;"><strong>📺 使用シーン</strong><br><span style="font-size:0.9rem; color:#888;">${scene}</span></div>` : ''}
            </div>
        `;
    }

    const infoHtml = `
        <div id="detail-desc-container">
            ${balloonsHtml}
            ${specHtml}
        </div>`;

    detailBody.innerHTML = previewHtml + infoHtml;
    document.getElementById('detail-page').classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 
}

function closeDetail() {
    document.getElementById('detail-page').classList.add('hidden');
    document.body.style.overflow = 'auto'; 
}