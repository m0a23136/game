const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("searchInput");

// アルバム表示
function renderPhotos(filterMemo = "") {
  const photos = getPhotos();

  gallery.innerHTML = "";

  // お題ごとに9つの枠を作成
  bingoPrompts.forEach((prompt, index) => {
    const cell = document.createElement("div");
    cell.className = "bingo-album-cell";

    // このお題で撮影した写真を探す
    const photo = photos.find(
      photo => photo.promptIndex === index
    );

    // メモ検索に一致しない場合は写真を表示しない
    const matchesSearch =
      !filterMemo ||
      (photo && (photo.memo || "")
        .toLowerCase()
        .includes(filterMemo.toLowerCase()));

    const title = document.createElement("div");
    title.className = "bingo-album-title";
    title.textContent = prompt;
    cell.appendChild(title);

    if (photo && matchesSearch) {
      // 写真がある場合
      cell.classList.add("completed");

      const img = document.createElement("img");
      img.src = photo.image;
      img.alt = prompt;
      cell.appendChild(img);

      const memo = document.createElement("div");
      memo.className = "bingo-album-memo";
      memo.textContent = photo.memo || "";
      cell.appendChild(memo);

      const date = document.createElement("div");
      date.className = "date";
      date.textContent = photo.date || "";
      cell.appendChild(date);

      // 削除ボタン
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-btn";
      deleteButton.textContent = "削除";

      deleteButton.addEventListener("click", () => {
        const confirmDelete = confirm(
          "この写真を削除しますか？"
        );

        if (!confirmDelete) return;

        const updatedPhotos = getPhotos().filter(
          item => item.id !== photo.id
        );

        savePhotos(updatedPhotos);

        // 写真を削除したお題は未達成に戻す
        const completed = JSON.parse(
          localStorage.getItem("bingoCompleted")
        ) || Array(9).fill(false);

        completed[index] = false;

        localStorage.setItem(
          "bingoCompleted",
          JSON.stringify(completed)
        );

        // アルバムとビンゴの表示を更新
        renderPhotos(searchInput.value);
        renderBingo();
      });

      cell.appendChild(deleteButton);

    } else {
      // 写真がない場合、または検索に一致しない場合
      cell.classList.add("empty");

      const placeholder = document.createElement("div");
      placeholder.className = "bingo-album-placeholder";
      placeholder.textContent = "まだ写真がありません";

      cell.appendChild(placeholder);
    }

    gallery.appendChild(cell);
  });
}

// メモ検索
searchInput.addEventListener("input", event => {
  renderPhotos(event.target.value);
});