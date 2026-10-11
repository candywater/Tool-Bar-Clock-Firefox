// SPDX-License-Identifier: MPL-2.0

function getAllTimezones() {
    if (Intl && typeof Intl.supportedValuesOf === 'function') {
        return Intl.supportedValuesOf('timeZone');
    }

    // Fallback for older runtimes.
    return [
        'UTC',
        'Africa/Cairo',
        'Africa/Johannesburg',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'America/New_York',
        'America/Sao_Paulo',
        'Asia/Bangkok',
        'Asia/Dubai',
        'Asia/Hong_Kong',
        'Asia/Kolkata',
        'Asia/Seoul',
        'Asia/Shanghai',
        'Asia/Singapore',
        'Asia/Tokyo',
        'Australia/Sydney',
        'Europe/Berlin',
        'Europe/London',
        'Europe/Paris',
        'Pacific/Auckland'
    ];
}

function toTimezoneLabel(timeZone) {
    return timeZone.replace(/_/g, ' ');
}

function renderTimezoneOptions(selector, allTimezones, filterValue, selectedTimeZone) {
    const query = filterValue.trim().toLowerCase();
    const filtered = allTimezones.filter((tz) => (
        tz.toLowerCase().includes(query) || toTimezoneLabel(tz).toLowerCase().includes(query)
    ));

    selector.textContent = '';

    filtered.forEach((tz) => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = `${toTimezoneLabel(tz)} (${tz})`;
        selector.appendChild(option);
    });

    if (filtered.length === 0) {
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'No matching time zones';
        emptyOption.disabled = true;
        emptyOption.selected = true;
        selector.appendChild(emptyOption);
        return;
    }

    if (filtered.includes(selectedTimeZone)) {
        selector.value = selectedTimeZone;
    } else {
        selector.value = filtered[0];
    }
}

function saveSettings(timeZone, color, autoTheme) {
    // 選択された時区と色を保存
    browser.storage.sync.set({ 
        timeZone: timeZone,
        iconColor: color,
        autoTheme: autoTheme
    }).then(() => {
        // 保存メッセージ表示
        const status = document.getElementById('status');
        status.textContent = 'Settings saved.';
        setTimeout(() => { status.textContent = ''; }, 750);
        
        // background.js にアイコン更新のメッセージを送信する
        browser.runtime.sendMessage({ action: "updateIcon" });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('timezoneOffset');
    const filterInput = document.getElementById('timezoneFilter');
    const colorSelector = document.getElementById('iconColorSelector');
    const autoThemeSelector = document.getElementById('autoThemeSelector');
    const allTimezones = getAllTimezones();
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    let currentSelectedTimeZone = localTimeZone;

    // 保存された設定を読み込み、選択状態を復元
    browser.storage.sync.get(['timeZone', 'iconColor', 'autoTheme']).then(data => {
        // default: Local Time Zone
        const savedTimeZone = allTimezones.includes(data.timeZone) ? data.timeZone : localTimeZone;
        currentSelectedTimeZone = savedTimeZone;

        renderTimezoneOptions(selector, allTimezones, '', savedTimeZone);

        const savedColor = data.iconColor ?? '#FFFFFF';
        colorSelector.value = savedColor.toString();
        autoThemeSelector.checked = data.autoTheme !== false;
        colorSelector.disabled = autoThemeSelector.checked;
    });

    filterInput.addEventListener('input', () => {
        renderTimezoneOptions(selector, allTimezones, filterInput.value, currentSelectedTimeZone);
    });

    // 変更されたら設定を保存する
    selector.addEventListener('change', () => {
        const timeZone = selector.value;
        if (!timeZone) {
            return;
        }
        currentSelectedTimeZone = timeZone;
        const color = colorSelector.value;
        saveSettings(timeZone, color, autoThemeSelector.checked);
    });
    // 変更されたら設定を保存する
    colorSelector.addEventListener('change', () => {
        const timeZone = selector.value || currentSelectedTimeZone;
        const color = colorSelector.value;
        saveSettings(timeZone, color, autoThemeSelector.checked);
    });
    autoThemeSelector.addEventListener('change', () => {
        colorSelector.disabled = autoThemeSelector.checked;
        const timeZone = selector.value || currentSelectedTimeZone;
        saveSettings(timeZone, colorSelector.value, autoThemeSelector.checked);
    });
});