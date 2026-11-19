const bingoPage = document.getElementById("bingoPage");
const promptPage = document.getElementById("promptPage");
const cameraPage = document.getElementById("cameraPage");
const albumPage = document.getElementById("albumPage");

const bingoCard = document.getElementById("bingoCard");
const bingoStatus = document.getElementById("bingoStatus");
const promptText = document.getElementById("promptText");
const currentPrompt = document.getElementById("currentPrompt");

// ビンゴのお題
const bingoPrompts = [
  "雨の日",
  "家の中",
  "花を撮る",
  "食べ物と一緒に撮る",
  "公園で撮る",
  "空を撮る",
  "季節を感じるものを撮る",
  "食べたものを撮る",
  "電車を撮る"
];


// 達成状況
let completedPrompts = JSON.parse(
  localStorage.getItem("bingoCompleted")
) || Array(9).fill(false);

// 選択中のお題
let selectedPromptIndex = null;

// 画面切り替え
function showPage(page) {
  bingoPage.style.display = "none";
  promptPage.style.display = "none";
  cameraPage.style.display = "none";
  albumPage.style.display = "none";

  page.style.display = "block";
}

// ビンゴカードを表示
function renderBingo() {
  bingoCard.innerHTML = "";

  bingoPrompts.forEach((prompt, index) => {
    const cell = document.createElement("button");
    cell.className = "bingo-cell";

    if (completedPrompts[index]) {
      cell.classList.add("completed");
      cell.textContent = "✓\n" + prompt;
    } else {
      cell.textContent = prompt;
    }

    cell.addEventListener("click", () => {
      if (completedPrompts[index]) {
        alert("このお題は達成済みです！");
        return;
      }

      selectedPromptIndex = index;
      promptText.textContent = prompt;
      showPage(promptPage);
    });

    bingoCard.appendChild(cell);
  });

  const count = completedPrompts.filter(Boolean).length;
  bingoStatus.textContent = `達成したお題：${count} / 9`;
}

// お題確認画面から撮影へ
document.getElementById("startShooting").addEventListener("click", () => {
  if (selectedPromptIndex === null) {
    return;
  }

  currentPrompt.textContent =
    "今回のお題：" + bingoPrompts[selectedPromptIndex];

  showPage(cameraPage);

  startCamera();
});

// ビンゴ画面に戻る
document.getElementById("backBingo").addEventListener("click", () => {
  showPage(bingoPage);
});

// 撮影画面からビンゴへ戻る
document.getElementById("backToBingo").addEventListener("click", () => {
  showPage(bingoPage);
});

// アルバムを開く
document.getElementById("openAlbum").addEventListener("click", () => {
  renderPhotos();
  showPage(albumPage);
});

// 撮影画面からアルバムを開く
document.getElementById("openAlbumFromCamera").addEventListener("click", () => {
  renderPhotos();
  showPage(albumPage);
});

// アルバムからビンゴに戻る
document.getElementById("backBingoFromAlbum").addEventListener("click", () => {
  showPage(bingoPage);
});

// お題を達成済みにする
function completeSelectedPrompt() {
  if (selectedPromptIndex === null) {
    return;
  }

  completedPrompts[selectedPromptIndex] = true;

  localStorage.setItem(
    "bingoCompleted",
    JSON.stringify(completedPrompts)
  );

  selectedPromptIndex = null;

  renderBingo();
  showPage(bingoPage);
}

// 実験データのリセット
document.getElementById("resetBingo").addEventListener("click", () => {
  const confirmed = confirm(
    "ビンゴの達成状況と保存した写真をすべて削除しますか？\nこの操作は取り消せません。"
  );

  if (!confirmed) {
    return;
  }

  // ビンゴの達成状況をリセット
  completedPrompts = Array(9).fill(false);

  localStorage.setItem(
    "bingoCompleted",
    JSON.stringify(completedPrompts)
  );

  // 保存した写真を削除
  localStorage.removeItem("photos");

  // お題の選択状態を解除
  selectedPromptIndex = null;

  // 画面を更新
  renderBingo();

  alert("実験データをリセットしました。");
});

// 初期表示
renderBingo();
showPage(bingoPage);

