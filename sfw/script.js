const API_URLS = [
  "https://api.waifu.pics/sfw/neko",
  "https://api.waifu.pics/sfw/waifu",
  "https://api.waifu.pics/sfw/shinobu",
  "https://api.waifu.pics/sfw/megumin",
  "https://api.waifu.im/search/?included_tags=raiden-shogun",
  "https://api.waifu.im/search/?included_tags=marin-kitagawa",
  "https://api.waifu.im/search/?included_tags=maid",
  "https://api.waifu.im/search/?included_tags=selfies",
];

const imgContainer = document.querySelector(".image-container");
const newImgBtn = document.querySelector("#new-image-btn");
const downloadBtn = document.querySelector("#download-btn");

let currentImgUrl = "";

function getRandomApiUrl() {
  return API_URLS[Math.floor(Math.random() * API_URLS.length)];
}

async function getNewImage() {
  const apiUrl = getRandomApiUrl();
  console.log(apiUrl)
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    let imgUrl;
    if (data.url) {
      imgUrl = data.url;
    } else if (data.images) {
      imgUrl = data.images[0].url;
    }
    imgContainer.innerHTML = `<img src="${imgUrl}" alt="Waifu image">`;
    currentImgUrl = imgUrl;
  } catch (error) {
    console.log('Error fetching image:', error);
    imgContainer.innerHTML = '<p>Sorry, an error occurred while fetching the image. Please try again later.</p>';
  }
}

getNewImage();

async function downloadImage() {
  const link = document.createElement("a");
  link.href = currentImgUrl;
  link.download = currentImgUrl.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

newImgBtn.addEventListener("click", getNewImage);
downloadBtn.addEventListener("click", downloadImage);
