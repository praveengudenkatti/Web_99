api_array = [
    'https://api.waifu.pics/nsfw/waifu',
    'https://api.waifu.pics/nsfw/neko',
    'https://api.waifu.pics/nsfw/neko',
    'https://api.waifu.pics/nsfw/blowjob'
]



api_random = Math.floor(Math.random() * api_array.length);
selected_image = api_array[api_random]
console.log(selected_image);
const api_url = selected_image
    async function getISS() {
      const response = await fetch(api_url);
      const data = await response.json();
      var img = new Image();
      document.getElementById("img-container").appendChild(img)
      img.setAttribute("class", "image")
      img.src = data.url;
      ok = img.src
      console.log("success " + ok[23]);
    }

    getISS()