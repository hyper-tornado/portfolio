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

// 元の詳細表示・プレビュー枠ぴったりフィット条件分岐ロジックは一字一句削らず完全保持
function openDetail(title, link, desc, tool="", time="", target="", scene="") {
    const detailBody = document.getElementById('detail-body');
    const detailTitle = document.getElementById('detail-title');
    detailTitle.innerText = title;

    let previewHtml = "";

    const isImage = link.match(/\.(jpg|jpeg|png|gif|PNG)$/i) || link.includes(','); 
    const isPdf = link.match(/\.pdf$/i);

    if (isImage) {
        let imageTags = "";
        let containerClass = "type-image";

        if (link.includes(',')) {
            const imgList = link.split(',').map(s => s.trim());
            imageTags = imgList.map(src => `<img src="${src}" alt="プレビュー">`).join('');
            containerClass = "multi-active"; 
        } else {
            imageTags = `<img src="${link}" alt="プレビュー">`;
        }

        previewHtml = `
            <div id="detail-img-container" class="${containerClass}">
                <div class="iframe-wrapper">
                    ${imageTags}
                </div>
                <div class="button-area">
                    <a href="${link.split(',')[0].trim()}" target="_blank" class="visit-link">全画面で開く ↗</a>
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

    let balloonsHtml = "";
    if (desc.includes('<div')) {
        balloonsHtml = desc;
    } else {
        balloonsHtml = `<div class="balloon-text">${desc}</div>`;
    }

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

// ============================================================
// 🎠 修正：PC・スマホ共通で下部中央のボタンが完全に作動するカルーセル制御
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('hero-track');
    const prevBtn = document.getElementById('hero-prev-btn');
    const nextBtn = document.getElementById('hero-next-btn');
    
    if (!track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const maxImages = 4; // カルーセルのユニーク画像枚数
    let autoSlideInterval = null;

    const isMobile = () => window.innerWidth <= 768;

    // スライド移動を処理する共通の関数
    function updateSliderPosition() {
        track.style.animation = 'none';
        track.style.transition = 'transform 0.4s ease-in-out';

        if (isMobile()) {
            // スマホ：画像幅が表示枠の100%に固定されたため、単純に100%ずつのシフティングで完璧に連動します
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        } else {
            // PC：各画像の実際のレンダリング幅を測定して滑らかに移動
            const imgs = track.querySelectorAll('img');
            if (imgs.length > 0) {
                let moveX = 0;
                for (let i = 0; i < currentIndex; i++) {
                    moveX += imgs[i].clientWidth;
                }
                track.style.transform = `translateX(-${moveX}px)`;
            }
        }
    }

    // 次へボタン
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopAutoSlide(); // 手動クリックされたら一旦自動をクリア

        currentIndex++;
        if (currentIndex >= maxImages) {
            currentIndex = 0; 
        }
        updateSliderPosition();
        startAutoSlide(); // 操作後に自動巡回を再起動
    });

    // 前へボタン
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopAutoSlide();

        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = maxImages - 1; 
        }
        updateSliderPosition();
        startAutoSlide();
    });

    // 自動スライドショーのタイマー（スマホは4秒ごとにページ送り、PCは無限スクロール）
    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        
        autoSlideInterval = setInterval(() => {
            if (isMobile()) {
                // スマホ時は4秒ごとに1枚ずつきれいにスライドめくり
                currentIndex++;
                if (currentIndex >= maxImages) currentIndex = 0;
                updateSliderPosition();
            } else {
                // PC時は元の滑らかなCSS無限横スクロールを優先して走らせる
                if (track.style.animationName !== 'scrollFullSlider' && (track.style.animation === '' || track.style.animation === 'none')) {
                    track.style.transform = '';
                    track.style.transition = '';
                    track.style.animation = 'scrollFullSlider 84s linear infinite';
                }
            }
        }, 4000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    // 画面サイズ変更（リサイズ）時のリセット処理
    window.addEventListener('resize', () => {
        if (!isMobile()) {
            track.style.transform = '';
            track.style.transition = '';
            track.style.animation = 'scrollFullSlider 84s linear infinite';
            startAutoSlide();
        } else {
            track.style.animation = 'none';
            updateSliderPosition();
            startAutoSlide();
        }
    });

    // 初回起動時の振り分け
    if (isMobile()) {
        track.style.animation = 'none';
        updateSliderPosition();
    } else {
        track.style.animation = 'scrollFullSlider 84s linear infinite';
    }
    startAutoSlide();
});