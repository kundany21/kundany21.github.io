const base = /*'http://localhost:8080'*/ 'https://160.251.9.161:8080';
const icons = [
    'bronze_01.png', 'bronze_02.png', 'bronze_03.png',
    'silver_01.png', 'silver_02.png', 'silver_03.png',
    'gold_01.png', 'gold_02.png', 'gold_03.png',
    'platinum_01.png', 'platinum_02.png', 'platinum_03.png',
    'diamond_01.png', 'diamond_02.png', 'diamond_03.png',
    'Elite.png', 'Champion.png', 'Unreal.png'
]
const place = {
    ja: (value) => `${value}位`,
    en: (value) => `${value}${['ST','ND','RD'][((value+90)%100-10)%10-1]||'TH'}`
}
const names = {
    ja: [
        'ブロンズ I', 'ブロンズ II', 'ブロンズ III',
        'シルバー I', 'シルバー II', 'シルバー III',
        'ゴールド I', 'ゴールド II', 'ゴールド III',
        'プラチナ I', 'プラチナ II', 'プラチナ III',
        'ダイヤモンド I', 'ダイヤモンド II', 'ダイヤモンド III',
        'エリート', 'チャンピオン', 'アンリアル', 'ランクなし'
    ],
    en: [
        'BRONZE I', 'BRONZE II', 'BRONZE III',
        'SILVER I', 'SILVER II', 'SILVER III',
        'GOLD I', 'GOLD II', 'GOLD III',
        'PLATINUM I', 'PLATINUM II', 'PLATINUM III',
        'DIAMOND I', 'DIAMOND II', 'DIAMOND III',
        'ELITE', 'CHAMPION', 'UNREAL', 'UNRANKED'
    ]
}
const classes = [
    'tier-bronze', 'tier-silver', 'tier-gold', 'tier-platinum', 'tier-diamond',
    'tier-elite', 'tier-champion', 'tier-unreal'
]

const params = new URL(window.location.href).searchParams;
const account_id = params.get('account_id') || null;
const ranking_type = params.get('ranking_type') || 'ranked-br'
const language = params.get('language') || 'ja'

const rank = document.getElementById('rank');
const name = document.getElementById('name');
const progress = document.getElementById('progress');
const progress_bar = document.getElementById('progress_bar');

async function update() {
    console.log('Updating');
    const response = await fetch(`${base}/api/fortnite/rank/${account_id}`);
    const data = await response.json();
    const entry = data
        .sort((a, b) => Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated))
        .find((element) => element.rankingType == ranking_type);
    let index;
    if (entry.currentDivision >= 16) {
        index = Math.floor(15 / 3) + (entry.currentDivision - 16);
    } else {
        index = Math.floor(entry.currentDivision / 3);
    }
    rank.src = `assets/icons/${icons[entry.currentDivision]}`;
    name.innerText = names[language][entry.currentDivision];
    if (entry.currentPlayerRanking !== null) {
        progress.innerText = place[language](entry.currentPlayerRanking);
    } else {
        const value = Math.round(entry.promotionProgress * 100);
        if (value === 0 || value === 100) {
            progress.innerText = `${value}%`;
        } else {
            progress.innerText = `${value - 1}%`;
        }
    }
    progress_bar.setAttribute('class', classes[index]);
    progress_bar.setAttribute('value', entry.promotionProgress);
}

(() => {
    name.innerText = names[language].slice(-1)[0];
    if (account_id === null) {
        return;
    }

    update();
    setInterval(update, 1 * 60 * 1000);
})();