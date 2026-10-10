// SPDX-License-Identifier: MPL-2.0

function saveOptions() {
    const fontFamily = document.getElementById('fontFamilySelector').value;
  
    // ストレージに設定を保存 (フォントのみ)
    browser.storage.sync.set({
        fontFamily: fontFamily
    }).then(() => {
        const status = document.getElementById('status');
        status.textContent = 'Save Settings.';
        setTimeout(() => {
            status.textContent = '';
        }, 750);
  
        // アイコンを更新
        browser.runtime.getBackgroundPage(function(backgroundPage) {
            if (backgroundPage && backgroundPage.updateIcon) {
                backgroundPage.updateIcon();
            }
        });
    });
  }
  
  function restoreOptions() {
    // 保存されているフォントを読み込み
    browser.storage.sync.get(['fontFamily']).then(data => {
        if (data.fontFamily) {
            document.getElementById('fontFamilySelector').value = data.fontFamily;
        }
    });
  }
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('fontFamilySelector').addEventListener('change', saveOptions);