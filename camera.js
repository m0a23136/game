const shutterSound = new Audio("shutter.mp3");

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");
const switchCameraBtn = document.getElementById("switchCameraBtn");

let currentCamera = "environment";
let currentStream = null;
let pendingPhoto = null;

// カメラ起動
async function startCamera() {
  try {
    // 既存カメラを停止
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      currentStream = null;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: currentCamera
      },
      audio: false
    });

    currentStream = stream;
    video.srcObject = stream;

  } catch (error) {
    alert("カメラにアクセスできません");
    console.error(error);
  }
}

// カメラ切替
switchCameraBtn.addEventListener("click", () => {
  currentCamera =
    currentCamera === "environment" ? "user" : "environment";

  startCamera();
});

// 撮影して保存
captureBtn.addEventListener("click", () => {
  // カメラ映像が準備できているか確認
  if (!video.videoWidth || !video.videoHeight) {
    alert("カメラの準備ができていません。少し待ってから撮影してください。");
    return;
  }

  const context = canvas.getContext("2d");

  const width = video.videoWidth;
  const height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;

  context.drawImage(video, 0, 0, width, height);

  shutterSound.currentTime = 0;
  shutterSound.play().catch(error => {
    console.log("シャッター音を再生できませんでした", error);
  });

  const imageData = canvas.toDataURL("image/jpeg", 0.5);

  pendingPhoto = imageData;

  // メモ入力
  const memo = prompt("この写真の思い出を入力してください");

  // キャンセルされた場合は保存しない
  if (memo === null) {
    pendingPhoto = null;
    return;
  }

  const newPhoto = {
    id: Date.now(),
    image: imageData,
    tags: [],
    memo: memo,
    date: new Date().toLocaleString("ja-JP"),
    promptIndex: selectedPromptIndex
  };

  try {
    const photos = getPhotos();
    photos.push(newPhoto);
    savePhotos(photos);

    // 保存結果を確認
    const savedPhotos = getPhotos();
    const saved = savedPhotos.some(photo => photo.id === newPhoto.id);

    if (!saved) {
      throw new Error("写真の保存を確認できませんでした");
    }

    pendingPhoto = null;

    // 写真の保存に成功した場合のみ、お題を達成済みにする
    completeSelectedPrompt();

    alert("保存しました");

  } catch (error) {
    pendingPhoto = null;
    alert("写真を保存できませんでした");
    console.error(error);
  }
});

// 最初はカメラを起動しない。
// お題を選び「このお題で撮影する」を押したときに起動する。