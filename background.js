// SPDX-License-Identifier: MPL-2.0

// アイコンのサイズ
const ICON_SIZE = 38; 

function formatCurrentTimeWithTimeZone(timeZone) {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: timeZone
    });

    const parts = formatter.formatToParts(new Date());
    const hourPart = parts.find((part) => part.type === 'hour');
    const minutePart = parts.find((part) => part.type === 'minute');

    if (!hourPart || !minutePart) {
        throw new Error(`Failed to format time for time zone: ${timeZone}`);
    }

    return [hourPart.value, minutePart.value];
}

function isValidTimeZone(timeZone) {
    try {
        new Intl.DateTimeFormat('en-GB', { timeZone: timeZone });
        return true;
    } catch (error) {
        return false;
    }
}

// 旧設定との互換のために保持: 指定された時差に基づいて時刻を計算する関数
function getOffsetTime(offsetHours) {
    
    // 1. 現在のUTCタイムスタンプ（ミリ秒）を取得
    const utcMs = Date.now(); 

    // 2. 要求された時差 (時間) をミリ秒に変換
    const offsetMs = offsetHours * 3600000; 
    
    // 3. UTCタイムスタンプに時差を加算して、目標時刻のタイムスタンプを作成
    const targetMs = utcMs + offsetMs;

    // 4. 目標時差のDateオブジェクトを作成
    const targetTime = new Date(targetMs);

    // 5. HH:MM 形式にフォーマット (24時間表示)
    const HH = String(targetTime.getUTCHours()).padStart(2, '0');
    const MM = String(targetTime.getUTCMinutes()).padStart(2, '0');

    return [ HH, MM ]; // [ "HH", "MM" ] の配列として返す
}

function getSystemThemeColor() {
    if (typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches) {
        return '#FFFFFF';
    }

    return '#000000';
}

function getActionApi() {
    return browser.action || browser.browserAction;
}


// Canvasでアイコンに時間を描画し、アイコンを更新する関数
function updateIcon() {
    // ユーザー設定（色、フォント、時区）をストレージからまとめて読み込む
    browser.storage.sync.get(['iconColor', 'fontFamily', 'timeZone', 'offsetHours', 'autoTheme']).then(data => {

        const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        const selectedTimeZone = data.timeZone ?? localTimeZone;
        const activeTimeZone = isValidTimeZone(selectedTimeZone) ? selectedTimeZone : localTimeZone;

        let HH;
        let MM;

        if (data.timeZone) {
            [HH, MM] = formatCurrentTimeWithTimeZone(activeTimeZone);
        } else if (data.offsetHours !== undefined) {
            // 旧バージョン設定を保持
            const offsetHours = parseFloat(data.offsetHours);
            [HH, MM] = getOffsetTime(offsetHours);
        } else {
            [HH, MM] = formatCurrentTimeWithTimeZone(localTimeZone);
        }

        const userColor = data.autoTheme !== false
            ? getSystemThemeColor()
            : (data.iconColor ?? '#FFFFFF');
        const userFont = data.fontFamily ?? 'sans-serif'; 

        const canvas = new OffscreenCanvas(ICON_SIZE, ICON_SIZE);
        const ctx = canvas.getContext('2d');
        
        // 背景は透明
        ctx.fillStyle = 'transparent'; 
        ctx.fillRect(0, 0, ICON_SIZE, ICON_SIZE); 

        // ユーザーが選択した色を適用
        ctx.fillStyle = userColor; 
        ctx.textAlign = 'center';
        // フォント設定
        ctx.font = `bold 20px ${userFont}`; 

        // テキスト（HH, MM）の描画
        // HHを少し左にずらして描画
        ctx.fillText(HH, (ICON_SIZE / 2) - 4, 15); 

        // テキスト（MM）の描画
        // MMを少し右にずらして描画
        ctx.fillText(MM, (ICON_SIZE / 2) + 4, 36); 

        // アイコンの更新
        const imageData = ctx.getImageData(0, 0, ICON_SIZE, ICON_SIZE);
        const actionApi = getActionApi();
        actionApi.setIcon({ imageData: imageData });

        actionApi.setBadgeText({ text: '' }); 
        actionApi.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
    }).catch(error => {
        console.error("Icon update failed:", error);
    });
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateIcon") {
        updateIcon();
    }
});

if (typeof matchMedia === 'function') {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateIcon);
}

// 1秒ごとに時間を更新
setInterval(updateIcon, 1000); 
// 初期実行
updateIcon();