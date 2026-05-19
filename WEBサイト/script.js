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

// 👑 1枚も複数枚も完全に綺麗に処理するopenDetail関数
function openDetail(title, links, desc, tool="", time="", target="", scene="") {
    const detailBody = document.getElementById('detail-body');
    const detailTitle = document.getElementById('detail-title');
    detailTitle.innerText = title;

    // カンマ「,」で区切られたファイルパスを配列に分解する
    const linkArray = links.split(',').map(l => l.trim());
    
    let innerContentHtml = "";
    let buttonAreaHtml = "";

    // 画像の枚数分ループを回してHTMLを組み立てる
    linkArray.forEach((link, index) => {
        const isImage = link.match(/\.(jpg|jpeg|png|gif|PNG)$/i);
        const isPdf = link.match(/\.pdf$/i);

        if (isImage) {
            innerContentHtml += `<img src="${link}" alt="プレビュー ${index + 1}">`;
            buttonAreaHtml += `<a href="${link}" target="_blank" class="visit-link">全画面で開く ${linkArray.length > 1 ? index + 1 : ''} ↗</a>`;
        } else if (isPdf) {
            innerContentHtml += `<iframe src="${link}#toolbar=0&navpanes=0&scrollbar=1&view=FitH"></iframe>`;
            buttonAreaHtml += `<a href="${link}" target="_blank" class="visit-link">全画面で開く ↗</a>`;
        } else {
            innerContentHtml += `<iframe src="${link}"></iframe>`;
            buttonAreaHtml += `<a href="${link}" target="_blank" class="visit-link">全画面で開く ↗</a>`;
        }
    });

    // 1枚目パスの拡張子でベースのレイアウト（クラス名）を決める
    const firstLink = linkArray[0];
    const isFirstImage = firstLink.match(/\.(jpg|jpeg|png|gif|PNG)$/i);
    let containerClass = isFirstImage ? "type-image" : "type-pdf";

    // 🌟 2枚以上あるときは「multi-active」クラスを合体させて、枠を下に自動拡張させる
    if (linkArray.length > 1) {
        containerClass += " multi-active";
    }

    let previewHtml = `
        <div id="detail-img-container" class="${containerClass}">
            <div class="iframe-wrapper">
                ${innerContentHtml}
            </div>
            <div class="button-area">
                ${buttonAreaHtml}
            </div>
        </div>`;

    // 説明文吹き出しの処理
    let balloonsHtml = "";
    if (desc.includes('<div')) {
        balloonsHtml = desc;
    } else {
        balloonsHtml = `<div class="balloon-text">${desc}</div>`;
    }

    // 下部スペックエリアの処理
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