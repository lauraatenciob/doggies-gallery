const API_URL_RANDOM = "https://api.thedogapi.com/v1/images/search";
const API_URL_FAVORITES = "https://api.thedogapi.com/v1/favourites";
const API_URL_FAVORITES_DELETE = (id) =>
  `https://api.thedogapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = "https://api.thedogapi.com/v1/images/upload";

const spanError = document.getElementById("error");

async function getNewDogImages() {
  try {
    const response = await fetch(API_URL_RANDOM);

    if (response.status !== 200) {
      throw new Error("Hubo un error: " + response.status);
    }

    const data = await response.json();
    console.log("random");
    console.log(data);

    const imageElement1 = document.getElementById("dog-image1");
    const addBtn1 = document.getElementById("add-fav1");

    imageElement1.src = data[0].url;
    addBtn1.onclick = () => saveFavDog(data[0].id);
  } catch (error) {
    spanError.innerText = error.message;
  }
}
getNewDogImages();

async function getFavDogImages() {
  try {
    const response = await fetch(API_URL_FAVORITES, {
      method: "GET",
      headers: {
        "X-API-KEY":
          "live_fc77FRUbgDCRMt1cN33CEqsbldvBtA72B9FsrqaZBjZ1G33Hn8lP0wAaXHXlUbTZ",
      },
    });
    const data = await response.json();
    console.log("favorites");
    console.log(data);

    if (response.status !== 200) {
      throw new Error("Hubo un error: " + response.status);
    }

    const favoriteSection = data.map(
      (dog) =>
        `<article>
          <div id="img-container">
            <img id="${dog.image.id}" alt="foto perrito aleatorio" src="${dog.image.url}"/>
            <button class="btn-delete" onclick="deleteFavDog('${dog.id}')">X</button>
          </div>
        </article>`
    );
    const favContainer = document.getElementById("favorites-container");
    favContainer.innerHTML = favoriteSection.toString().replaceAll(",", "");
  } catch (error) {
    console.log(error);
    spanError.innerText = error;
  }
}
getFavDogImages();

async function saveFavDog(id) {
  const body = JSON.stringify({
    image_id: id,
  });
  const res = await fetch(API_URL_FAVORITES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY":
        "live_fc77FRUbgDCRMt1cN33CEqsbldvBtA72B9FsrqaZBjZ1G33Hn8lP0wAaXHXlUbTZ",
    },
    body: body,
  });
  console.log("saved");
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerText = "Hubo un error: " + res.status + data.message;
  } else {
    getFavDogImages();
  }
}

async function deleteFavDog(id) {
  const res = await fetch(API_URL_FAVORITES_DELETE(id), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY":
        "live_fc77FRUbgDCRMt1cN33CEqsbldvBtA72B9FsrqaZBjZ1G33Hn8lP0wAaXHXlUbTZ",
    },
  });
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerText = "Hubo un error: " + res.status + data.message;
  } else {
    console.log("deleted");
    getFavDogImages();
  }
}

async function uploadDoggyPhoto() {
  const form = document.getElementById("uploadingForm");
  const formData = new FormData(form);
  const res = await fetch(API_URL_UPLOAD, {
    method: "POST",
    headers: {
      "X-API-KEY":
        "live_fc77FRUbgDCRMt1cN33CEqsbldvBtA72B9FsrqaZBjZ1G33Hn8lP0wAaXHXlUbTZ",
    },
    body: formData,
  });
  const data = await res.json();
  if (res.status !== 201) {
    spanError.innerText = "Hubo un error: " + res.status + data.message;
  } else {
    console.log("photo uploaded");
    console.log({ data });
  }
}

const input = document.getElementById("file");
const previewPhoto = () => {
  const file = input.files;
  if (file) {
    const fileReader = new FileReader();
    const preview = document.getElementById("file-preview");
    fileReader.onload = function (event) {
      preview.setAttribute("src", event.target.result);
      preview.className = "display";
    };
    fileReader.readAsDataURL(file[0]);
  } else {
    preview.className = "display-none";
  }
};

input.addEventListener("change", previewPhoto);
