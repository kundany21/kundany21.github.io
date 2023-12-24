const texts = {
    en: {
        display_name: 'Display Name',
        ranking_type: 'Mode',
        ranked_br: 'Battle Royale',
        ranked_zb: 'Zero Build',
        generate: 'Generate URL',
        notfound: 'User not found',
        epic: 'This is non-official service and not endorsed by Epic Games Inc.'
    }
};

const language = 'en'; // Set the default language to English

document.querySelectorAll('[langkey]').forEach(element => {
    element.innerText = texts[language][element.getAttribute('langkey')];
});

const base = /*'http://localhost:8080'*/ 'http://160.251.9.161:8080';
const origin = window.location.origin;

const display_name = document.getElementById('display_name');
const ranking_type = document.getElementById('ranking_type');
const generate_button = document.getElementById('generate_button');
const copy_button = document.getElementById('copy_button');
const output = document.getElementById('url');
const error = document.getElementById('error');

generate_button.onclick = async () => {
    output.value = '';
    error.classList.remove('show');
    const response = await fetch(`${base}/api/fortnite/rank/fetch_user_by_display_name?${new URLSearchParams({display_name: display_name.value})}`);
    if (!response.ok) {
        error.classList.add('show');
        error.firstElementChild.innerText = texts[language].notfound;
        return;
    }

    const data = await response.json();
    const url = new URL(`${origin}/widget.html`);
    url.searchParams.append('account_id', data.account_id);
    url.searchParams.append('ranking_type', ranking_type.value);
    url.searchParams.append('language', language);
    output.value = url.toString();
};

copy_button.onclick = () => {
    navigator.clipboard.writeText(output.value);
};
